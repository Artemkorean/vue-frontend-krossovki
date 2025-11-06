// controllers/ItemController.js
import ItemService from '../services/item.js';

class ItemController {
  /**
   * Создание нового товара.
   * Ожидает тело запроса с полями: name, price, description, sizes, image.
   * Требует аутентификацию администратора.
   */
  static async createItem(req, res) {
    try {
      const { name, price, description = '', sizes = '', image = '' } = req.body;

      // Валидация (базовая)
      if (!name || typeof name !== 'string' || !price || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Название и положительная цена обязательны' });
      }

      // req.user устанавливается middleware authenticateUser
      // Проверка, что вызывающий (req.user) является администратором,
      // должна происходить в middleware requireAdmin, примененном к маршруту.

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

  /**
   * Удаление товара по ID.
   * Ожидает ID товара в параметрах URL (req.params.id).
   * Требует аутентификацию администратора.
   */
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

  /**
   * Получение товара по ID.
   * Ожидает ID товара в параметрах URL (req.params.id).
   * Может быть доступно без аутентификации или только администратору, в зависимости от требований.
   */
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

  /**
   * Получение списка всех товаров.
   * Может быть доступно без аутентификации или только администратору, в зависимости от требований.
   */
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
}

export default ItemController;