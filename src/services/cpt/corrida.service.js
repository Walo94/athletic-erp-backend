import { CorridaModel } from "../../models/cpt/corrida.model.js";

export const CorridaService = {
  crear: async (data, empresa) => {
    if (!data.corrida || data.corrida <= 0 || !data.descripcion || !data.puntoInicial || !data.puntoFinal) {
      const error = new Error('Datos inválidos. Todos los campos son requeridos.');
      error.statusCode = 400;
      throw error;
    }
    return CorridaModel.create(data, empresa);
  },

  obtenerTodos: async (empresa) => {
    return CorridaModel.findAll(empresa);
  },

  obtenerPorId: async (corridaId, empresa) => {
    const corrida = await CorridaModel.findByPk(corridaId, empresa);
    if (!corrida) {
      const error = new Error('Corrida no encontrada.');
      error.statusCode = 404;
      throw error;
    }
    return corrida;
  },

  actualizar: async (corridaId, data, empresa) => {
    // Valida que la corrida a actualizar exista primero
    await CorridaService.obtenerPorId(corridaId, empresa);
    
    if (!data.descripcion || !data.puntoInicial || !data.puntoFinal) {
      const error = new Error('Todos los datos son requeridos para actualizar.');
      error.statusCode = 400;
      throw error;
    }
    return CorridaModel.update(corridaId, data, empresa);
  },

};