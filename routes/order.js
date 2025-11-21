import express from 'express';
import OrderController from '../controllers/order.js';
import authenticateUser from '../middlewares/authenticateUser.js';
import requireAdmin from '../middlewares/authenticateUser.js';

const router = express.Router();

router.post('/', authenticateUser, OrderController.createOrder);

// Остальные маршруты — только для администратора
router.get('/', authenticateUser, requireAdmin, OrderController.getAllOrders);
router.get('/:id', authenticateUser, requireAdmin, OrderController.getOrderById);
router.put('/:id', authenticateUser, requireAdmin, OrderController.updateOrder);
router.delete('/:id', authenticateUser, requireAdmin, OrderController.deleteOrder);

export default router;
