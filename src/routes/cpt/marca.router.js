import { Router } from 'express';
import { create, getAll, updateById } from '../../controllers/cpt/marca.controller.js';

const router = Router();

// Rutas para /api/marcas/:empresa
router.route('/marcas/:empresa')
  .post(create)
  .get(getAll);

// Ruta para /api/marcas/:empresa/:marcaId
router.route('/marcas/:empresa/:marcaId')
  .put(updateById);

export default router;