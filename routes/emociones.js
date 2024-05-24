import { Router } from 'express';
import { addDefaultEmotions } from '../controllers/emocionesController.js';
import { getTotalEmocionesUltimos7Dias } from '../controllers/emocionesController.js';

const router = Router();

router.get('/add-default', addDefaultEmotions);

router.get('/total-ultimos-7-dias', getTotalEmocionesUltimos7Dias);

export default router;
