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

const _mapCorridaData = (dbRecord) => {
  if (!dbRecord) return null;
  return {
    corrida: dbRecord.Corrida,
    descripcion: dbRecord.Descripcion,
    puntoInicial: dbRecord.PuntoInicial,
    puntoFinal: dbRecord.PuntoFinal
  };
};

export const CorridaModel = {
  /**
   * Crea una corrida en ambas bases de datos de forma transaccional.
   */
  create: async (data, empresa) => {
    const { pool, db1, db2 } = _getDbConfig(empresa);
    const connection = await pool();
    const transaction = connection.transaction();

    try {
      await transaction.begin();
      const request = transaction.request();
      request.input('corrida', sql.TinyInt, data.corrida);
      request.input('puntoInicial', sql.TinyInt, data.puntoInicial);
      request.input('puntoFinal', sql.TinyInt, data.puntoFinal);
      request.input('descripcion', sql.VarChar(255), data.descripcion);

      const queryTemplate = `
        INSERT INTO %db%.dbo.Corridas (corrida, puntoInicial, puntoFinal, descripcion) 
        VALUES (@corrida, @puntoInicial, @puntoFinal, @descripcion)`;

      await request.query(queryTemplate.replace('%db%', db1));
      await request.query(queryTemplate.replace('%db%', db2));

      await transaction.commit();
      return { corrida: data.corrida, puntoInicial: data.puntoInicial, puntoFinal: data.puntoFinal, descripcion: data.descripcion };
    } catch (err) {
      console.error('Error en la transacción de CREAR Corrida, haciendo rollback...', err);
      await transaction.rollback();
      throw err;
    }
  },

  findAll: async (empresa) => {
    const { pool, db1 } = _getDbConfig(empresa);
    const connection = await pool();
    const result = await connection.request().query(`SELECT Corrida, PuntoInicial, PuntoFinal, Descripcion FROM ${db1}.dbo.Corridas ORDER BY Corrida`);
    return result.recordset.map(_mapCorridaData);
  },

  /**
   * Actualiza una corrida en ambas bases de datos de forma transaccional.
   */
  update: async (corridaId, data, empresa) => {
    const { pool, db1, db2 } = _getDbConfig(empresa);
    const connection = await pool();
    const transaction = connection.transaction();

    try {
      await transaction.begin();
      const request = transaction.request();
      request.input('corridaId',  sql.TinyInt, corridaId);
      request.input('puntoInicial' , sql.TinyInt, data.puntoInicial);
      request.input('puntoFinal' , sql.TinyInt, data.puntoFinal);
      request.input('descripcion' , sql.VarChar(255), data.descripcion);

      const queryTemplate = `
        UPDATE %db%.dbo.Corridas 
        SET PuntoInicial = @puntoInicial, PuntoFinal = @puntoFinal, Descripcion = @descripcion 
        WHERE Corrida = @corridaId`;

      await request.query(queryTemplate.replace('%db%', db1));
      await request.query(queryTemplate.replace('%db%', db2));

      await transaction.commit();
      return { corrida: corridaId, puntoInicial: data.puntoInicial, puntoFinal:data.puntoFinal, descripcion: data.descripcion };
    } catch (err) {
      console.error('Error en la transacción de ACTUALIZAR Corrida, haciendo rollback...', err);
      await transaction.rollback();
      throw err;
    }
  },

  findByPk: async (corridaId, empresa) => {
    const { pool, db1 } = _getDbConfig(empresa);
    const connection = await pool();
    const result = await connection.request()
      .input('corridaId', sql.TinyInt, corridaId)
      .query(`SELECT Corrida, PuntoInicial, PuntoFinal, Descripcion FROM ${db1}.dbo.Corridas WHERE Corrida = @corridaId`);
    
    return _mapCorridaData(result.recordset[0]);
  },
};