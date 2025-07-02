import { connectCPT, connectUpCPT } from '../../config/db.js';
import sql from 'mssql';

const _getDbConfig = (empresa) => {
  if (empresa === 'athletic') {
    return {
      pool: connectCPT,
      db1: 'CPT',
      db2: 'RCPT',
    };
  } else if (empresa === 'uptown') {
    return {
      pool: connectUpCPT,
      db1: 'UptownCPT',
      db2: 'UptownRCPT',
    };
  } else {
    throw new Error('Empresa no válida. Debe ser "athletic" o "uptown".');
  }
};

const _mapColorData = (dbRecord) => {
  if (!dbRecord) return null;
  return {
    color: dbRecord.Color,
    descripcion: dbRecord.Descripcion,
  };
};

export const ColorModel = {
  /**
   * Crea un color en ambas bases de datos de forma transaccional.
   */
  create: async (data, empresa) => {
    const { pool, db1, db2 } = _getDbConfig(empresa);
    const connection = await pool();
    const transaction = connection.transaction();

    try {
      await transaction.begin();
      const request = transaction.request();
      request.input('color', sql.SmallInt, data.color);
      request.input('descripcion', sql.VarChar(255), data.descripcion);

      const queryTemplate = `
        INSERT INTO %db%.dbo.Colores (color, descripcion) 
        VALUES (@color, @descripcion)`;

      await request.query(queryTemplate.replace('%db%', db1));
      await request.query(queryTemplate.replace('%db%', db2));

      await transaction.commit();
      return { color: data.color, descripcion: data.descripcion };
    } catch (err) {
      console.error('Error en la transacción de CREAR Color, haciendo rollback...', err);
      await transaction.rollback();
      throw err;
    }
  },

  findAll: async (empresa) => {
    const { pool, db1 } = _getDbConfig(empresa);
    const connection = await pool();
    const result = await connection.request().query(`SELECT Color, Descripcion FROM ${db1}.dbo.Colores ORDER BY Color`);
    return result.recordset.map(_mapColorData);
  },

  /**
   * Actualiza un color en ambas bases de datos de forma transaccional.
   */
  update: async (colorId, data, empresa) => {
    const { pool, db1, db2 } = _getDbConfig(empresa);
    const connection = await pool();
    const transaction = connection.transaction();

    try {
      await transaction.begin();
      const request = transaction.request();
      request.input('colorId', sql.SmallInt, colorId);
      request.input('descripcion', sql.VarChar(255), data.descripcion);

      const queryTemplate = `
        UPDATE %db%.dbo.Colores 
        SET Descripcion = @descripcion 
        WHERE Color = @colorId`;

      await request.query(queryTemplate.replace('%db%', db1));
      await request.query(queryTemplate.replace('%db%', db2));

      await transaction.commit();
      return { color: colorId, descripcion: data.descripcion };
    } catch (err) {
      console.error('Error en la transacción de ACTUALIZAR Color, haciendo rollback...', err);
      await transaction.rollback();
      throw err;
    }
  },

  findByPk: async (colorId, empresa) => {
    const { pool, db1 } = _getDbConfig(empresa);
    const connection = await pool();
    const result = await connection.request()
      .input('colorId', sql.SmallInt, colorId)
      .query(`SELECT Color, Descripcion FROM ${db1}.dbo.Colores WHERE Color = @colorId`);
    
    return _mapColorData(result.recordset[0]);
  },
};