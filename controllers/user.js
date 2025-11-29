// src/controllers/userController.js
import UserService from '../services/user.js';

class UserController {
  // Получить всех пользователей (только админ)
  static getAllUsers = async (req, res) => {
    try {
      const { sortBy, sortOrder, searchQuery, limit, offset } = req.query;

      const users = await UserService.getAllUsers({ sortBy, sortOrder, searchQuery, limit, offset });

      res.json(users);
    } catch (err) {
      console.error('Ошибка при получении пользователей:', err);
      res.status(500).json({ message: 'Не удалось загрузить пользователей' });
    }
  };

  // Получить пользователя по ID (только админ)
  static getUserById = async (req, res) => {
    const { id } = req.params;

    try {
      const user = await UserService.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      res.json(user);
    } catch (err) {
      console.error(`Ошибка при получении пользователя с ID ${id}:`, err);
      res.status(500).json({ message: `Не удалось загрузить пользователя с ID ${id}` });
    }
  };

  // Обновить пользователя (только админ)
  static updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, username } = req.body;

    try {
      const success = await UserService.updateUser(id, { email, username });

      if (!success) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      res.json({ id, email, username });
    } catch (err) {
      console.error(`Ошибка при обновлении пользователя с ID ${id}:`, err);
      res.status(500).json({ message: `Не удалось обновить пользователя с ID ${id}` });
    }
  };

  // Удалить пользователя (только админ)
  static deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
      const success = await UserService.deleteUser(id);

      if (!success) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      res.status(200).json({ message: `Пользователь с ID ${id} успешно удалён` });
    } catch (err) {
      console.error(`Ошибка при удалении пользователя с ID ${id}:`, err);
      res.status(500).json({ message: `Не удалось удалить пользователя с ID ${id}` });
    }
  };
}

export default UserController
