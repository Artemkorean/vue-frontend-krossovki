// controllers/ItemController.js
import ItemService from '../services/item.js';

class ItemController {
  static async getItemsWithFilters (req, res) {
    try {
      // Извлекаем параметры из запроса
      const {
        sortBy = 'created_at',
        sortOrder = 'DESC',
        searchQuery = '',
        limit = 100,
        offset = 0
      } = req.query;

      // Вызываем серверную функцию с этими параметрами
      const items = await ItemService.getFilteredItems({
        sortBy,
        sortOrder,
        searchQuery,
        limit: parseInt(limit, 10), // Убедитесь, что это число
        offset: parseInt(offset, 10)  // Убедитесь, что это число
      });

      res.json(items); // Отправляем отфильтрованные/отсортированные товары клиенту
    } catch (err) {
      console.error('Ошибка в контроллере getItemsWithFilters:', err);
      res.status(500).json({ error: err.message });
    }
  };

  static async createItem(req, res) {
    try {
      const { name, price, description = '', sizes = '', image = '' } = req.body;

      // Валидация (базовая)
      if (!name || typeof name !== 'string' || !price || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Название и положительная цена обязательны' });
      }
      const result = await ItemService.createItem(name, price, description, sizes, image);

      res.status(201).json(result);
    } catch (error) {
      console.error('Ошибка в ItemController.createItem:', error);
      if (error.message.includes('Ошибка базы данных')) {
        return res.status(500).json({ error: error.message });
      }
      // Обработка других ошибок валидации из сервиса
      return res.status(400).json({ error: error.message });
    }
  }

  static async deleteItemById(req, res) {
    try {
      const { id } = req.params; // ID товара из URL
      const itemId = parseInt(id, 10); // Преобразуем в число

      // Валидация (базовая)
      if (!itemId || itemId <= 0) {
        return res.status(400).json({ error: 'ID товара должен быть положительным числом' });
      }

      // req.user устанавливается middleware authenticateUser
      // Проверка, что вызывающий (req.user) является администратором,
      // должна происходить в middleware requireAdmin, примененном к маршруту.

      await ItemService.deleteItemById(itemId);

      res.json({ message: `Товар с ID ${itemId} успешно удален` });
    } catch (error) {
      console.error('Ошибка в ItemController.deleteItemById:', error);
      if (error.message === 'Товар не найден') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('Ошибка базы данных')) {
        return res.status(500).json({ error: error.message });
      }
      // Обработка других ошибок валидации из контроллера/сервиса
      return res.status(400).json({ error: error.message });
    }
  }

  static async getItemById(req, res) {
    try {
      const { id } = req.params;
      const itemId = parseInt(id, 10);

      // Валидация (базовая)
      if (!itemId || itemId <= 0) {
        return res.status(400).json({ error: 'ID товара должен быть положительным числом' });
      }

      const item = await ItemService.getItemById(itemId);

      if (!item) {
        return res.status(404).json({ error: 'Товар не найден' });
      }

      res.json(item);
    } catch (error) {
      console.error('Ошибка в ItemController.getItemById:', error);
      return res.status(500).json({ error: 'Произошла ошибка при получении товара' });
    }
  }

  static async getAllItems(req, res) {
    try {
      // Опционально: получить limit и offset из query параметров
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;

      // Валидация (базовая)
      if (limit <= 0 || offset < 0) {
        return res.status(400).json({ error: 'Параметры limit и offset должны быть положительными числами' });
      }

      const items = await ItemService.getAllItems(limit, offset);

      res.json(items);
    } catch (error) {
      console.error('Ошибка в ItemController.getAllItems:', error);
      return res.status(500).json({ error: 'Произошла ошибка при получении списка товаров' });
    }
  }

  static async updateItem(req, res) {
  try {
    const { id } = req.params;
    const { name, price, description = '', sizes = '', image = '' } = req.body;

    // Валидация
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID товара должен быть числом' });
    }
    if (!name || typeof name !== 'string' || !price || typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Название и положительная цена обязательны' });
    }

    const result = await ItemService.updateItem(Number(id), { name, price, description, sizes, image });

    res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка в ItemController.updateItem:', error);
    if (error.message.includes('Ошибка базы данных')) {
      return res.status(500).json({ error: error.message });
    }
    if (error.message.includes('не найден')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(400).json({ error: error.message });
  }
  }
}

export default ItemController;
