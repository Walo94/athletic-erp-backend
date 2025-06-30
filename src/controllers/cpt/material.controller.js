import { MaterialService } from "../../services/cpt/material.service.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'Ocurrió un error en el servidor.',
    });
  });

export const create = asyncHandler(async (req, res) => {
  const nuevoMaterial = await MaterialService.crear(req.body, req.params.empresa);
  res.status(201).json(nuevoMaterial);
});

export const getAll = asyncHandler(async (req, res) => {
  const materiales = await MaterialService.obtenerTodos(req.params.empresa);
  res.status(200).json(materiales);
});

export const updateById = asyncHandler(async (req, res) => {
  const materialActualizado = await MaterialService.actualizar(
    Number(req.params.materialId),
    req.body,
    req.params.empresa
  );
  res.status(200).json(materialActualizado);
});