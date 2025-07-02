import { Router } from 'express';
import { create, getAll, updateById } from '../../controllers/cpt/combinacion.controller.js';

const router = Router();

// Rutas para /api/combinaciones/:empresa
router.route('/combinaciones/:empresa')
  .post(create)
  .get(getAll);

// Ruta para /api/combinaciones/:empresa/:combinacionId
router.route('/combinaciones/:empresa/:combinacionId')
  .put(updateById);

export default router;