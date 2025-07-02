import { ProveedorService } from "../../services/cpt/proveedor.service.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'Ocurrió un error en el servidor.',
    });
  });

export const create = asyncHandler(async (req, res) => {
  const nuevoProveedor = await ProveedorService.crear(req.body, req.params.empresa);
  res.status(201).json(nuevoProveedor);
});

export const getAll = asyncHandler(async (req, res) => {
  const proveedores = await ProveedorService.obtenerTodos(req.params.empresa);
  res.status(200).json(proveedores);
});

export const updateById = asyncHandler(async (req, res) => {
  const proveedorActualizado = await ProveedorService.actualizar(
    Number(req.params.proveedorId),
    req.body,
    req.params.empresa
  );
  res.status(200).json(proveedorActualizado);
});