import db from "../config/database.js";

class OrderService {
  static getAllOrders(userid = null) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM orders';
      let params = [];
      if (userid) {
        sql += ' WHERE userid = ?';
        params = [userid];
      }
      sql += ' ORDER BY created_at DESC';

      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getOrderById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Создать заказ: получаем цены из таблицы items
  static createOrder(userid, items) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(items) || items.length === 0) {
        reject(new Error('Поле items должно быть непустым массивом'));
        return;
      }
      const created_at = new Date().toISOString();

      // Сначала получаем цены для всех itemid
      const itemIds = items.map(item => item.itemid);
      const placeholders = itemIds.map(() => '?').join(',');

      db.all(
        `SELECT id, price FROM items WHERE id IN (${placeholders})`,
        itemIds,
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          const priceMap = {};
          for (const row of rows) {
            priceMap[row.id] = row.price;
          }

          // Проверяем, что все itemid существуют
          for (const item of items) {
            if (priceMap[item.itemid] === undefined) {
              reject(new Error(`Товар с id ${item.itemid} не найден`));
              return;
            }
          }

          // Считаем итоговую цену
          const total_price = items.reduce((sum, item) => {
            return sum + (priceMap[item.itemid] * item.quantity);
          }, 0);

          db.serialize(() => {
            db.run(
              'INSERT INTO orders (userid, total_price, created_at) VALUES (?, ?, ?)',
              [userid, total_price, created_at],
              function (err) {
                if (err) {
                  reject(err);
                  return;
                }
                const orderId = this.lastID;

                let stmt = db.prepare('INSERT INTO order_items (orderid, itemid, quantity, price_at_time, size) VALUES (?, ?, ?, ?, ?)');
                for (let item of items) {
                  stmt.run(orderId, item.itemid, item.quantity, priceMap[item.itemid], item.size);
                }
                stmt.finalize();

                // Очищаем корзину после создания заказа (опционально)
                // db.run('DELETE FROM cart WHERE userid = ?', [userid], (err) => {
                //   if (err) console.error("Ошибка при очистке корзины:", err);
                // });

                resolve({ id: orderId, userid, total_price, created_at });
              }
            );
          });
        }
      );
    });
  }

  static updateOrder(id, status) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id], function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }

  static deleteOrder(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM orders WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }
}

export default OrderService;
