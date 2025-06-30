import { InyeccionModel } from '../../models/inyeccion/inyeccion.model.js';
import { format } from 'date-fns';

export const InyeccionService = {

    obtenerInfoLote: async (lote, anio) => {
        if (!lote || !anio) {
            const error = new Error('El lote y el año son requeridos.');
            error.statusCode = 400;
            throw error;
        }
        const data = await InyeccionModel.getInfoLote(lote, anio);
        if (!data || data.length === 0) {
            const error = new Error('No se encontró información para el lote especificado.');
            error.statusCode = 404;
            throw error;
        }
        return data;
    },

    obtenerInfoPrograma: async (lote, year) => {
        if (!lote || !year) {
            const error = new Error('El lote y el año son requeridos.');
            error.statusCode = 400;
            throw error;
        }
        const data = await InyeccionModel.getInfoPrograma(lote, year);
        if (!data || data.length === 0) {
            const error = new Error('No se encontró información del programa para el lote especificado.');
            error.statusCode = 404;
            throw error;
        }
        return data;
    },

    verificarAvance: async (lote, programa, ordenActual) => {
        if (!lote || !programa || !ordenActual) {
            const error = new Error('Faltan datos.');
            error.statusCode = 400;
            throw error;
        }
        return InyeccionModel.puedeAvanzar(lote, programa, ordenActual);
    },

    crearAvance: async (datosAvance) => {
        if (!datosAvance.programa || !datosAvance.lote || !datosAvance.departamentoActual) {
            const error = new Error('Datos incompletos para registrar el avance.');
            error.statusCode = 400;
            throw error;
        }

        const fechaObjeto = new Date(datosAvance.fechaActual);
        const fechaFormateada = format(fechaObjeto, 'yyyy-MM-dd HH:mm:ss');

        const datosCompletos = {
            ...datosAvance,
            fechaActual: fechaFormateada,
        };

        return InyeccionModel.registrarAvance(datosCompletos);
    },

    conseguirOrdenDepartamento: async (departamento) => {
        const data = await InyeccionModel.obtenerOrdenDepartamento(departamento);
        if (!data) {
            const error = new Error('Departamento no encontrado.');
            error.statusCode = 404;
            throw error;
        }
        return {
            Orden: data.origen
        };
    },

    obtenerLotesDelDia: async (dia, modulo) => {
        if (!dia || !modulo) {
            const error = new Error('Faltan datos.');
            error.statusCode = 400;
            throw error;
        }

        return InyeccionModel.getLotesDia(dia, modulo);
    },

    obtenerLotesNoVendidos: async () => {
        return InyeccionModel.getLotesNoVendidos();
    },

    marcarLotesComoVendidos: async (lotes) => {
        if (!lotes || !Array.isArray(lotes) || lotes.length === 0) {
            const error = new Error('Se requiere una lista de lotes.');
            error.statusCode = 400;
            throw error;
        }
        return InyeccionModel.actualizarLotesVendidos(lotes);
    },

    chequearLotesVendidos: async (lotes) => {
        if (!lotes || !Array.isArray(lotes) || lotes.length === 0) {
            const error = new Error('Se requiere una lista de lotes para verificar.');
            error.statusCode = 400;
            throw error;
        }
        return InyeccionModel.verificarLotesVendidos(lotes);
    },

    listarDatosDetaFact: async () => {
        return InyeccionModel.obtenerDatosDetaFact();
    }
}