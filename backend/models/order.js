const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // Which user placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Items ordered
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    // Delivery address — all fields inside shippingAddress
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },

    // Total price of whole order
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    // Payment status — capital P in isPaid
    isPaid: {
      type: Boolean,
      default: false,
    },

    // Where is the order right now
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);