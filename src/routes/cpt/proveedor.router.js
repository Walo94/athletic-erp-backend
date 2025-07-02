import { Router } from 'express';
import { create, getAll, updateById } from '../../controllers/cpt/proveedor.controller.js';

const router = Router();

// Rutas para /api/proveedores/:empresa
router.route('/proveedores/:empresa')
  .post(create)
  .get(getAll);

// Ruta para /api/proveedores/:empresa/:proveedorId
router.route('/proveedores/:empresa/:proveedorId')
  .put(updateById);

export default router;