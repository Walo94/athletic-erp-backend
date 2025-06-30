import { CodigosBarrasModel } from '../../models/cpt/codigosBarras.model.js';

export const CodigosBarrasService = {
  /**
   * Obtiene los códigos de barras de un producto y calcula su talla correspondiente.
   */
  obtenerCodigosConTallas: async (producto) => {
    if (!producto) {
      const error = new Error('El ID del producto es requerido.');
      error.statusCode = 400;
      throw error;
    }

    const codigosResult = await CodigosBarrasModel.getCodigosFromDB(producto);
    const productoInfo = await CodigosBarrasModel.getCorridaFromDB(producto);

    if (!productoInfo) {
      // No se encontró el producto o no tiene corrida, devolvemos un resultado vacío.
      return [];
    }
    const { Corrida: corrida } = productoInfo;

    const corridaInfo = await CodigosBarrasModel.getPuntosFromDB(corrida);
    if (!corridaInfo) {
      // No se encontraron los detalles de la corrida.
      return [];
    }
    const { PuntoInicial } = corridaInfo;

    // Mapear puntos a tallas
    const codigosConTallas = codigosResult.map(codigo => {
      const puntoNumerico = PuntoInicial + (codigo.Punto - 1) * 0.5;
      return {
        codigo: codigo.Codigo,
        punto: codigo.Punto,
        talla: puntoNumerico % 1 === 0 ? puntoNumerico.toString() : puntoNumerico.toFixed(1)
      };
    });

    return codigosConTallas;
  },

  /**
   * Valida, formatea y guarda los registros de códigos de barras en el archivo DBF.
   */
  guardarRegistrosEnDBF: async (registros) => {
    if (!registros || !Array.isArray(registros) || registros.length === 0) {
      const error = new Error('Se requiere una lista de registros para guardar.');
      error.statusCode = 400;
      throw error;
    }

    // Formatear registros para que coincidan con la estructura del DBF
    const registrosFormateados = registros.map(r => ({
      NUMALMAME: 0,
      NUMLINAME: 0,
      NUMESTAME: parseInt(r.estilo) || 0,
      NUMCOMAME: parseInt(r.combinacion) || 0,
      DESCOMAME: r.descripcionCombinacion || '',
      NUMCORAME: parseInt(r.corrida) || 0,
      DESCORAME: r.descripcionCorrida || '',
      NUMPUNAME: Number(parseFloat(r.punto || 0).toFixed(5)),
      NUMCODAME: parseInt(r.codigoBarras) || 0,
      COD128AME: 0,
      PTO128AME: 0,
      OBSERVAME: '',
      NUMEMPAME: 1
    }));

    return CodigosBarrasModel.appendRecordsToDBF(registrosFormateados);
  }
};