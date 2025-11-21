import jwt from 'jsonwebtoken';

// Middleware для проверки токена
const JWT_SECRET = "mySuperSecretKey"

export default function authenticateUser(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log(token);


    if (!token) {
        return res.status(401).json({ error: "Требуется авторизация" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        console.log(decoded); // undefind


        if (err) {
            return res.status(403).json({ error: `Недействительный токен ${err}` });
        }

        // Проверяем, что в токене есть userId
        if (!decoded.userId) {
            return res.status(403).json({ error: "Токен не содержит идентификатор пользователя" });
        }

        req.user = {
            id: decoded.userId,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role,
        };
        next();
    });
}

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ запрещен: требуется роль администратора' });
  }
  next();
};
