import { Router } from 'express';
import { create, getAll, updateById } from '../../controllers/cpt/linea.controller.js';

const router = Router();

// Rutas para /api/lineas/:empresa
router.route('/lineas/:empresa')
  .post(create)
  .get(getAll);

// Ruta para /api/lineas/:empresa/:lineaId
router.route('/lineas/:empresa/:lineaId')
  .put(updateById);

export default router;