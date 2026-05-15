const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const ProductRoutes = require("./routes/ProductRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors(
    {
        origin: [
            'http://localhost:5173',
            'https://ecommerce-mern-nu-three.vercel.app'
        ],
        credentials: true,
    }
));
app.use(express.json());

app.use("/api/products", ProductRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.get("/", (req, res) => {
    res.json({ message: "E-commerce API is running!" });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});