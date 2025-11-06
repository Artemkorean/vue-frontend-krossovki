// server/services/CartService.js
import db from '../config/database.js'; 

class CartService {
  static async getCartItems(userId) {
    const query = `
      SELECT c.id, c.product_id, p.name, p.price, p.image_urls, c.quantity, (p.price * c.quantity) AS total_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) {
          console.error('Database error fetching cart items:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static async addItemToCart(userId, productId, quantity) {
    const checkQuery = 'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?';
    const insertQuery = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?';

    return new Promise((resolve, reject) => {
      db.query(checkQuery, [userId, productId], (err, results) => {
        if (err) {
          console.error('Database error checking cart item:', err);
          reject(err);
          return;
        }

        if (results.length > 0) {
          // Товар уже в корзине, увеличиваем количество
          db.query(insertQuery, [userId, productId, quantity, quantity], (err) => {
            if (err) {
              console.error('Database error updating cart item quantity:', err);
              reject(err);
            } else {
              resolve();
            }
          });
        } else {
          // Товара нет в корзине, добавляем
          db.query(insertQuery, [userId, productId, quantity, quantity], (err) => {
            if (err) {
              console.error('Database error inserting cart item:', err);
              reject(err);
            } else {
              resolve();
            }
          });
        }
      });
    });
  }

  static async updateCartItem(userId, productId, newQuantity) {
    const query = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?';
    return new Promise((resolve, reject) => {
      if (newQuantity === 0) {
        // Если количество 0, лучше удалить запись
        this.removeItemFromCart(userId, productId).then(resolve).catch(reject);
      } else {
        db.query(query, [newQuantity, userId, productId], (err) => {
          if (err) {
            console.error('Database error updating cart item:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  }

  static async removeItemFromCart(userId, productId) {
    const query = 'DELETE FROM cart WHERE user_id = ? AND product_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [userId, productId], (err) => {
        if (err) {
          console.error('Database error removing cart item:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async clearCart(userId) {
    const query = 'DELETE FROM cart WHERE user_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err) => {
        if (err) {
          console.error('Database error clearing cart:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

export default CartService;