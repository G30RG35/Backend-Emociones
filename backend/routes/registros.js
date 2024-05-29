import { Router } from 'express';
import { addRegistro, getRegistrosUltimos7Dias } from '../controllers/registrosController.js';

const router = Router();

router.post('/', addRegistro);
router.get('/:persona_id', getRegistrosUltimos7Dias);

export default router;
