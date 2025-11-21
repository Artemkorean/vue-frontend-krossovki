import OrderService from "../services/order.js";

class OrderController {
  // Получить все заказы
  static getAllOrders = async (req, res) => {
    try {
      // Проверка роли: админ или обычный пользователь
      const userRole = req.user?.role;
      const userid = userRole === 'admin' ? null : req.user.id;

      const orders = await OrderService.getAllOrders(userid);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Получить заказ по ID
  static getOrderById = async (req, res) => {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderByIdWithItems(id);
      if (!order) {
        return res.status(404).json({ error: 'Заказ не найден' });
      }

      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Создать заказ
  static createOrder = async (req, res) => {
    try {
      const { items } = req.body;
      const userid = req.user.id;

      const order = await OrderService.createOrder(userid,items);
      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Обновить заказ (например, статус)
  static updateOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await OrderService.updateOrder(id, status);
      if (updated) {
        res.json({ message: 'Заказ обновлён' });
      } else {
        res.status(404).json({ error: 'Заказ не найден' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Удалить заказ
  static deleteOrder = async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await OrderService.deleteOrder(id);
      if (deleted) {
        res.json({ message: 'Заказ удалён' });
      } else {
        res.status(404).json({ error: 'Заказ не найден' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
}

export default OrderController;
