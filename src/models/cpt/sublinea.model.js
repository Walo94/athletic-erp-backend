import { connectCPT, connectUpCPT } from '../../config/db.js';
import sql from 'mssql';

const _getDbConfig = (empresa) => {
    if (empresa === 'athletic') {
        return { pool: connectCPT, db1: 'CPT', db2: 'RCPT' };
    } else if (empresa === 'uptown') {
        return { pool: connectUpCPT, db1: 'UptownCPT', db2: 'UptownRCPT' };
    }
    throw new Error('Empresa no válida. Debe ser "athletic" o "uptown".');
};

const _mapSublineaData = (dbRecord) => {
    if (!dbRecord) return null;
    return {
        sublinea: dbRecord.Sublinea,
        descripcion: dbRecord.Descripcion
    };
};

export const SublineaModel = {
    /**
     * Crea una sublínea en ambas bases de datos.
     */
    create: async (data, empresa) => {
        const { pool, db1, db2 } = _getDbConfig(empresa);
        const connection = await pool();
        const transaction = connection.transaction();
        try {
            await transaction.begin();
            const request = transaction.request();
            request.input('sublinea', sql.Int, data.sublinea);
            request.input('descripcion', sql.VarChar(30), data.descripcion);

            const queryTemplate = `
                INSERT INTO %db%.dbo.SubLineas (Sublinea, Descripcion) 
                VALUES (@sublinea, @descripcion)`;

            await request.query(queryTemplate.replace('%db%', db1));
            await request.query(queryTemplate.replace('%db%', db2));

            await transaction.commit();
            return { sublinea: data.sublinea, descripcion: data.descripcion };
        } catch (err) {
            console.error('Error en la transacción de CREAR Sublínea, haciendo rollback...', err);
            await transaction.rollback();
            throw err;
        }
    },

    /**
     * Obtiene todas las sublíneas.
     */
    findAll: async (empresa) => {
        const { pool, db1 } = _getDbConfig(empresa);
        const connection = await pool();
        const result = await connection.request().query(`SELECT Sublinea, Descripcion FROM ${db1}.dbo.SubLineas ORDER BY Sublinea`);
        return result.recordset.map(_mapSublineaData);
    },

    /**
     * Actualiza una sublínea en ambas bases de datos.
     */
    update: async (sublineaId, data, empresa) => {
        const { pool, db1, db2 } = _getDbConfig(empresa);
        const connection = await pool();
        const transaction = connection.transaction();
        try {
            await transaction.begin();
            const request = transaction.request();
            request.input('sublineaId', sql.Int, sublineaId);
            request.input('descripcion', sql.VarChar(30), data.descripcion);

            const queryTemplate = `
                UPDATE %db%.dbo.SubLineas 
                SET Descripcion = @descripcion 
                WHERE Sublinea = @sublineaId`;

            await request.query(queryTemplate.replace('%db%', db1));
            await request.query(queryTemplate.replace('%db%', db2));

            await transaction.commit();
            return { sublinea: sublineaId, descripcion: data.descripcion };
        } catch (err) {
            console.error('Error en la transacción de ACTUALIZAR Sublínea, haciendo rollback...', err);
            await transaction.rollback();
            throw err;
        }
    },

    /**
     * Busca una sublínea por su clave primaria (ID).
     */
    findByPk: async (sublineaId, empresa) => {
        const { pool, db1 } = _getDbConfig(empresa);
        const connection = await pool();
        const result = await connection.request()
            .input('sublineaId', sql.Int, sublineaId)
            .query(`SELECT Sublinea, Descripcion FROM ${db1}.dbo.SubLineas WHERE Sublinea = @sublineaId`);

        return _mapSublineaData(result.recordset[0]);
    },
};