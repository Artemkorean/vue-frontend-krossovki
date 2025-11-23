import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mySuperSecretKey';

class AuthService {
  // Регистрация пользователя (работает)
  static async registerUser(username, email, password, role = 'buyer') {
    try {
      const hash = bcrypt.hashSync(password, 10);

      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (username, email, password_hash, role) VALUES (?,?,?,?)',
          [username, email, hash, role],
          function(err) {
            if (err) {
              if (err.code === 'SQLITE_CONSTRAINT') {
                reject(new Error('Пользователь с таким именем или почтой уже существует'));
              } else {
                reject(new Error(err.message));
              }
            } else {
              const token = jwt.sign(
                {
                  userId: this.lastID,
                  email: email,
                  username: username,
                  role: role
                },
                JWT_SECRET,
                { expiresIn: '24h' }
              );

              resolve({
                token,
                user: {
                  id: this.lastID,
                  username,
                  email,
                  role
                }
              });
            }
          }
        );
      });
    } catch (error) {
      throw new Error('Ошибка шифрования пароля');
    }
  }

  // Авторизация пользователя (работает)
  static async loginUser(email, password) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, username, email, password_hash, role FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
          reject(new Error('Ошибка базы данных'));
          return;
        }

        if (!user) {
          reject(new Error('Пользователь не найден'));
          return;
        }

        const isCheckHash = bcrypt.compareSync(password, user.password_hash);

        if (!isCheckHash) {
          reject(new Error('Неверный пароль'));
          return;
        }

        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            username: user.username,
            role: user.role
          },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        resolve({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      });
    });
  }

  static async getUserById(userId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, username, email, role FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
          console.error("Ошибка получения пользователя по ID:", err);
          reject(new Error('Ошибка базы данных'));
          return;
        }
        resolve(user || null);
      });
    });
  }

  static async createAdmin(username, email, password) {
    try {
      // Регистрируем пользователя с ролью 'admin'
      return await this.registerUser(username, email, password, 'admin');
    } catch (error) {
      console.error("Ошибка создания администратора:", error);
      throw error; // Перебросьте ошибку наверх
    }
  }
}
export default AuthService;
