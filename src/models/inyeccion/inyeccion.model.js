import { connectAvances } from "../../config/db.js";
import path from 'path';
import sql from 'mssql';
import DBFFile from 'dbffile';
import { format } from 'date-fns';

const DATA_PATH = process.env.DATA_FILES_PATH;

export const InyeccionModel = {
  getInfoLote: async (lote, anio) => {
    const pool = await connectAvances();
    const result = await pool.request()
      .input('lote', sql.Int, lote)
      .input('anio', sql.Int, anio)
      .execute('sp_getinfo_lote');
    return result.recordset;
  },

  getInfoPrograma: async (lote, year) => {
    const pool = await connectAvances();
    const result = await pool.request()
      .input('lote', sql.Int, lote)
      .input('year', sql.Int, year)
      .execute('sp_getinfo_programa');
    return result.recordset;
  },

  puedeAvanzar: async (lote, programa, ordenActual) => {
    const pool = await connectAvances();
    const result = await pool.request()
      .input('Lote', sql.VarChar(255), lote)
      .input('Programa', sql.Int, programa)
      .input('OrdenActual', sql.Int, ordenActual)
      .execute('sp_puede_avanzar');
    return result.recordset[0];
  },

  registrarAvance: async (datos) => {
    // --- INICIO DE LA MODIFICACIÓN ---
    try {
      const pool = await connectAvances();
      await pool.request()
        .input('Programa', sql.Int, datos.programa)
        .input('Lote', sql.VarChar(5), datos.lote)
        .input('Avance', sql.VarChar(255), datos.avance)
        .input('DepartamentoActual', sql.VarChar(255), datos.departamentoActual)
        .input('DepartamentoSiguiente', sql.VarChar(255), datos.departamentoSiguiente)
        .input('Maquila', sql.VarChar(20), datos.maquila)
        .input('FechaActual', sql.VarChar, datos.fechaActual)
        .execute('sp_registrar_avance');

      return { success: true, message: "Avance registrado correctamente" };

    } catch (error) {
      throw new Error('Error al ejecutar sp_registrar_avance en la base de datos.');
    }
  },

  obtenerOrdenDepartamento: async (departamentoActual) => {
    const pool = await connectAvances();
    const result = await pool.request()
      .input('DepartamentoActual', sql.VarChar(255), departamentoActual)
      .execute('sp_ObtenerOrdenDepartamento');
    return result.recordset[0];
  },

  getLotesDia: async (dia, modulo) => {
    const pool = await connectAvances();
    const result = await pool.request()
      .input('dia', sql.VarChar(255), dia)
      .input('modulo', sql.VarChar(255), modulo)
      .execute('sp_get_lotes_dia');
    return result.recordset;
  },

  getLotesNoVendidos: async () => {
    const pool = await connectAvances();
    const query = `
      SELECT TOP 3000 p.lote, p.years FROM 
      dbo.avance_inyeccion ai
      INNER JOIN 
      dbo.programa p ON ai.id_prog = p.id_prog
      WHERE ai.vendido = 0 
      ORDER BY p.lote`;
    const result = await pool.request().query(query);
    return result.recordset;
  },

  actualizarLotesVendidos: async (lotes) => {
    const pool = await connectAvances();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      for (const lote of lotes) {
        const request = new sql.Request(transaction);
        request.input('lote', sql.Int, lote.lote);
        request.input('years', sql.Int, lote.years);
        const query = `
          UPDATE ai SET ai.vendido = 1
          FROM dbo.avance_inyeccion ai
          INNER JOIN dbo.programa p ON ai.id_prog = p.id_prog
          WHERE p.lote = @lote AND p.years = @years`;
        await request.query(query);
      }
      await transaction.commit();
      return { success: true, message: "Lotes actualizados correctamente" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  verificarLotesVendidos: async (lotes) => {
    const dbfPath = path.join(DATA_PATH, 'DETAFACT.DBF');
    let dbf = null;

    if (!dbfPath) {
      console.error("Error: La ruta al archivo DBF no está configurada en las variables de entorno (DBF_FILE_PATH).");
      throw new Error("Configuración del servidor incompleta.");
    }
    
    try {
      dbf = await DBFFile.DBFFile.open(dbfPath);
      const records = await dbf.readRecords();
      const lotesVendidos = [];

      for (const lote of lotes) {
        const foundRecords = records.filter(record => {
          const dbfLote = typeof record.LOT_FACT === 'string' ? parseInt(record.LOT_FACT) : record.LOT_FACT;
          if (!record.FEC_FACT || dbfLote !== parseInt(lote.lote)) {
            return false;
          }

          try {
            const fechaVenta = new Date(record.FEC_FACT);
            const yearFechaVenta = fechaVenta.getFullYear();
            const lotYear = parseInt(lote.years);
            return yearFechaVenta === lotYear || yearFechaVenta === lotYear + 1;
          } catch (e) {
            return false;
          }
        });

        if (foundRecords.length > 0) {
          lotesVendidos.push(lote);
        }
      }
      return lotesVendidos;
    } catch (error) {
      console.error("Error al leer el archivo DBF:", error);
      throw error;
    }
  },

  obtenerDatosDetaFact: async () => {
    const dbfPath = path.join(DATA_PATH, 'DETAFACT.DBF');
    let dbf = null;

    if (!dbfPath) {
      console.error("Error: La ruta al archivo DBF no está configurada en las variables de entorno (DBF_FILE_PATH).");
      throw new Error("Configuración del servidor incompleta.");
    }

    try {
      dbf = await DBFFile.DBFFile.open(dbfPath);
      const records = await dbf.readRecords();

      const recordsFormateados = records.map(record => {
        const formateado = { ...record };
        if (record.FEC_FACT && record.FEC_FACT instanceof Date) {
          formateado.FEC_FACT_FORMATEADA = format(record.FEC_FACT, 'dd/MM/yyyy');
        }
        return formateado;
      }).sort((a, b) => (a.LOT_FACT || 0) - (b.LOT_FACT || 0));

      return recordsFormateados;
    } catch (error) {
      console.error("Error al leer el archivo DBF:", error);
      throw error;
    }
  }
};