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
 * Mapea un registro de la base de datos a un objeto Linea.
 * @param {object} dbRecord - El registro de la base de datos.
 * @returns {object|null} El objeto Linea mapeado.
 */
const _mapLineaData = (dbRecord) => {
    if (!dbRecord) return null;
    return {
        linea: dbRecord.Linea,
        descripcion: dbRecord.Descripcion,
        nuevaLinea: dbRecord.NuevaLinea,
        marca: dbRecord.Marca,
        sublinea: dbRecord.Sublinea
    };
};

export const LineaModel = {
    /**
     * Crea una línea en ambas bases de datos usando una transacción.
     */
    create: async (data, empresa) => {
        const { pool, db1, db2 } = _getDbConfig(empresa);
        const connection = await pool();
        const transaction = connection.transaction();
        try {
            await transaction.begin();
            const request = transaction.request();
            request.input('linea', sql.Int, data.linea);
            request.input('descripcion', sql.VarChar(30), data.descripcion);
            request.input('nuevaLinea', sql.Int, data.nuevaLinea);
            request.input('marca', sql.TinyInt, data.marca);
            request.input('sublinea', sql.Int, data.sublinea);

            const queryTemplate = `
                INSERT INTO %db%.dbo.Lineas (Linea, Descripcion, NuevaLinea, Marca, Sublinea) 
                VALUES (@linea, @descripcion, @nuevaLinea, @marca, @sublinea)
            `;
            
            await request.query(queryTemplate.replace('%db%', db1));
            await request.query(queryTemplate.replace('%db%', db2));

            await transaction.commit();
            return data;
        } catch (err) {
            console.error('Error en la transacción de CREAR Línea, haciendo rollback...', err);
            await transaction.rollback();
            throw err;
        }
    },

    /**
     * Obtiene todas las líneas de la base de datos principal.
     */
    findAll: async (empresa) => {
        const { pool, db1 } = _getDbConfig(empresa);
        const connection = await pool();
        const result = await connection.request().query(
            `SELECT Linea, Descripcion, Marca, Sublinea FROM ${db1}.dbo.Lineas ORDER BY Linea`
        );
        return result.recordset.map(_mapLineaData);
    },

    /**
     * Actualiza una línea en ambas bases de datos usando una transacción.
     */
    update: async (lineaId, data, empresa) => {
        const { pool, db1, db2 } = _getDbConfig(empresa);
        const connection = await pool();
        const transaction = connection.transaction();
        try {
            await transaction.begin();
            const request = transaction.request();
            request.input('lineaId', sql.Int, lineaId);
            request.input('descripcion', sql.VarChar(30), data.descripcion);
            request.input('marca', sql.TinyInt, data.marca);
            request.input('sublinea', sql.Int, data.sublinea);

            const queryTemplate = `
                UPDATE %db%.dbo.Lineas 
                SET Descripcion = @descripcion, Marca = @marca, Sublinea = @sublinea 
                WHERE Linea = @lineaId
            `;
            
            await request.query(queryTemplate.replace('%db%', db1));
            await request.query(queryTemplate.replace('%db%', db2));

            await transaction.commit();
            return { linea: lineaId, ...data };
        } catch (err) {
            console.error('Error en la transacción de ACTUALIZAR Línea, haciendo rollback...', err);
            await transaction.rollback();
            throw err;
        }
    },

    /**
     * Busca una línea por su clave primaria (ID).
     */
    findByPk: async (lineaId, empresa) => {
        const { pool, db1 } = _getDbConfig(empresa);
        const connection = await pool();
        const result = await connection.request()
            .input('lineaId', sql.Int, lineaId)
            .query(`SELECT Linea, Descripcion, NuevaLinea, Marca, Sublinea FROM ${db1}.dbo.Lineas WHERE Linea = @lineaId`);

        return _mapLineaData(result.recordset[0]);
    },
};