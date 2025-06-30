import { SuelaService } from '../../services/cmp/suela.service.js';

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'Ocurrió un error en el servidor.',
    });
  });

  export const getProducto = asyncHandler(async (req, res) => {
  const { estilo, corrida, combinacion } = req.params;
  const producto = await SuelaService.obtenerProducto(Number(estilo), Number(corrida), Number(combinacion));
  res.status(200).json(producto);
});

export const getCombinaciones = asyncHandler(async (req, res) => {
  const { estilo, corrida } = req.params;
  const combinaciones = await SuelaService.obtenerCombinaciones(Number(estilo), Number(corrida));
  res.status(200).json(combinaciones);
});

export const getCorrida = asyncHandler(async (req, res) => {
  const corrida = await SuelaService.obtenerCorrida(Number(req.params.corrida));
  res.status(200).json(corrida);
});

export const getSuela = asyncHandler(async (req, res) => {
  const suela = await SuelaService.obtenerSuela(Number(req.params.suela));
  res.status(200).json(suela);
});

export const createCombinacionProd = asyncHandler(async (req, res) => {
  const resultado = await SuelaService.crearCombinacionProd(req.body);
  res.status(201).json(resultado);
});