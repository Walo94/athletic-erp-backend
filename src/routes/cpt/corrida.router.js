import { Router } from 'express';
import { create, getAll, updateById } from '../../controllers/cpt/corrida.controller.js';

const router = Router();

router.route('/corridas/:empresa')
  .post(create)
  .get(getAll);

router.route('/corridas/:empresa/:corridaId')
  .put(updateById);

export default router;