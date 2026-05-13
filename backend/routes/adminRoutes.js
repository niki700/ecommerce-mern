const express = require('express');
const router = express.Router();
const { getStats, getAllOrders, getAllUsers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/admin/stats — dashboard stats
router.get('/stats', protect, adminOnly, getStats);

// GET /api/admin/orders — all orders
router.get('/orders', protect, adminOnly, getAllOrders);

// GET /api/admin/users — all users
router.get('/users', protect, adminOnly, getAllUsers);
module.exports = router;