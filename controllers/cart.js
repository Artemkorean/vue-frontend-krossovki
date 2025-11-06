// server/controllers/CartController.js
import CartService from '../services/CartService.js';

class CartController {
  // GET /api/cart
  static async getCart(req, res) {
    const userId = req.user.id; // Получаем ID пользователя из токена (middleware)

    try {
      const cartItems = await CartService.getCartItems(userId);
      res.status(200).json({ success: true, items: cartItems });
    } catch (error) {
      console.error('Error in CartController.getCart:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch cart' });
    }
  }

  // POST /api/cart/add
  static async addItem(req, res) {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Валидация
    if (!productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid product ID or quantity' });
    }

    try {
      await CartService.addItemToCart(userId, productId, quantity);
      res.status(200).json({ success: true, message: 'Item added to cart' });
    } catch (error) {
      console.error('Error in CartController.addItem:', error);
      res.status(500).json({ success: false, message: 'Failed to add item to cart' });
    }
  }

  // PUT /api/cart/update
  static async updateItem(req, res) {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Валидация
    if (!productId || quantity < 0) {
      return res.status(400).json({ success: false, message: 'Invalid product ID or quantity' });
    }

    try {
      await CartService.updateCartItem(userId, productId, quantity);
      if (quantity === 0) {
        res.status(200).json({ success: true, message: 'Item removed from cart' });
      } else {
        res.status(200).json({ success: true, message: 'Cart item updated' });
      }
    } catch (error) {
      console.error('Error in CartController.updateItem:', error);
      res.status(500).json({ success: false, message: 'Failed to update cart item' });
    }
  }

  // DELETE /api/cart/remove/:productId
  static async removeItem(req, res) {
    const { productId } = req.params;
    const userId = req.user.id;

    // Валидация
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    try {
      await CartService.removeItemFromCart(userId, parseInt(productId, 10)); // Убедимся, что productId - число
      res.status(200).json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
      console.error('Error in CartController.removeItem:', error);
      res.status(500).json({ success: false, message: 'Failed to remove item from cart' });
    }
  }

  // POST /api/cart/clear
  static async clearCart(req, res) {
    const userId = req.user.id;

    try {
      await CartService.clearCart(userId);
      res.status(200).json({ success: true, message: 'Cart cleared' });
    } catch (error) {
      console.error('Error in CartController.clearCart:', error);
      res.status(500).json({ success: false, message: 'Failed to clear cart' });
    }
  }
}

export default CartController;