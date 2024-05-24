import { Router } from 'express';
import { registerPersona, loginPersona } from '../controllers/personasController.js';

const router = Router();

router.post('/register', registerPersona);
router.post('/login', loginPersona);

export default router;
