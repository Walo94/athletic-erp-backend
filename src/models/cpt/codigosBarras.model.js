import { connectRCPT, connectCPT } from '../../config/db.js';
import path from 'path';
import sql from 'mssql';
import DBFFile from 'dbffile';

const DATA_PATH = process.env.DATA_FILES_PATH;

export const CodigosBarrasModel = {
  /**
   * Obtiene los códigos y puntos de un producto desde la BD CPT.
   */
  getCodigosFromDB: async (producto) => {
    const pool = await connectCPT();
    const result = await pool.request()
      .input('producto', sql.Int, producto)
      .query(`
        SELECT Codigo, Punto 
        FROM CodigosdeBarras 
        WHERE Producto = @producto
        ORDER BY Punto;
      `);
    return result.recordset;
  },

  /**
   * Obtiene la corrida de un producto desde la BD RCPT.
   */
  getCorridaFromDB: async (producto) => {
    const pool = await connectRCPT();
    const result = await pool.request()
      .input('producto', sql.Int, producto)
      .query(`
        SELECT Corrida 
        FROM Productos 
        WHERE Producto = @producto;
      `);
    return result.recordset[0];
  },

   /**
   * Obtiene los puntos inicial y final de una corrida desde la BD CPT.
   */
  getPuntosFromDB: async (corrida) => {
    const pool = await connectCPT();
    const result = await pool.request()
      .input('corrida', sql.Int, corrida)
      .query(`
        SELECT PuntoInicial, PuntoFinal 
        FROM Corridas 
        WHERE Corrida = @corrida;
      `);
    return result.recordset[0];
  },

  /**
   * Inserta registros en el archivo CPTAMECO.DBF.
   */
  appendRecordsToDBF: async (registros) => {
    const dbfPath = path.join(DATA_PATH,  'CPTAMECO.DBF');
    let dbf = null;

    try {
      dbf = await DBFFile.DBFFile.open(dbfPath);

      const fieldNames = dbf.fields.map(f => f.name);
      const requiredFields = ['NUMALMAME', 'NUMESTAME', 'NUMCOMAME', 'DESCOMAME', 'NUMCORAME', 'DESCORAME', 'NUMPUNAME', 'NUMCODAME'];
      
      if (!requiredFields.every(field => fieldNames.includes(field))) {
          throw new Error('La estructura del archivo DBF (CPTAMECO.DBF) no coincide con lo esperado.');
      }

      await dbf.appendRecords(registros);
      return { success: true, message: "Datos guardados correctamente en DBF." };
    } catch (error) {
        console.error("Error en appendRecordsToDBF:", error);
        throw error;
    }
  }
};