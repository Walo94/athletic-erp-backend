import { LineaModel } from "../../models/cpt/linea.model.js";

const _validateData = (data) => {
    const requiredFields = ['linea', 'descripcion', 'marca', 'sublinea'];
    for (const field of requiredFields) {
        if (data[field] === null || data[field] === undefined) {
            const error = new Error(`Datos inválidos. El campo '${field}' es requerido.`);
            error.statusCode = 400;
            throw error;
        }
    }

    if (data.linea <= 0) {
        const error = new Error('El ID de la línea debe ser un número positivo.');
        error.statusCode = 400;
        throw error;
    }
    
    if (data.descripcion.length > 30) {
      const error = new Error('La descripción no puede exceder los 30 caracteres.');
      error.statusCode = 400;
      throw error;
    }
};

export const LineaService = {
  
  crear: async (data, empresa) => {
    _validateData(data);
    
    const dataToCreate = {
        ...data,
        nuevaLinea: data.nuevaLinea ?? 0,
    };
    
    return LineaModel.create(dataToCreate, empresa);
  },

  obtenerTodos: async (empresa) => {
    return LineaModel.findAll(empresa);
  },

  obtenerPorId: async (lineaId, empresa) => {
    const linea = await LineaModel.findByPk(lineaId, empresa);
    if (!linea) {
      const error = new Error('Línea no encontrada.');
      error.statusCode = 404;
      throw error;
    }
    return linea;
  },

  actualizar: async (lineaId, data, empresa) => {
    // Primero, verificar que la línea exista
    await LineaService.obtenerPorId(lineaId, empresa);
    
    _validateData({ linea: lineaId, ...data });

    const dataToUpdate = {
        ...data,
        nuevaLinea: data.nuevaLinea ?? 0,
    };

    return LineaModel.update(lineaId, dataToUpdate, empresa);
  },
};