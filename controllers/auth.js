import AuthService from '../services/auth.js';

class AuthController {
  // Регистрация пользователя
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Валидация входных данных
      if (!username || !email || !password) {
        return res.status(400).json({ 
          error: 'Нужно указать имя, почту и пароль' 
        });
      }

      const result = await AuthService.registerUser(username, email, password);

      res.status(201).json({
        message: 'Пользователь создан',
        jwt: result.token,
        username: result.user.username,
        email: result.user.email,
        userId: result.user.id
      });
    } catch (error) {
      // Обработка специфичных ошибок
      if (error.message === 'Пользователь с таким именем или почтой уже существует') {
        return res.status(409).json({ error: error.message });
      }
      if (error.message === 'Ошибка шифрования пароля') {
        return res.status(500).json({ error: error.message });
      }
      
    }
  }
  // Авторизация пользователя
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Валидация входных данных
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Нужно указать почту и пароль' 
        });
      }

      const result = await AuthService.loginUser(email, password);

      res.json({
        message: 'Вы успешно авторизовались',
        jwt: result.token,
        user: result.user
      });
    } catch (error) {
      // Обработка специфичных ошибок
      if (error.message === 'Пользователь не найден') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Неверный пароль') {
        return res.status(401).json({ error: error.message });
      }
      
    }
  }
  
  static async getProfile(req, res) {
    try {
      // req.user устанавливается middleware authenticateToken
      // Возвращаем информацию о текущем пользователе из req.user
      res.json({
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          role: req.user.role // Включаем роль в профиль
        }
      });
    } catch (error) {
      console.error('Ошибка в AuthController.getProfile:', error); // Логирование для отладки
      return res.status(500).json({ error: 'Произошла ошибка при получении профиля' });
    }
  }

  static async createAdmin(req, res) {
    try {
      const { username, email, password } = req.body;

      // Валидация входных данных
      if (!username || !email || !password) {
        return res.status(400).json({
          error: 'Нужно указать имя, почту и пароль для администратора'
        });
      }
      // Вызов сервиса для регистрации с ролью 'admin'
      const result = await AuthService.registerUser(admin, email, password, 'admin');

      res.status(201).json({
        message: 'Администратор создан',
        jwt: result.token, // Вопрос: нужно ли выдавать токен новому админу сразу? Возможно, нет.
        user: result.user
      });
      } catch (error) {
      console.error('Ошибка в AuthController.createAdmin:', error); // Логирование для отладки
      // Обработка специфичных ошибок
      if (error.message === 'Пользователь с таким именем или почтой уже существует') {
        return res.status(409).json({ error: error.message });
      }
      if (error.message === 'Ошибка шифрования пароля') {
        return res.status(500).json({ error: error.message });
      }
      // Обработка общей ошибки базы данных или других непредвиденных ошибок
      return res.status(500).json({ error: 'Произошла ошибка при создании администратора' });
    }
  }
}

export default AuthController;