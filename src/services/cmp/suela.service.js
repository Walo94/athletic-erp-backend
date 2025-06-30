import { SuelaModel } from '../../models/cmp/suela.model.js';

export const SuelaService = {
  obtenerProducto: async (estilo, corrida, combinacion) => {
    const producto = await SuelaModel.getProducto(estilo, corrida, combinacion);
    if (!producto) {
      const error = new Error('Producto no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return producto;
  },

  obtenerCombinaciones: async (estilo, corrida) => {
    if(!estilo || !corrida){
      const error = new Error('Datos incompletos.');
      throw error;
    }
    return SuelaModel.getCombinaciones(estilo, corrida);
  },

  obtenerCorrida: async (corrida) => {
    const data = await SuelaModel.getCorrida(corrida);
    if (!data) {
      const error = new Error('Corrida no encontrada.');
      error.statusCode = 404;
      throw error;
    }
    return data;
  },

  obtenerSuela: async (suela) => {
    const data = await SuelaModel.getSuela(suela);
    if (!data) {
      const error = new Error('Suela no encontrada.');
      error.statusCode = 404;
      throw error;
    }
    return data;
  },

  crearCombinacionProd: async (datos) => {
    // Aquí puedes poner validaciones de negocio importantes
    if (!datos.Producto || !datos.Suela || !datos.EstiloCliente) {
      const error = new Error('Datos incompletos para crear la combinación de producto.');
      error.statusCode = 400;
      throw error;
    }
    // Añadimos datos que el servicio debe gestionar
    const datosCompletos = {
        ...datos,
        fechaCreado: new Date(),
        CveUsuarioCreador: 'SYS',
        CveUsuarioModific: 'SYS',
    };
    return SuelaModel.insertarCombinacionProd(datosCompletos);
  }
};