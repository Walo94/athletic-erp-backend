import { InyeccionService } from '../../services/inyeccion/inyeccion.service.js';

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'Ocurrió un error en el servidor.',
    });
  });

  export const getInfoLote = asyncHandler(async (req, res) => {
  const { lote, anio } = req.params;
  const data = await InyeccionService.obtenerInfoLote(Number(lote), Number(anio));
  res.status(200).json(data);
});

export const getInfoPrograma = asyncHandler(async (req, res) => {
  const { lote, year } = req.params;
  const data = await InyeccionService.obtenerInfoPrograma(Number(lote), Number(year));
  res.status(200).json(data);
});

export const puedeAvanzar = asyncHandler(async (req, res) => {
  const { lote, programa, ordenActual } = req.params;
  const data = await InyeccionService.verificarAvance(lote, Number(programa), Number(ordenActual));
  res.status(200).json(data);
});

export const registrarAvance = asyncHandler(async (req, res) => {
  const resultado = await InyeccionService.crearAvance(req.body);
  res.status(201).json(resultado);
});

export const getOrdenDepartamento = asyncHandler(async (req, res) => {
  const { departamento } = req.params;
  const data = await InyeccionService.conseguirOrdenDepartamento(departamento);
  res.status(200).json(data);
});

export const getLotesDia = asyncHandler(async (req, res) => {
    const { dia, modulo } = req.params;
    const data = await InyeccionService.obtenerLotesDelDia(dia, modulo);
    res.status(200).json(data);
});

export const getLotesNoVendidos = asyncHandler(async (req, res) => {
    const data = await InyeccionService.obtenerLotesNoVendidos();
    res.status(200).json(data);
});

export const updateLotesVendidos = asyncHandler(async (req, res) => {
    const resultado = await InyeccionService.marcarLotesComoVendidos(req.body.lotes);
    res.status(200).json(resultado);
});

export const verificarLotesVendidos = asyncHandler(async (req, res) => {
    const lotesVendidos = await InyeccionService.chequearLotesVendidos(req.body.lotes);
    res.status(200).json(lotesVendidos);
});

export const getDatosDetaFact = asyncHandler(async (req, res) => {
    const data = await InyeccionService.listarDatosDetaFact();
    res.status(200).json(data);
});