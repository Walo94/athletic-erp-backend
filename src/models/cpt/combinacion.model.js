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

const _mapCombinacionData = (dbRecord) => {
  if (!dbRecord) return null;
  return {
    combinacion: dbRecord.Combinacion,
    material1: dbRecord.Material1,
    color1: dbRecord.Color1,
    material2: dbRecord.Material2,
    color2: dbRecord.Color2,
    material3: dbRecord.Material3,
    color3: dbRecord.Color3,
    material4: dbRecord.Material4,
    color4: dbRecord.Color4,
    material5: dbRecord.Material5,
    color5: dbRecord.Color5,
    material6: dbRecord.Material6,
    color6: dbRecord.Color6,
  };
};

export const CombinacionModel = {
  /**
   * Crea una nueva combinación en ambas bases de datos.
   */
  create: async (data, empresa) => {
    const { pool, db1, db2 } = _getDbConfig(empresa);
    const connection = await pool();
    const transaction = connection.transaction();
    try {
      await transaction.begin();
      const request = transaction.request();
      
      // Mapeo de todos los campos, usando null para los opcionales no definidos
      request.input('combinacion', sql.SmallInt, data.combinacion);
      request.input('material1', sql.SmallInt, data.material1);
      request.input('color1', sql.SmallInt, data.color1);
      request.input('material2', sql.SmallInt, data.material2 || null);
      request.input('color2', sql.SmallInt, data.color2 || null);
      request.input('material3', sql.SmallInt, data.material3 || null);
      request.input('color3', sql.SmallInt, data.color3 || null);
      request.input('material4', sql.SmallInt, data.material4 || null);
      request.input('color4', sql.SmallInt, data.color4 || null);
      request.input('material5', sql.SmallInt, data.material5 || null);
      request.input('color5', sql.SmallInt, data.color5 || null);
      request.input('material6', sql.SmallInt, data.material6 || null);
      request.input('color6', sql.SmallInt, data.color6 || null);

      const queryTemplate = `
        INSERT INTO %db%.dbo.Combinaciones (
          Combinacion, Material1, Color1, Material2, Color2, Material3, Color3, 
          Material4, Color4, Material5, Color5, Material6, Color6
        ) VALUES (
          @combinacion, @material1, @color1, @material2, @color2, @material3, @color3,
          @material4, @color4, @material5, @color5, @material6, @color6
        )`;

      await request.query(queryTemplate.replace('%db%', db1));
      await request.query(queryTemplate.replace('%db%', db2));

      await transaction.commit();
      return data;
    } catch (err) {
      console.error('Error en la transacción de CREAR Combinación, haciendo rollback...', err);
      await transaction.rollback();
      throw err;
    }
  },

  /**
   * Obtiene todas las combinaciones.
   */
  findAll: async (empresa) => {
    const { pool, db1 } = _getDbConfig(empresa);
    const connection = await pool();
    const result = await connection.request().query(`SELECT * FROM ${db1}.dbo.Combinaciones ORDER BY Combinacion`);
    return result.recordset.map(_mapCombinacionData);
  },

  /**
   * Actualiza una combinación en ambas bases de datos.
   */
  update: async (combinacionId, data, empresa) => {
    const { pool, db1, db2 } = _getDbConfig(empresa);
    const connection = await pool();
    const transaction = connection.transaction();
    try {
      await transaction.begin();
      const request = transaction.request();
      
      request.input('combinacionId', sql.SmallInt, combinacionId);
      request.input('material1', sql.SmallInt, data.material1);
      request.input('color1', sql.SmallInt, data.color1);
      request.input('material2', sql.SmallInt, data.material2 || null);
      request.input('color2', sql.SmallInt, data.color2 || null);
      request.input('material3', sql.SmallInt, data.material3 || null);
      request.input('color3', sql.SmallInt, data.color3 || null);
      request.input('material4', sql.SmallInt, data.material4 || null);
      request.input('color4', sql.SmallInt, data.color4 || null);
      request.input('material5', sql.SmallInt, data.material5 || null);
      request.input('color5', sql.SmallInt, data.color5 || null);
      request.input('material6', sql.SmallInt, data.material6 || null);
      request.input('color6', sql.SmallInt, data.color6 || null);

      const queryTemplate = `
        UPDATE %db%.dbo.Combinaciones SET
          Material1 = @material1, Color1 = @color1, Material2 = @material2, Color2 = @color2,
          Material3 = @material3, Color3 = @color3, Material4 = @material4, Color4 = @color4,
          Material5 = @material5, Color5 = @color5, Material6 = @material6, Color6 = @color6
        WHERE Combinacion = @combinacionId
      `;

      await request.query(queryTemplate.replace('%db%', db1));
      await request.query(queryTemplate.replace('%db%', db2));

      await transaction.commit();
      return { combinacion: combinacionId, ...data };
    } catch (err) {
      console.error('Error en la transacción de ACTUALIZAR Combinación, haciendo rollback...', err);
      await transaction.rollback();
      throw err;
    }
  },

  /**
   * Busca una combinación por su clave primaria (ID).
   */
  findByPk: async (combinacionId, empresa) => {
    const { pool, db1 } = _getDbConfig(empresa);
    const connection = await pool();
    const result = await connection.request()
      .input('combinacionId', sql.SmallInt, combinacionId)
      .query(`SELECT * FROM ${db1}.dbo.Combinaciones WHERE Combinacion = @combinacionId`);
    
    return _mapCombinacionData(result.recordset[0]);
  },
};