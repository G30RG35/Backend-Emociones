import express from 'express';
import bodyParser from 'body-parser';
import emocionesRoutes from './routes/emociones.js';
import personasRoutes from './routes/personas.js';
import registrosRoutes from './routes/registros.js';
import * as dotenv from 'dotenv';
import db from './config/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/emociones', emocionesRoutes);
app.use('/personas', personasRoutes);
app.use('/registros', registrosRoutes);

db.getConnection()
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos', err);
    });
