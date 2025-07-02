import express from 'express';
import cors from 'cors';

// Routes de CPT
import colorRouter from './routes/cpt/color.routes.js';
import corridaRouter from './routes/cpt/corrida.routes.js';
import codigosBarrasRouter from './routes/cpt/codigosBarras.routes.js';
import materialRouter from './routes/cpt/material.routes.js';
import proveedorRouter from './routes/cpt/proveedor.routes.js';
import sublineaRouter from './routes/cpt/sublinea.routes.js';
import lineaRouter from './routes/cpt/linea.routes.js';
import marcaRouter from './routes/cpt/marca.routes.js';
import combinacionRouter from './routes/cpt/combinacion.routes.js';

// Routes de CMP
import paqueteRouter from './routes/cmp/paquete.routes.js'
import suelaRouter from './routes/cmp/suela.routes.js';

// Routes de INYECCION
import inyeccionRouter from './routes/inyeccion/inyeccion.routes.js';
import reportesInyeccionRouter from './routes/reportes/reportes-inyeccion.routes.js';

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

//Rutas de reportes
app.use('/api', reportesInyeccionRouter);

export default app;