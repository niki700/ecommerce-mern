# 🛒 ShopNow — Full Stack E-Commerce Platform

A complete E-Commerce web application built with the MERN stack.

## 🌐 Live Demo
- Frontend: Coming Soon
- Backend API: Coming Soon

## ✨ Features

### Customer
- Register and Login with JWT
- Browse products with search and filter
- Add to cart and place orders
- View order history

### Admin
- Dashboard with stats
- Add products with image upload
- Edit and delete products
- Update order status

## 🛠️ Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Cloudinary

**Frontend:** React.js, Vite, Tailwind CSS, Axios, React Router

## 🚀 Setup Instructions

### Backend
cd backend
npm install

Create .env file:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Run:
npm run dev

### Frontend
cd frontend
npm install
npm run dev

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Create product Admin |
| PUT | /api/products/:id | Update product Admin |
| DELETE | /api/products/:id | Delete product Admin |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get cart |
| POST | /api/cart | Add to cart |
| DELETE | /api/cart | Clear cart |
| DELETE | /api/cart/:productId | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Place order |
| GET | /api/orders/myorders | Get my orders |
| GET | /api/orders/:id | Get order by ID |
| PUT | /api/orders/:id/status | Update status Admin |

## 🔒 Security
- JWT Authentication
- Password hashing with bcryptjs
- Rate limiting
- Helmet.js security headers
- Role based access control

## 👤 Admin Setup
1. Register a new account
2. Go to MongoDB Atlas
3. Find your user in users collection
4. Change role from user to admin
5. Logout and login again

## 👩‍💻 Built By
Nikita — MERN Stack 
