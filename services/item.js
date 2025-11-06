// services/ItemService.js
import db from '../config/database.js'; // Импортируем подключение к БД

class ItemService {
  /**
   * Создает новый товар в базе данных.
   * @param {string} name - Название товара.
   * @param {number} price - Цена товара.
   * @param {string} [description=''] - Описание товара (опционально).
   * @param {string} [sizes=''] - Доступные размеры (например, "S,M,L" или JSON строка) (опционально).
   * @param {string} [image=''] - Путь/URL к изображению товара (опционально).
   * @returns {Promise<Object>} Объект с информацией о созданном товаре.
   * @throws {Error} Если произошла ошибка базы данных или валидации.
   */
  static async createItem(name, price, description = '', sizes = '', image = '') {
    // Валидация (базовая)
    if (!name || typeof name !== 'string' || !price || typeof price !== 'number' || price <= 0) {
      throw new Error('Название и положительная цена обязательны');
    }

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO items (name, description, price, sizes, image)
        VALUES (?, ?, ?, ?, ?)
      `;
      const params = [name, description, price, sizes, image];

      db.run(query, params, function (err) {
        if (err) {
          console.error('Ошибка при создании товара:', err);
          reject(new Error(`Ошибка базы данных при создании товара: ${err.message}`));
        } else {
          // 'this' в контексте db.run ссылается на объект Statement
          // this.lastID - ID последней вставленной строки
          resolve({
            id: this.lastID,
            name,
            description,
            price,
            sizes,
            image,
            message: 'Товар успешно создан'
          });
        }
      });
    });
  }

  /**
   * Удаляет товар из базы данных по ID.
   * @param {number} itemId - ID товара для удаления.
   * @returns {Promise<Object>} Объект с сообщением об успешном удалении.
   * @throws {Error} Если товар не найден или произошла ошибка базы данных.
   */
  static async deleteItemById(itemId) {
    // Валидация (базовая)
    if (!itemId || typeof itemId !== 'number' || itemId <= 0) {
      throw new Error('ID товара должен быть положительным числом');
    }

    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM items WHERE id = ?';
      const params = [itemId];

      db.run(query, params, function (err) {
        if (err) {
          console.error('Ошибка при удалении товара:', err);
          reject(new Error(`Ошибка базы данных при удалении товара: ${err.message}`));
        } else {
          // 'this' в контексте db.run ссылается на объект Statement
          // this.changes - количество изменённых строк
          if (this.changes === 0) {
            // Никакая строка не была удалена, значит, ID не существовал
            reject(new Error('Товар не найден'));
          } else {
            resolve({ message: `Товар с ID ${itemId} успешно удален` });
          }
        }
      });
    });
  }

  // --- Дополнительно: Метод для получения товара по ID ---
  // Может быть полезен для проверки существования или получения данных перед обновлением
  static async getItemById(itemId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM items WHERE id = ?';
      db.get(query, [itemId], (err, row) => {
        if (err) {
          console.error('Ошибка при получении товара по ID:', err);
          reject(new Error(`Ошибка базы данных: ${err.message}`));
        } else {
          resolve(row || null); // Возвращает товар или null, если не найден
        }
      });
    });
  }

  // --- Дополнительно: Метод для получения всех товаров ---
  static async getAllItems(limit = 100, offset = 0) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM items ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      db.all(query, [limit, offset], (err, rows) => {
        if (err) {
          console.error('Ошибка при получении списка товаров:', err);
          reject(new Error(`Ошибка базы данных: ${err.message}`));
        } else {
          resolve(rows);
        }
      });
    });
  }
}

export default ItemService;