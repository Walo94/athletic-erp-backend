import { CombinacionModel } from "../../models/cpt/combinacion.model.js";

const _validateData = (data) => {
    if (data.combinacion === null || data.combinacion === undefined || 
        data.material1 === null || data.material1 === undefined ||
        data.color1 === null || data.color1 === undefined) {
        const error = new Error('Datos inválidos. Combinacion, Material1 y Color1 son requeridos.');
        error.statusCode = 400;
        throw error;
    }
    
    if (typeof data.combinacion !== 'number' || data.combinacion <= 0) {
      const error = new Error('El ID de la combinación debe ser un número positivo.');
      error.statusCode = 400;
      throw error;
    }
};

export const CombinacionService = {
  crear: async (data, empresa) => {
    _validateData(data);
    return CombinacionModel.create(data, empresa);
  },

  obtenerTodos: async (empresa) => {
    return CombinacionModel.findAll(empresa);
  },

  obtenerPorId: async (combinacionId, empresa) => {
    const combinacion = await CombinacionModel.findByPk(combinacionId, empresa);
    if (!combinacion) {
      const error = new Error('Combinación no encontrada.');
      error.statusCode = 404;
      throw error;
    }
    return combinacion;
  },

  actualizar: async (combinacionId, data, empresa) => {
    // Primero, verificar que la combinación exista
    await CombinacionService.obtenerPorId(combinacionId, empresa);
    
    // Validar que los campos requeridos estén en el cuerpo de la petición
    _validateData({ combinacion: combinacionId, ...data });

    return CombinacionModel.update(combinacionId, data, empresa);
  },
};