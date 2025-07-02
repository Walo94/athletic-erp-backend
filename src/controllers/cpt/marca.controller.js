import { MarcaService } from "../../services/cpt/marca.service.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'Ocurrió un error en el servidor.',
    });
  });

export const create = asyncHandler(async (req, res) => {
  const nuevaMarca = await MarcaService.crear(req.body, req.params.empresa);
  res.status(201).json(nuevaMarca);
});

export const getAll = asyncHandler(async (req, res) => {
  const marcas = await MarcaService.obtenerTodos(req.params.empresa);
  res.status(200).json(marcas);
});

export const updateById = asyncHandler(async (req, res) => {
  const marcaActualizada = await MarcaService.actualizar(
    Number(req.params.marcaId),
    req.body,
    req.params.empresa
  );
  res.status(200).json(marcaActualizada);
});