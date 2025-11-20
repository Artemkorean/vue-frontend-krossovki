// services/ItemService.js
import db from '../config/database.js'; // Импортируем подключение к БД

class ItemService {

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

  static async updateItem(id, { name, price, description = '', sizes = '', image = '' }) {
    if (!id || typeof id !== 'number' || Number.isNaN(id)) {
      throw new Error('ID товара должен быть числом');
    }
    if (!name || typeof name !== 'string' || !price || typeof price !== 'number' || price <= 0) {
      throw new Error('Название и положительная цена обязательны');
    }

    return new Promise((resolve, reject) => {
      const query = `
        UPDATE items
        SET name = ?, description = ?, price = ?, sizes = ?, image = ?
        WHERE id = ?
      `;
      const params = [name, description, price, sizes, image, id];

      db.run(query, params, function (err) {
        if (err) {
          console.error('Ошибка при обновлении товара:', err);
          reject(new Error(`Ошибка базы данных при обновлении товара: ${err.message}`));
        } else {
          if (this.changes === 0) {
            reject(new Error(`Товар с id ${id} не найден`));
          } else {
            resolve({
              id,
              name,
              description,
              price,
              sizes,
              image,
              message: 'Товар успешно обновлён'
            });
          }
        }
      });
    });
  }

}

export default ItemService;
