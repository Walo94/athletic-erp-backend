import { connectRCPT, connectATHLETICB, connectCMP } from '../../config/db.js';
import sql from 'mssql';

export const PaqueteModel = {

    getPaquetes: async (paquete, periodo) => {
        try {
            const pool = await connectRCPT();
            const query = `
      WITH PuntosDistribuidos AS (
        SELECT
            dp.Estilo,
            dp.Combinacion,
            dp.DescCombina,
            dp.corrida,
            dp.TotalPares,
            CASE WHEN dp.corrida = 94 THEN dp.cant1 + dp.cant2 ELSE dp.cant1 + dp.cant2 END AS Cant1,
            CASE WHEN dp.corrida = 94 THEN dp.cant3 + dp.cant4 ELSE dp.cant3 + dp.cant4 END AS Cant2,
            CASE WHEN dp.corrida = 94 THEN dp.cant5 + dp.cant6 ELSE dp.cant5 + dp.cant6 END AS Cant3,
            CASE WHEN dp.corrida = 94 THEN 0 ELSE dp.cant7 + dp.cant8 END AS Cant4,
            CASE WHEN dp.corrida = 94 THEN dp.cant7 + dp.cant8 ELSE dp.cant9 + dp.cant10 END AS Cant5,
            CASE WHEN dp.corrida = 94 THEN dp.cant9 + dp.cant10 ELSE dp.cant11 + dp.cant12 END AS Cant6,
            CASE WHEN dp.corrida = 94 THEN dp.cant11 + dp.cant12 ELSE dp.cant13 + dp.cant14 END AS Cant7
        FROM HDFincado dp
        WHERE dp.Paquete = @paquete AND dp.Periodo = @periodo
      )
      SELECT 
        pd.estilo,
        pd.combinacion,
        pd.DescCombina,
        pd.corrida,
        cb.suela,
        sl.Descripcion AS DesSuela,
        SUM(pd.Cant1) AS Cant1,
        SUM(pd.Cant2) AS Cant2,
        SUM(pd.Cant3) AS Cant3,
        SUM(pd.Cant4) AS Cant4,
        SUM(pd.Cant5) AS Cant5,
        SUM(pd.Cant6) AS Cant6,
        SUM(pd.Cant7) AS Cant7,
        SUM(pd.TotalPares) AS pares
      FROM PuntosDistribuidos pd
      LEFT JOIN Productos p ON pd.Estilo = p.Estilo AND pd.Combinacion = p.Combinacion
        AND pd.Corrida = p.Corrida
      LEFT JOIN ATHLETICB.dbo.CombinacionProd cb ON p.producto = cb.producto
      LEFT JOIN CMP.dbo.Suelas sl ON cb.Suela = sl.Suela
      GROUP BY pd.Estilo,pd.Combinacion,pd.Corrida,cb.Suela,sl.Descripcion,pd.DescCombina`;

            const result = await pool.request()
                .input('paquete', sql.Int, paquete)
                .input('periodo', sql.Int, periodo)
                .query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error en el modelo al obtener paquetes:", error);
            throw error;
        }
    },

    insertarPaquete: async (paquete, periodo, detalleProductos) => {
        const pool = await connectCMP();
        const transaction = pool.transaction();
        try {
            await transaction.begin();
            const fechaPaquete = new Date();

            for (let producto of detalleProductos) {
                const request = transaction.request();
                // ... (inputs para cada campo)
                request.input('paquete', sql.Int, paquete);
                request.input('periodo', sql.Int, periodo);
                request.input('fechaPaquete', sql.DateTime, fechaPaquete);
                request.input('suela', sql.Int, producto.suela);
                request.input('corrida', sql.Int, producto.corrida);
                request.input('cant1', sql.Int, producto.Cant1 || 0);
                request.input('cant2', sql.Int, producto.Cant2 || 0);
                request.input('cant3', sql.Int, producto.Cant3 || 0);
                request.input('cant4', sql.Int, producto.Cant4 || 0);
                request.input('cant5', sql.Int, producto.Cant5 || 0);
                request.input('cant6', sql.Int, producto.Cant6 || 0);
                request.input('cant7', sql.Int, producto.Cant7 || 0);
                request.input('pares', sql.Int, producto.pares);

                const query = `
            INSERT INTO DPaquetes (
              Paquete, Periodo, FechaPaquete, Suela, Corrida,
              Cant1, Cant2, Cant3, Cant4, Cant5, Cant6, Cant7,
              CPP1, CPP2, CPP3, CPP4, CPP5, CPP6, CPP7,
              Surtido1, Surtido2, Surtido3, Surtido4, Surtido5, Surtido6, Surtido7,
              TotalPares, TotalCPP, TotalSurtido, Estatus
            ) VALUES (
              @paquete, @periodo, @fechaPaquete, @suela, @corrida,
              @cant1, @cant2, @cant3, @cant4, @cant5, @cant6, @cant7,
              0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0,
              @pares, 0, 0, 0
            );`;

                await request.query(query);
            }
            await transaction.commit();
            return { success: true, message: "Datos insertados correctamente" };
        } catch (error) {
            console.error("Error en transacción de inserción de paquete:", error);
            await transaction.rollback();
            throw error;
        }
    },

    eliminarPaquete: async (paquete) => {
        const pool = await connectCMP();
        const query = `DELETE FROM DPaquetes WHERE Paquete = @paquete;`;
        await pool.request()
            .input('paquete', sql.Int, paquete)
            .query(query);
        return { success: true, message: "Registros eliminados correctamente" };
    },
};