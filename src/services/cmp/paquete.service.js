import { PaqueteModel } from '../../models/cmp/paquete.model.js';

export const PaqueteService = {
  obtenerPaquetes: async (paquete, periodo) => {
    if (!paquete || !periodo){
      const error = new Error('Datos incompletos.');
      throw error;
    }
    return PaqueteModel.getPaquetes(paquete, periodo);
  },

  crearPaquete: async (paquete, periodo, detalleProductos) => {
    if (!detalleProductos || detalleProductos.length === 0) {
      throw new Error("El detalle de productos no puede estar vacío.");
    }
    return PaqueteModel.insertarPaquete(paquete, periodo, detalleProductos);
  },

  borrarPaquete: async (paquete) => {
    if (!paquete){
      const error = new Error('Datos incompletos.');
      throw error;
    }

    return PaqueteModel.eliminarPaquete(paquete);
  },

  obtenerProducto: async (estilo, corrida, combinacion) => {
    if(!estilo || !corrida || combinacion){
      const error = new Error('Datos incompletos.');
      throw error;
    }
    return PaqueteModel.getProducto(estilo, corrida, combinacion);
  },
  
  obtenerCombinaciones: async (estilo, corrida) => {
    if(!estilo || !corrida){
      const error = new Error('Datos incompletos.');
      throw error;
    }
    return PaqueteModel.getCombinaciones(estilo, corrida);
  },

  obtenerCorrida: async (corrida) => {
    if(!corrida){
      const error = new Error('Datos incompletos.');
      throw error;
    }
    return PaqueteModel.getCorrida(corrida);
  },

  obtenerSuela: async (suela) => {
    if(!suela){
      const error = new Error('Datos incompletos.');
      throw error;
    }
    return PaqueteModel.getSuela(suela);
  },

  crearCombinacion: async (datos) => {
    if(!datos){
        throw new Error("Debes de ingresa datos");
    }
    return PaqueteModel.insertarCombinacionProd(datos);
  }
  
};