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

const _mapMaterialData = (dbRecord) => {
  if (!dbRecord) return null;
  return {
    material: dbRecord.Material,
    descripcion: dbRecord.Descripcion
  };
};

export const MaterialModel = {
  /**
   * Crea un material en ambas bases de datos.
   */
  create: async (data, empresa) => {
    const { pool, db1, db2 } = _getDbConfig(empresa);
    const connection = await pool();
    const transaction = connection.transaction();
    try {
      await transaction.begin();
      const request = transaction.request();
      request.input('material', sql.SmallInt, data.material);
      request.input('descripcion', sql.VarChar(20), data.descripcion);

      const query1 = `INSERT INTO ${db1}.dbo.Materiales (Material, Descripcion) VALUES (@material, @descripcion)`;
      const query2 = `INSERT INTO ${db2}.dbo.Materiales (Material, Descripcion) VALUES (@material, @descripcion)`;

      await request.query(query1);
      await request.query(query2);

      await transaction.commit();
      return { material: data.material, descripcion: data.descripcion };
    } catch (err) {
      console.error('Error en la transacción de CREAR Material, haciendo rollback...', err);
      await transaction.rollback();
      throw err;
    }
  },

  /**
   * Obtiene todos los materiales.
   */
  findAll: async (empresa) => {
    const { pool, db1 } = _getDbConfig(empresa);
    const connection = await pool();
    const result = await connection.request().query(`SELECT Material, Descripcion FROM ${db1}.dbo.Materiales ORDER BY Material`);
    return result.recordset.map(_mapMaterialData);
  },

  /**
   * Actualiza un material en ambas bases de datos.
   */
  update: async (materialId, data, empresa) => {
    const { pool, db1, db2 } = _getDbConfig(empresa);
    const connection = await pool();
    const transaction = connection.transaction();
    try {
      await transaction.begin();
      const request = transaction.request();
      request.input('materialId', sql.SmallInt, materialId);
      request.input('descripcion', sql.VarChar(20), data.descripcion);

      const query1 = `UPDATE ${db1}.dbo.Materiales SET Descripcion = @descripcion WHERE Material = @materialId`;
      const query2 = `UPDATE ${db2}.dbo.Materiales SET Descripcion = @descripcion WHERE Material = @materialId`;

      await request.query(query1);
      await request.query(query2);

      await transaction.commit();
      return { material: materialId, descripcion: data.descripcion };
    } catch (err) {
      console.error('Error en la transacción de ACTUALIZAR Material, haciendo rollback...', err);
      await transaction.rollback();
      throw err;
    }
  },

  /**
   * Busca un material por su clave primaria (ID).
   */
  findByPk: async (materialId, empresa) => {
    const { pool, db1 } = _getDbConfig(empresa);
    const connection = await pool();
    const result = await connection.request()
      .input('materialId', sql.SmallInt, materialId)
      .query(`SELECT Material, Descripcion FROM ${db1}.dbo.Materiales WHERE Material = @materialId`);
    
    return _mapMaterialData(result.recordset[0]);
  },
};