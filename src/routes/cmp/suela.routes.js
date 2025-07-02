import { Router } from 'express';
import {
  getProducto,
  getCombinaciones,
  getCorrida,
  getSuela,
  createCombinacionProd
} from '../../controllers/cmp/suela.controller.js';

const router = Router();

// Rutas de consulta para obtener datos relacionados
router.get('/suelas/productos/:estilo/:corrida/:combinacion', getProducto);
router.get('/suelas/combinaciones/:estilo/:corrida', getCombinaciones);
router.get('/suelas/corridas/:corrida', getCorrida);
router.get('/suelas/:suela', getSuela);

// Ruta de creación
router.post('/suelas/combinaciones-prod', createCombinacionProd);

export default router;