import { LineaService } from "../../services/cpt/linea.service.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'Ocurrió un error en el servidor.',
    });
  });

export const create = asyncHandler(async (req, res) => {
  const nuevaLinea = await LineaService.crear(req.body, req.params.empresa);
  res.status(201).json(nuevaLinea);
});

export const getAll = asyncHandler(async (req, res) => {
  const lineas = await LineaService.obtenerTodos(req.params.empresa);
  res.status(200).json(lineas);
});

export const updateById = asyncHandler(async (req, res) => {
  const lineaActualizada = await LineaService.actualizar(
    Number(req.params.lineaId),
    req.body,
    req.params.empresa
  );
  res.status(200).json(lineaActualizada);
});