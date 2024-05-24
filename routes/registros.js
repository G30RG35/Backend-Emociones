import { Router } from 'express';
import { addRegistro, getRegistros } from '../controllers/registrosController.js';

const router = Router();

router.post('/', addRegistro);
router.get('/:persona_id', getRegistros);

export default router;
