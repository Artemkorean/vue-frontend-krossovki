import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mySuperSecretKey';

class AuthService {
  // Регистрация пользователя (работает)
  static async registerUser(username, email, password) {
    try {
      const hash = bcrypt.hashSync(password, 10);
      
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username, email, hash],
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
                  username: username
                },
                JWT_SECRET,
                { expiresIn: '24h' }
              );

              resolve({
                token,
                user: {
                  id: this.lastID,
                  username,
                  email
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
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
          reject(new Error('Ошибка базы данных'));
          return;
        }

        if (!user) {
          reject(new Error('Пользователь не найден'));
          return;
        }

        const isCheckHash = bcrypt.compareSync(password, user.password);

        if (!isCheckHash) {
          reject(new Error('Неверный пароль'));
          return;
        }

        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            username: user.username
          },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        resolve({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      });
    });
  }
}

export default AuthService;