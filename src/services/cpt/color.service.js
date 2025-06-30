import { ColorModel } from "../../models/cpt/color.model.js";

export const ColorService = {
  crear: async (data, empresa) => {
    if (!data.color || data.color <= 0 || !data.descripcion) {
      const error = new Error('Datos inválidos. El color y la descripción son requeridos.');
      error.statusCode = 400; // Bad Request
      throw error;
    }
    return ColorModel.create(data, empresa);
  },

  obtenerTodos: async (empresa) => {
    return ColorModel.findAll(empresa);
  },

  obtenerPorId: async (colorId, empresa) => {
    const color = await ColorModel.findByPk(colorId, empresa);
    if (!color) {
      const error = new Error('Color no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return color;
  },

  actualizar: async (colorId, data, empresa) => {
    // Valida que el color a actualizar exista primero
    await ColorService.obtenerPorId(colorId, empresa);
    if (!data.descripcion) {
      const error = new Error('La descripción es requerida para actualizar.');
      error.statusCode = 400;
      throw error;
    }
    return ColorModel.update(colorId, data, empresa);
  },

};