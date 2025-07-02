import { CombinacionService } from "../../services/cpt/combinacion.service.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'Ocurrió un error en el servidor.',
    });
  });

export const create = asyncHandler(async (req, res) => {
  const nuevaCombinacion = await CombinacionService.crear(req.body, req.params.empresa);
  res.status(201).json(nuevaCombinacion);
});

export const getAll = asyncHandler(async (req, res) => {
  const combinaciones = await CombinacionService.obtenerTodos(req.params.empresa);
  res.status(200).json(combinaciones);
});

export const updateById = asyncHandler(async (req, res) => {
  const combinacionActualizada = await CombinacionService.actualizar(
    Number(req.params.combinacionId),
    req.body,
    req.params.empresa
  );
  res.status(200).json(combinacionActualizada);
});