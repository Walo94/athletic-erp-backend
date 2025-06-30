import { Router } from 'express';
import { create, getAll, updateById } from '../../controllers/cpt/material.controller.js';

const router = Router();

// Rutas para /api/materiales/:empresa
router.route('/materiales/:empresa')
  .post(create)
  .get(getAll);

// Ruta para /api/materiales/:empresa/:materialId
router.route('/materiales/:empresa/:materialId')
  .put(updateById);

export default router;