import { SublineaService } from "../../services/cpt/sublinea.service.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'Ocurrió un error en el servidor.',
    });
  });

export const create = asyncHandler(async (req, res) => {
  const nuevaSublinea = await SublineaService.crear(req.body, req.params.empresa);
  res.status(201).json(nuevaSublinea);
});

export const getAll = asyncHandler(async (req, res) => {
  const sublineas = await SublineaService.obtenerTodos(req.params.empresa);
  res.status(200).json(sublineas);
});

export const updateById = asyncHandler(async (req, res) => {
  const sublineaActualizada = await SublineaService.actualizar(
    Number(req.params.sublineaId),
    req.body,
    req.params.empresa
  );
  res.status(200).json(sublineaActualizada);
});