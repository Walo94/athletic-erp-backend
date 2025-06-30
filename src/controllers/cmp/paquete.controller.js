import { PaqueteService } from '../../services/cmp/paquete.service.js';

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch((err) => {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Ocurrió un error en el servidor.' });
    });

export const getPaquetes = asyncHandler(async (req, res) => {
    const { paquete, periodo } = req.params;
    const data = await PaqueteService.obtenerPaquetes(Number(paquete), Number(periodo));
    res.status(200).json(data);
});

export const createPaquete = asyncHandler(async (req, res) => {
    const { paquete, periodo, detalleProductos } = req.body;
    const result = await PaqueteService.crearPaquete(paquete, periodo, detalleProductos);
    res.status(201).json(result);
});

export const deletePaquete = asyncHandler(async (req, res) => {
    const { paquete } = req.params;
    const result = await PaqueteService.borrarPaquete(Number(paquete));
    res.status(200).json(result);
});