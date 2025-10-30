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
}

export default AuthController;