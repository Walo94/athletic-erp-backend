import { Router } from 'express';
import {
  getCodigosBarras,
  guardarCodigosDBF
} from '../../controllers/cpt/codigosBarras.controller.js';

const router = Router();

// Ruta para obtener los códigos de barras de un producto específico
router.get('/codigos-barras/:producto', getCodigosBarras);

// Ruta para guardar los registros en el archivo DBF
router.post('/codigos-barras/guardar-dbf', guardarCodigosDBF);

export default router;