import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';
import { verifyToken } from './middlewares/verifyToken.js';

// 🧩 Swagger Imports
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* 📘 Swagger setup */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'Simple API for authentication, products, and users',
    },
  },
  apis: ['./routes/*.js'], // 🔍 Path to your route files
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // ✅ Swagger UI route

// 🚀 Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', verifyToken, userRoutes);

// Basic route for root
app.get('/', (req, res) => {
  res.send('API is working 🚀');
});

// 🔌 MongoDB connection + start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
