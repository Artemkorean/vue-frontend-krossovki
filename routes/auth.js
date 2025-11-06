import express from 'express';
import AuthController from '../controllers/auth.js';
import {requireAdmin} from '../middlewares/authenticateUser.js';
import authenticateUser from '../middlewares/authenticateUser.js';
const router = express.Router();

// Публичные маршруты (не требуют аутентификации)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.post('/admin/create', authenticateUser, requireAdmin, AuthController.createAdmin);

export default router;