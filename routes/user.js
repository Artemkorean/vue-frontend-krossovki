// src/routes/userRoutes.js
import express from 'express';
import { UserController } from '../controllers/userController.js';
import  requireAdmin from '../middlewares/authenticateUser.js';
import authenticateUser from '../middlewares/authenticateUser.js';
const router = express.Router();
// маршруты требующие авторизации
router.patch('/:id', authenticateUser, requireAdmin, UserController.updateUser);
router.delete('/:id', authenticateUser, requireAdmin, UserController.deleteUser);
// маршруты требуют админ-прав
router.get('/', authenticateUser, requireAdmin, UserController.getAllUsers);
router.get('/:id', authenticateUser, requireAdmin, UserController.getUserById);

export default router;
