// src/services/userService.js
import db from '../config/database.js';

class UserService {

  // Получить всех пользователей с фильтрацией и сортировкой
  static getAllUsers({ sortBy = 'created_at', sortOrder = 'DESC', searchQuery = '', limit = 100, offset = 0 }) {
    return new Promise((resolve, reject) => {
      const validSortColumns = ['id', 'email', 'username', 'created_at'];
      const sortCol = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
      const sortOrd = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      let query = `SELECT id, email, username, created_at FROM users WHERE 1=1`;
      const params = [];

      if (searchQuery) {
        query += ` AND (email LIKE ? OR username LIKE ?)`;
        params.push(`%${searchQuery}%`, `%${searchQuery}%`);
      }

      query += ` ORDER BY ${sortCol} ${sortOrd} LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), parseInt(offset));

      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Получить пользователя по ID
  static getUserById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, email, username, created_at FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Обновить пользователя
  static updateUser(id, { email, username }) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET email = ?, username = ? WHERE id = ?',
        [email, username, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0); // true, если обновлено
          }
        }
      );
    });
  }

  // Удалить пользователя
  static deleteUser(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0); // true, если удален
        }
      });
    });
  }
}

export default UserService
