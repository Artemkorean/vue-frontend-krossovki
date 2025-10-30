import sqlite3pkg from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const sqlite3 = sqlite3pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname,'..','.tmp','db.sqlite'));

db.serialize(() => {
  console.log("Создание таблиц...");
  db.run("PRAGMA foreign_keys = ON");

  // Таблица пользователей
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица товаров
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица корзины
  db.run(`
    CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userid INTEGER NOT NULL,
      itemid INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (itemid) REFERENCES items (id) ON DELETE CASCADE
    )
  `);

  // Таблица избранного
  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userid INTEGER NOT NULL,
      itemid INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (itemid) REFERENCES items (id) ON DELETE CASCADE,
      UNIQUE(userid, itemid)  -- чтобы не дублировались пары
    )
  `);

  // Таблица заказов
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userid INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',  -- pending, paid, shipped, delivered, cancelled
      total_price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Таблица товаров в заказе (связь many-to-many между orders и items)
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderid INTEGER NOT NULL,
      itemid INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price_at_time REAL NOT NULL,  -- цена товара на момент заказа
      FOREIGN KEY (orderid) REFERENCES orders (id) ON DELETE CASCADE,
      FOREIGN KEY (itemid) REFERENCES items (id) ON DELETE CASCADE
    )
  `);

  console.log("Таблицы созданы!");
});

console.log("База данных готова!");

// db.close((err) => {
//   if (err) {
//     console.error("Ошибка при закрытии базы данных:", err);
//   } else {
//     console.log("База данных создана и закрыта.");
//   }
// });

export default db;