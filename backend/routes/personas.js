import { Router } from 'express';
import { registerPersona, loginPersona ,actualizarUsuario} from '../controllers/personasController.js';

const router = Router();

router.post('/register', registerPersona);
router.post('/login', loginPersona);
router.post('/usuario', actualizarUsuario);

export default router;
