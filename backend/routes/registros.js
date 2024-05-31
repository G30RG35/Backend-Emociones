import { Router } from 'express';
import { addRegistro, getRegistrosUltimos7Dias,obtenerSemanasUsuario,getRegistrosPorSemanaYUsuario } from '../controllers/registrosController.js';

const router = Router();

router.post('/', addRegistro);
router.get('/:persona_id/ultimos7dias', getRegistrosUltimos7Dias);
router.get('/:persona_id/semanas', obtenerSemanasUsuario);
router.get('/:persona_id/semanapasada/:semana', getRegistrosPorSemanaYUsuario);

export default router;
