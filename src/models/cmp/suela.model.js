import { connectRCPT, connectATHLETICB, connectCMP } from '../../config/db.js';
import sql from 'mssql';


export const SuelaModel = {

    getProducto: async (estilo, corrida, combinacion) => {
        const pool = await connectRCPT();
        const query = `
      SELECT producto FROM Productos
      WHERE Estilo = @estilo AND Corrida = @corrida AND Combinacion = @combinacion
    `;
        const result = await pool.request()
            .input('estilo', sql.Int, estilo)
            .input('corrida', sql.Int, corrida)
            .input('combinacion', sql.Int, combinacion)
            .query(query);
        return result.recordset[0];
    },

    getCombinaciones: async (estilo, corrida) => {
        const pool = await connectRCPT();

        const query = `
        SELECT c.Combinacion, (m1.Descripcion + ' ' + co1.Descripcion) AS CombinacionDescripcion
        FROM Combinaciones c
        JOIN Materiales m1 ON c.Material1 = m1.Material
        JOIN Colores co1 ON c.Color1 = co1.Color
        INNER JOIN Productos p ON p.Combinacion = c.Combinacion
        WHERE p.Estilo = @estilo AND p.Corrida = @corrida;
      `;

        const result = await pool.request()
            .input('estilo', sql.Int, estilo)
            .input('corrida', sql.Int, corrida)
            .query(query);
        return result.recordset;
    },

    getCorrida: async (corrida) => {
        const pool = await connectRCPT();
        const query = `SELECT Descripcion as descripcionCorrida FROM Corridas WHERE Corrida = @corrida`;
        const result = await pool.request()
            .input('corrida', sql.Int, corrida)
            .query(query);
        return result.recordset[0];
    },

    getSuela: async (suela) => {
        const pool = await connectCMP();
        const query = `SELECT Descripcion as descripcionSuela FROM Suelas WHERE Suela = @suela`;
        const result = await pool.request()
            .input('suela', sql.Int, suela)
            .query(query);
        return result.recordset[0];
    },

    insertarCombinacionProd: async (datos) => {
        const pool = await connectATHLETICB();
        const request = pool.request();

        request.input('producto', sql.Int, datos.Producto);
        request.input('estiloCliente', sql.VarChar(50), datos.EstiloCliente);
        request.input('suela', sql.Int, datos.Suela);
        request.input('fechaCreado', sql.DateTime, datos.fechaCreado);
        request.input('cveUsuarioCreador', sql.VarChar(50), datos.CveUsuarioCreador);
        request.input('cveUsuarioModific', sql.VarChar(50), datos.CveUsuarioModific);

        const query = `
        INSERT INTO CombinacionProd (
          Producto, numcliente, EstiloCliente, Suela, FechaCreado, 
          Estatus, CveUsuarioCreador, CveUsuarioModific, FechaModific
        ) 
        VALUES (
          @producto, 0, @estiloCliente, @suela, @fechaCreado, 
          'V', @cveUsuarioCreador, @cveUsuarioModific, NULL
        );
      `;

        await request.query(query);
        return { success: true, message: "Datos insertados correctamente" };
    }
};