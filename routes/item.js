// routes/items.js
import express from 'express';
import ItemController from '../controllers/item.js';
import authenticateUser from '../middlewares/authenticateUser.js';
import requireAdmin from '../middlewares/authenticateUser.js';

const router = express.Router();

// --- Публичные маршруты (доступны всем) ---
router.get('/', ItemController.getItemsWithFilters);
// router.get('/', ItemController.getAllItems);
router.get('/:id', ItemController.getItemById);

// --- Защищенные маршруты (доступны только администратору) ---
router.post('/', authenticateUser, requireAdmin, ItemController.createItem);

router.delete('/:id', authenticateUser, requireAdmin, ItemController.deleteItemById);

router.patch('/:id', authenticateUser, requireAdmin, ItemController.updateItem);

export default router;
