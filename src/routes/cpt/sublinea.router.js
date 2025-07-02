import { Router } from 'express';
import { create, getAll, updateById } from '../../controllers/cpt/sublinea.controller.js';

const router = Router();

// Rutas para /api/sublineas/:empresa
router.route('/sublineas/:empresa')
  .post(create)
  .get(getAll);

// Ruta para /api/sublineas/:empresa/:sublineaId
router.route('/sublineas/:empresa/:sublineaId')
  .put(updateById);

export default router;