import { Router } from 'express';
import {
  getInfoLote,
  getInfoPrograma,
  puedeAvanzar,
  registrarAvance,
  getOrdenDepartamento,
  getLotesDia,
  getLotesNoVendidos,
  updateLotesVendidos,
  verificarLotesVendidos,
  getDatosDetaFact
} from '../../controllers/inyeccion/inyeccion.controller.js';

const router = Router();

// Rutas de consulta
router.get('/inyeccion/lote/:lote/:anio', getInfoLote);
router.get('/inyeccion/programa/:lote/:year', getInfoPrograma);
router.get('/inyeccion/puede-avanzar/:lote/:programa/:ordenActual', puedeAvanzar);
router.get('/inyeccion/orden-departamento/:departamento', getOrdenDepartamento);
router.get('/inyeccion/lotes-dia/:dia/:modulo', getLotesDia);
router.get('/inyeccion/lotes-no-vendidos', getLotesNoVendidos);
router.get('/inyeccion/detafact', getDatosDetaFact);

// Rutas de acción (POST para crear, PUT para actualizar)
router.post('/inyeccion/registrar-avance', registrarAvance);
router.post('/inyeccion/verificar-lotes-vendidos', verificarLotesVendidos);
router.put('/inyeccion/lotes-vendidos', updateLotesVendidos);

export default router;