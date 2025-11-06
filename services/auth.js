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
    // Проверьте, существует ли уже администратор (необязательно, но рекомендуется)
    // const existingAdmin = await this.getAdminUser(); // реализуйте, если нужно
    // if (existingAdmin) throw new Error('Администратор уже существует');

    try {
      // Регистрируем пользователя с ролью 'admin'
      return await this.registerUser(username, email, password, 'admin');
    } catch (error) {
      console.error("Ошибка создания администратора:", error);
      throw error; // Перебросьте ошибку наверх
    }
  }
  // static async initializeAdminUser() {
  //   console.log("Проверка наличия администратора...");

  //   return new Promise((resolve, reject) => {
  //     // Проверяем, есть ли пользователь с ролью 'admin'
  //     db.get('SELECT id FROM users WHERE role = ?', ['admin'], (err, row) => {
  //       if (err) {
  //         console.error("Ошибка при проверке администратора:", err);
  //         // Важно: не вызываем reject здесь, чтобы сервер всё равно запускался
  //         resolve(); // Продолжаем запуск
  //         return;
  //       }

  //       if (row) {
  //         // Администратор уже существует
  //         console.log("Администратор уже существует в базе данных.");
  //         resolve();
  //       } else {
  //         // Администратор не найден, создаем его
  //         console.log("Администратор не найден. Создаём администратора по умолчанию...");
  //         const defaultAdminUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
  //         const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
  //         const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'defaultPassword123!';

  //         AuthService.createAdmin(defaultAdminUsername, defaultAdminEmail, defaultAdminPassword)
  //           .then(result => {
  //             console.log(`Администратор по умолчанию создан: ${defaultAdminUsername} (${defaultAdminEmail})`);
  //             console.log(`ID: ${result.user.id}`);
  //             resolve();
  //           })
  //           .catch(err => {
  //             console.error("Ошибка при создании администратора по умолчанию:", err.message);
  //             // Опционально: можно вызвать reject, если админ критически важен
  //             // reject(err);
  //             resolve(); // Продолжаем запуск, даже если не удалось создать админа
  //           });
  //       }
  //     });
  //   })
  // }
}
export default AuthService;