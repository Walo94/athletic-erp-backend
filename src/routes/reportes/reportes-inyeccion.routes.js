import express from 'express';
import axios from 'axios';

const router = express.Router();

// La URL base del servicio de reportes, inyectada desde el docker-compose.yml
const REPORTES_API_URL = process.env.REPORT_API_URL;

// Middleware para manejar errores de forma centralizada
const handleReportError = (error, res) => {
  console.error("Error al contactar el servicio de reportes:", error.message);
  // Revisa si el error vino de la respuesta del servicio de reportes
  if (error.response) {
    res.status(error.response.status).json({ message: 'El servicio de reportes falló.', details: error.response.data });
  } else {
    res.status(500).json({ message: 'Error interno al generar el reporte.' });
  }
};

/**
 * Endpoint para el reporte de avance diario.
 * Llama a: /reportes-api/inyeccion/avance-dia
 */
router.get('/reportes/avance-dia', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:8080/reportes-api/inyeccion/avance-dia`, {
      params: req.query, // Pasa todos los query params (ej: 'dia') al servicio de Spring
      responseType: 'arraybuffer' // Esencial para recibir el PDF como datos binarios
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.send(response.data);
  } catch (error) {
    handleReportError(error, res);
  }
});

/**
 * Endpoint para el reporte de avance semanal.
 * Llama a: /reportes-api/inyeccion/avance-semana
 */
router.get('/reportes/avance-semana', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:8080/reportes-api/inyeccion/avance-semana`, {
      params: req.query, // Pasa 'anio' y 'semana'
      responseType: 'arraybuffer'
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.send(response.data);
  } catch (error) {
    handleReportError(error, res);
  }
});

/**
 * Endpoint para el reporte de inventario en proceso.
 * Llama a: /reportes-api/inyeccion/inventario-proceso
 */
router.get('/reportes/inventario-proceso', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:8080/reportes-api/inyeccion/inventario-proceso`, {
      responseType: 'arraybuffer'
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.send(response.data);
  } catch (error) {
    handleReportError(error, res);
  }
});

export default router;