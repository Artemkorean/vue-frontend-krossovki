// routes/items.js
import express from 'express';
import ItemController from '../controllers/item.js';
import authenticateUser from '../middlewares/authenticateUser.js';
import requireAdmin from '../middlewares/authenticateUser.js';

const router = express.Router();

// --- Публичные маршруты (доступны всем) ---
// Получить список всех товаров
// GET /api/items
router.get('/', ItemController.getAllItems);

// Получить товар по ID
// GET /api/items/:id
router.get('/:id', ItemController.getItemById);

// --- Защищенные маршруты (доступны только администратору) ---
// Создать новый товар
// POST /api/items
// Требует: токен администратора в заголовке Authorization
router.post('/', authenticateUser, requireAdmin, ItemController.createItem);

// Удалить товар по ID
// DELETE /api/items/:id
// Требует: токен администратора в заголовке Authorization
router.delete('/:id', authenticateUser, requireAdmin, ItemController.deleteItemById);

// Пример: можно добавить и другие защищенные маршруты, например, обновление
// PUT /api/items/:id
router.patch('/:id', authenticateUser, requireAdmin, ItemController.updateItem);

export default router;
