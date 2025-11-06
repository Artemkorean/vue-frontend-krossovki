// server/routes/cart.js
import express from 'express';
import CartController from '../controllers/CartController.js';
import authenticateUser from '../middlewares/authenticateUser.js';

const router = express.Router();

// Применяем middleware аутентификации ко всем маршрутам корзины
router.use(authenticateUser);

// Определяем маршруты и связываем с методами контроллера
router.get('/', CartController.getCart);
router.post('/add', CartController.addItem);
router.put('/update', CartController.updateItem);
router.delete('/remove/:productId', CartController.removeItem); // Используем параметр URL
router.post('/clear', CartController.clearCart);

export default router;