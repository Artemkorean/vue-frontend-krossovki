import express from 'express';
import AuthController from '../controllers/auth.js';
import authenticateUser from '../middlewares/authenticateUser.js';

const router = express.Router();

// Публичные маршруты (не требуют аутентификации)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

export default router;