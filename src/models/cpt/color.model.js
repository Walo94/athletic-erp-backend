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
      request.input('color', sql.Tinyint, data.color);
      request.input('descripcion', sql.VarChar(255), data.descripcion);

      const query1 = `INSERT INTO ${db1}.dbo.Colores (color, descripcion) VALUES (@color, @descripcion)`;
      const query2 = `INSERT INTO ${db2}.dbo.Colores (color, descripcion) VALUES (@color, @descripcion)`;

      await request.query(query1);
      await request.query(query2);

      await transaction.commit();
      // Se devuelve el objeto con las propiedades en minúsculas
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

    // Mapea cada registro al formato correcto antes de devolver
    return result.recordset.map(_mapColorData);
  },


  /**
 * Actualiza un color en ambas bases de datos de forma transaccional.
 */
  update: async (colorId, data, empresa) => {
    // ... (la lógica de la transacción no cambia)
    const { pool, db1, db2 } = _getDbConfig(empresa);
    const connection = await pool();
    const transaction = connection.transaction();

    try {
      await transaction.begin();
      const request = transaction.request();
      request.input('colorId', sql.Tinyint, colorId);
      request.input('descripcion', sql.VarChar(255), data.descripcion);

      const query1 = `UPDATE ${db1}.dbo.Colores SET Descripcion = @descripcion WHERE Color = @colorId`;
      const query2 = `UPDATE ${db2}.dbo.Colores SET Descripcion = @descripcion WHERE Color = @colorId`;

      await request.query(query1);
      await request.query(query2);

      await transaction.commit();
      // Se devuelve el objeto con las propiedades en minúsculas
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
      .input('colorId', sql.Tinyint, colorId)
      .query(`SELECT Color, Descripcion FROM ${db1}.dbo.Colores WHERE Color = @colorId`);
    
    // Mapea el único registro encontrado
    return _mapColorData(result.recordset[0]);
  },
};