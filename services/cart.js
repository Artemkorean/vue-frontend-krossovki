// server/services/CartService.js
import db from '../config/database.js';

class CartService {
  // Получить все товары из корзины пользователя
  static async getCartItems(userId) {
    const query = `
      SELECT
        c.id,
        c.itemid AS product_id,
        i.name,
        i.price,
        i.image AS image_url,  -- Предполагаем, что в таблице items поле image
        c.quantity,
        c.size,
        (i.price * c.quantity) AS total_price
      FROM carts c
      JOIN items i ON c.itemid = i.id
      WHERE c.userid = ?
    `;
    return new Promise((resolve, reject) => {
      db.all(query, [userId], (err, results) => {
        if (err) {
          console.error('Database error fetching cart items:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Добавить товар в корзину
  static async addItemToCart(userId, productId, quantity, size) {
    const query = `
      INSERT INTO carts (userid, itemid, quantity, size)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(userid, itemid, size) DO UPDATE SET quantity = quantity + excluded.quantity
    `;
    return new Promise((resolve, reject) => {
      db.run(query, [userId, productId, quantity, size], function(err) {
        if (err) {
          console.error('Database error adding to cart:', err);
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // Обновить количество товара в корзине
  static async updateCartItem(userId, productId, newQuantity, size) {
    const query = 'UPDATE carts SET quantity = ? WHERE userid = ? AND itemid = ? AND size = ?';
    return new Promise((resolve, reject) => {
      if (newQuantity <= 0) {
        // Если количество <= 0, удаляем запись
        this.removeItemFromCart(userId, productId, size).then(resolve).catch(reject);
      } else {
        db.run(query, [newQuantity, userId, productId, size], function(err) {
          if (err) {
            console.error('Database error updating cart item:', err);
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        });
      }
    });
  }

  // Удалить товар из корзины
  static async removeItemFromCart(userId, productId, size) {
    const query = 'DELETE FROM carts WHERE userid = ? AND itemid = ? AND size = ?';
    return new Promise((resolve, reject) => {
      db.run(query, [userId, productId, size], function(err) {
        if (err) {
          console.error('Database error removing cart item:', err);
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // Очистить корзину пользователя
  static async clearCart(userId) {
    const query = 'DELETE FROM carts WHERE userid = ?';
    return new Promise((resolve, reject) => {
      db.run(query, [userId], function(err) {
        if (err) {
          console.error('Database error clearing cart:', err);
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}

export default CartService;
