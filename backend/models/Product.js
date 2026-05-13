const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
    {
        name: { 
            type: String,
             required: [true, 'please enter a name']
             },
        description: {
             type: String, 
             required: [true, 'please enter a description'] 
            },
        price: {
             type: Number,
              required: [true, 'please enter a price'],
              min: [0, 'price must be a positive number'],
             },
        category: { 
            type: String,
             required: [true, 'please enter a category']
             },
        stock: {
             type: Number,
             default: 0,
    },    
     images:[{url: {type: String}, public_id: {type: String}}],
     
     ratings: {
        type: Number,
        default: 0,
     },
    }, 
    { timestamps: true }   
);
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;