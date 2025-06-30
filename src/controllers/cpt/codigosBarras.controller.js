import { CodigosBarrasService } from '../../services/cpt/codigosBarras.service.js';

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'Ocurrió un error en el servidor.',
    });
  });

export const getCodigosBarras = asyncHandler(async (req, res) => {
  const { producto } = req.params;
  const data = await CodigosBarrasService.obtenerCodigosConTallas(Number(producto));
  console.log(data);
  res.status(200).json({ codigos: data });
});

export const guardarCodigosDBF = asyncHandler(async (req, res) => {
  const { registros } = req.body;
  const resultado = await CodigosBarrasService.guardarRegistrosEnDBF(registros);
  res.status(201).json(resultado);
});