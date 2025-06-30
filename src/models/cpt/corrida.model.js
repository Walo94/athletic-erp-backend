import { connectCPT, connectUpCPT } from '../../config/db.js';

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
      request.input('corrida', sql.Tinyint, data.corrida);
      request.input('puntoInicial', sql.Tinyint, data.puntoInicial);
      request.input('puntoFinal', sql.Tinyint, data.puntoFinal);
      request.input('descripcion', sql.VarChar(255), data.descripcion);

      const query1 = `INSERT INTO ${db1}.dbo.Corridas (corrida, puntoInicial, puntoFinal, descripcion) VALUES (@corrida, @puntoInicial, @puntoFinal, @descripcion)`;
      const query2 = `INSERT INTO ${db2}.dbo.Corridas (corrida, puntoInicial, puntoFinal, descripcion) VALUES (@corrida, @puntoInicial, @puntoFinal, @descripcion)`;

      await request.query(query1);
      await request.query(query2);

      await transaction.commit();
      // Se devuelve el objeto con las propiedades en minúsculas
      return { corrida: data.corrida, puntoInicial: data.puntoInicial, puntoFinal: data.puntoFinal, descripcion: data.descripcion };
    } catch (err) {
      console.error('Error en la transacción de CREAR Color, haciendo rollback...', err);
      await transaction.rollback();
      throw err;
    }
  },

  findAll: async (empresa) => {
    const { pool, db1 } = _getDbConfig(empresa);
    const connection = await pool();
    const result = await connection.request().query(`SELECT Corrida, PuntoInicial, PuntoFinal, Descripcion FROM ${db1}.dbo.Corridas ORDER BY Corrida`);

    // Mapea cada registro al formato correcto antes de devolver
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
      request.input('corridaId',  sql.Tinyint, corridaId);
      request.input('puntoInicial' , sql.Tinyint, data.puntoInicial);
      request.input('puntoFinal' , sql.Tinyint, data.puntoFinal);
      request.input('descripcion' , sql.VarChar(255), data.descripcion);

      const query1 = `UPDATE ${db1}.dbo.Corridas SET PuntoInicial = @puntoInicial, PuntoFinal = @puntoFinal, Descripcion = @descripcion WHERE Corrida = @corridaId`;
      const query2 = `UPDATE ${db2}.dbo.Corridas SET PuntoInicial = @puntoInicial, PuntoFinal = @puntoFinal, Descripcion = @descripcion WHERE Corrida = @corridaId`;

      await request.query(query1);
      await request.query(query2);

      await transaction.commit();
      // Se devuelve el objeto con las propiedades en minúsculas
      return { corrida: corridaId, puntoInicial: data.puntoInicial, puntoFinal:data.puntoFinal, descripcion: data.descripcion };
    } catch (err) {
      console.error('Error en la transacción de ACTUALIZAR Corrida, haciendo rollback...', err);
      await transaction.rollback();
      throw err;
    }
  },

  findByPk: async (colorId, empresa) => {
    const { pool, db1 } = _getDbConfig(empresa);
    const connection = await pool();
    const result = await connection.request()
      .input('corridaId', sql.Tinyint, colorId)
      .query(`SELECT Corrida, PuntoInicial, PuntoFinal, Descripcion FROM ${db1}.dbo.Corridas WHERE Corrida = @corridaId`);
    
    // Mapea el único registro encontrado
    return _mapCorridaData(result.recordset[0]);
  },
};