const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/Product');

// POST /api/orders
const createOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        // userCart — different from Cart model
        const userCart = await Cart.findOne({ user: req.user._id })
            .populate('items.product');

        if (!userCart || userCart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty',
            });
        }

        // Check stock for each item
        for (const item of userCart.items) {
            // foundProduct — different from Product model
            const foundProduct = await Product.findById(item.product._id);
            if (foundProduct.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${foundProduct.name}`,
                });
            }
        }

        // newOrder — different from Order model
        const newOrder = await Order.create({
            user: req.user._id,
            items: userCart.items.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price,
            })),
            shippingAddress,
            totalPrice: userCart.totalPrice,
        });

        // Reduce stock for each product
        for (const item of userCart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Clear the cart
        userCart.items = [];
        userCart.totalPrice = 0;
        await userCart.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: newOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/orders/myorders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name price images')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
    try {
        // foundOrder — different from Order model
        const foundOrder = await Order.findById(req.params.id)
            .populate('items.product', 'name price images')
            .populate('user', 'name email');

        if (!foundOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (foundOrder.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access',
            });
        }

        res.status(200).json({
            success: true,
            data: foundOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // updatedOrder — different from Order model
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
};