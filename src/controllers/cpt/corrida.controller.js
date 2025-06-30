import { CorridaService } from "../../services/cpt/corrida.service.js";

// Maneja los errores de forma centralizada para no repetir try/catch
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'Ocurrió un error en el servidor.',
    });
  });

export const create = asyncHandler(async (req, res) => {
  const nuevo = await CorridaService.crear(req.body, req.params.empresa);
  res.status(201).json(nuevo);
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await CorridaService.obtenerTodos(req.params.empresa);
  res.status(200).json(data);
});

export const updateById = asyncHandler(async (req, res) => {
  const dataActualizado = await CorridaService.actualizar(
    Number(req.params.corridaId),
    req.body,
    req.params.empresa
  );
  res.status(200).json(dataActualizado);
});

