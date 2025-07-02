import { connectCPT, connectUpCPT } from '../../config/db.js';
import sql from 'mssql';

/**
 * Determina la configuración de la base de datos según la empresa.
 * @param {string} empresa - 'athletic' o 'uptown'.
 * @returns {object} Configuración de la base de datos.
 */
const _getDbConfig = (empresa) => {
    if (empresa === 'athletic') {
        return { pool: connectCPT, db1: 'CPT', db2: 'RCPT' };
    } else if (empresa === 'uptown') {
        return { pool: connectUpCPT, db1: 'UptownCPT', db2: 'UptownRCPT' };
    }
    throw new Error('Empresa no válida. Debe ser "athletic" o "uptown".');
};

/**
 * Mapea un registro de la base de datos a un objeto Marca.
 * @param {object} dbRecord - El registro de la base de datos.
 * @returns {object|null} El objeto Marca mapeado.
 */
const _mapMarcaData = (dbRecord) => {
    if (!dbRecord) return null;
    return {
        marca: dbRecord.Marca,
        descripcion: dbRecord.Descripcion
    };
};

export const MarcaModel = {
    /**
     * Crea una marca en ambas bases de datos usando una transacción.
     */
    create: async (data, empresa) => {
        const { pool, db1, db2 } = _getDbConfig(empresa);
        const connection = await pool();
        const transaction = connection.transaction();
        try {
            await transaction.begin();
            const request = transaction.request();
            request.input('marca', sql.TinyInt, data.marca);
            request.input('descripcion', sql.VarChar(25), data.descripcion);

            const queryTemplate = `
                INSERT INTO %db%.dbo.Marcas (Marca, Descripcion) 
                VALUES (@marca, @descripcion)
            `;
            
            await request.query(queryTemplate.replace('%db%', db1));
            await request.query(queryTemplate.replace('%db%', db2));

            await transaction.commit();
            return data;
        } catch (err) {
            console.error('Error en la transacción de CREAR Marca, haciendo rollback...', err);
            await transaction.rollback();
            throw err;
        }
    },

    /**
     * Obtiene todas las marcas de la base de datos principal.
     */
    findAll: async (empresa) => {
        const { pool, db1 } = _getDbConfig(empresa);
        const connection = await pool();
        const result = await connection.request().query(
            `SELECT Marca, Descripcion FROM ${db1}.dbo.Marcas ORDER BY Marca`
        );
        return result.recordset.map(_mapMarcaData);
    },

    /**
     * Actualiza una marca en ambas bases de datos usando una transacción.
     */
    update: async (marcaId, data, empresa) => {
        const { pool, db1, db2 } = _getDbConfig(empresa);
        const connection = await pool();
        const transaction = connection.transaction();
        try {
            await transaction.begin();
            const request = transaction.request();
            request.input('marcaId', sql.TinyInt, marcaId);
            request.input('descripcion', sql.VarChar(25), data.descripcion);

            const queryTemplate = `
                UPDATE %db%.dbo.Marcas 
                SET Descripcion = @descripcion
                WHERE Marca = @marcaId
            `;
            
            await request.query(queryTemplate.replace('%db%', db1));
            await request.query(queryTemplate.replace('%db%', db2));

            await transaction.commit();
            return { marca: marcaId, ...data };
        } catch (err) {
            console.error('Error en la transacción de ACTUALIZAR Marca, haciendo rollback...', err);
            await transaction.rollback();
            throw err;
        }
    },

    /**
     * Busca una marca por su clave primaria (ID).
     */
    findByPk: async (marcaId, empresa) => {
        const { pool, db1 } = _getDbConfig(empresa);
        const connection = await pool();
        const result = await connection.request()
            .input('marcaId', sql.TinyInt, marcaId)
            .query(`SELECT Marca, Descripcion FROM ${db1}.dbo.Marcas WHERE Marca = @marcaId`);

        return _mapMarcaData(result.recordset[0]);
    },
};