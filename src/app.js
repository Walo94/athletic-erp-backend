import express from 'express';
import cors from 'cors';

// Routes de CPT
import colorRouter from './routes/cpt/color.router.js';
import corridaRouter from './routes/cpt/corrida.router.js';
import codigosBarrasRouter from './routes/cpt/codigosBarras.router.js';
import materialRouter from './routes/cpt/material.router.js';
import proveedorRouter from './routes/cpt/proveedor.router.js';
import sublineaRouter from './routes/cpt/sublinea.router.js';
import lineaRouter from './routes/cpt/linea.router.js';
import marcaRouter from './routes/cpt/marca.router.js';
import combinacionRouter from './routes/cpt/combinacion.router.js';

// Routes de CMP
import paqueteRouter from './routes/cmp/paquete.router.js'
import suelaRouter from './routes/cmp/suela.router.js';

// Routes de INYECCION
import inyeccionRouter from './routes/inyeccion/inyeccion.router.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Rutas de la API
app.use('/api', colorRouter);
app.use('/api', corridaRouter);
app.use('/api', paqueteRouter);
app.use('/api', suelaRouter);
app.use('/api', inyeccionRouter);
app.use('/api', codigosBarrasRouter);
app.use('/api', proveedorRouter);
app.use('/api', materialRouter);
app.use('/api', sublineaRouter);
app.use('/api', lineaRouter);
app.use('/api', marcaRouter);
app.use('/api', combinacionRouter);





export default app;