import { MaterialModel } from "../../models/cpt/material.model.js";

export const MaterialService = {
  crear: async (data, empresa) => {
    if (!data.material || data.material <= 0 || !data.descripcion) {
      const error = new Error('Datos inválidos. El ID del material y la descripción son requeridos.');
      error.statusCode = 400;
      throw error;
    }
    // Validar longitud de la descripción
    if (data.descripcion.length > 20) {
      const error = new Error('La descripción no puede exceder los 20 caracteres.');
      error.statusCode = 400;
      throw error;
    }
    return MaterialModel.create(data, empresa);
  },

  obtenerTodos: async (empresa) => {
    return MaterialModel.findAll(empresa);
  },

  obtenerPorId: async (materialId, empresa) => {
    const material = await MaterialModel.findByPk(materialId, empresa);
    if (!material) {
      const error = new Error('Material no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return material;
  },

  actualizar: async (materialId, data, empresa) => {
    
    await MaterialService.obtenerPorId(materialId, empresa);
    
    
    if (!data.descripcion) {
      const error = new Error('La descripción es requerida para actualizar.');
      error.statusCode = 400;
      throw error;
    }
     // Validar longitud de la descripción
    if (data.descripcion.length > 20) {
      const error = new Error('La descripción no puede exceder los 20 caracteres.');
      error.statusCode = 400;
      throw error;
    }
    return MaterialModel.update(materialId, data, empresa);
  },
};