const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart,clearCart } = require('../controllers/cartcontroller');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/:productId', protect, removeFromCart);
router.delete('/', protect, clearCart);

module.exports = router;