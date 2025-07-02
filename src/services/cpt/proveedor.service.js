import { ProveedorModel } from "../../models/cpt/proveedor.model.js";

export const ProveedorService = {
  crear: async (data, empresa) => {
    // Campos obligatorios para crear
    if (!data.proveedor || data.proveedor <= 0 || !data.nombre) {
      const error = new Error('Datos inválidos. El ID del proveedor y el nombre son requeridos.');
      error.statusCode = 400;
      throw error;
    }

    // Preparar el objeto a guardar, asegurando el estatus por defecto.
    const dataToSave = {
      ...data,
      estatus: data.estatus || 'A'
    };
    
    return ProveedorModel.create(dataToSave, empresa);
  },

  obtenerTodos: async (empresa) => {
    return ProveedorModel.findAll(empresa);
  },

  obtenerPorId: async (proveedorId, empresa) => {
    const proveedor = await ProveedorModel.findByPk(proveedorId, empresa);
    if (!proveedor) {
      const error = new Error('Proveedor no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return proveedor;
  },

  actualizar: async (proveedorId, data, empresa) => {

    await ProveedorService.obtenerPorId(proveedorId, empresa);
    
    if (!data.nombre) {
      const error = new Error('El nombre es requerido para actualizar.');
      error.statusCode = 400;
      throw error;
    }

    return ProveedorModel.update(proveedorId, data, empresa);
  },
};