import { MarcaModel } from "../../models/cpt/marca.model.js";

/**
 * Valida los datos de entrada para crear o actualizar una marca.
 * @param {object} data - Los datos a validar.
 */
const _validateData = (data) => {
    if (data.marca === null || data.marca === undefined || !data.descripcion) {
        const error = new Error('Datos inválidos. El ID de la marca y la descripción son requeridos.');
        error.statusCode = 400;
        throw error;
    }

    if (typeof data.marca !== 'number') {
        const error = new Error('El ID de la marca debe ser un número.');
        error.statusCode = 400;
        throw error;
    }
    
    if (data.descripcion.length > 25) {
      const error = new Error('La descripción no puede exceder los 25 caracteres.');
      error.statusCode = 400;
      throw error;
    }
};

export const MarcaService = {
  crear: async (data, empresa) => {
    _validateData(data);
    return MarcaModel.create(data, empresa);
  },

  obtenerTodos: async (empresa) => {
    return MarcaModel.findAll(empresa);
  },

  obtenerPorId: async (marcaId, empresa) => {
    const marca = await MarcaModel.findByPk(marcaId, empresa);
    if (!marca) {
      const error = new Error('Marca no encontrada.');
      error.statusCode = 404;
      throw error;
    }
    return marca;
  },

  actualizar: async (marcaId, data, empresa) => {
    await MarcaService.obtenerPorId(marcaId, empresa);
    
    // Para actualizar, solo se necesita la descripción
    if (!data.descripcion) {
        const error = new Error('La descripción es requerida para actualizar.');
        error.statusCode = 400;
        throw error;
    }
     if (data.descripcion.length > 25) {
      const error = new Error('La descripción no puede exceder los 25 caracteres.');
      error.statusCode = 400;
      throw error;
    }

    return MarcaModel.update(marcaId, data, empresa);
  },
};