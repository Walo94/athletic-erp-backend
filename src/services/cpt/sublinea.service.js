import { SublineaModel } from "../../models/cpt/sublinea.model.js";

export const SublineaService = {
  crear: async (data, empresa) => {
    if (!data.sublinea || data.sublinea <= 0 || !data.descripcion) {
      const error = new Error('Datos inválidos. El ID de la sublínea y la descripción son requeridos.');
      error.statusCode = 400;
      throw error;
    }
    // Validar longitud de la descripción
    if (data.descripcion.length > 30) {
      const error = new Error('La descripción no puede exceder los 30 caracteres.');
      error.statusCode = 400;
      throw error;
    }
    return SublineaModel.create(data, empresa);
  },

  obtenerTodos: async (empresa) => {
    return SublineaModel.findAll(empresa);
  },

  obtenerPorId: async (sublineaId, empresa) => {
    const sublinea = await SublineaModel.findByPk(sublineaId, empresa);
    if (!sublinea) {
      const error = new Error('Sublinea no encontrada.');
      error.statusCode = 404;
      throw error;
    }
    return sublinea;
  },

  actualizar: async (sublineaId, data, empresa) => {
    
    await SublineaService.obtenerPorId(sublineaId, empresa);
    
    if (!data.descripcion) {
      const error = new Error('La descripción es requerida para actualizar.');
      error.statusCode = 400;
      throw error;
    }
     // Validar longitud de la descripción
    if (data.descripcion.length > 30) {
      const error = new Error('La descripción no puede exceder los 30 caracteres.');
      error.statusCode = 400;
      throw error;
    }
    return SublineaModel.update(sublineaId, data, empresa);
  },
};
