import { Router } from 'express';
import { create, getAll, updateById } from '../../controllers/cpt/color.controller.js';

const router = Router();

router.route('/colores/:empresa')
  .post(create)
  .get(getAll);

router.route('/colores/:empresa/:colorId')
  .put(updateById);

export default router;