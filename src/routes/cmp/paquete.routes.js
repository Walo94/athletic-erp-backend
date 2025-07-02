import { Router } from 'express';
import { getPaquetes, createPaquete, deletePaquete } from '../../controllers/cmp/paquete.controller.js';

const router = Router();
router.get('/paquetes/:periodo/:paquete', getPaquetes);
router.post('/paquetes', createPaquete);
router.delete('/paquetes/:paquete', deletePaquete);

export default router;