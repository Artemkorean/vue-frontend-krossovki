// setupAdmin.js
import AuthService from '../services/auth.js'; // Путь к вашему AuthService
import bcrypt from 'bcryptjs';

async function createInitialAdmin() {
  const username = 'admin'; // Имя пользователя для админа
  const email = 'admin@email.com'; // Email для админа
  const password = '12345678'; // Пароль для админа

  try {
    // Проверьте, существует ли уже администратор (опционально, но рекомендуется)
    // Это можно сделать, например, запросом к базе данных на поиск пользователя с ролью 'admin'
    // const existingAdmin = await checkIfAdminExists(); // реализуйте эту функцию
    // if (existingAdmin) {
    //   console.log("Администратор уже существует.");
    //   return;
    // }

    const result = await AuthService.createAdmin(username, email, password);
    console.log("Администратор успешно создан:");
    console.log(`ID: ${result.user.id}`);
    console.log(`Имя: ${result.user.username}`);
    console.log(`Email: ${result.user.email}`);
    console.log(`Роль: ${result.user.role}`);
    console.log(`Токен (для тестирования): ${result.token}`); // Не храните и не передавайте токен в production!
  } catch (error) {
    console.error("Ошибка при создании администратора:", error.message);
  }
}

export default createInitialAdmin();