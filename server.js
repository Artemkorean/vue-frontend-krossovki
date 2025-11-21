import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/database.js'
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/item.js';
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/order.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DATABASE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL


app.use(cors({
  origin: FRONTEND_URL, // URL вашего фронтенда
  credentials: true,                // если нужно отправлять куки/авторизацию
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/items', itemRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes)

// Простой маршрут
app.get('/', (req, res) => {
  res.send('Привет с сервера на Express!');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});


const shutdown = () => {
  console.log('Останавливаем сервер... ⛔');
  db.close(err => {
    if (err) {
      console.error('Не получилось закрыть базу:', err.message);
      process.exit(1);
    }
    console.log('База закрыта. До встречи! 👋');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
