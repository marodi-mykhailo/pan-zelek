import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';
import boxTemplatesRouter from './routes/boxTemplates.js';
import adminRouter from './routes/admin.js';
import usersRouter from './routes/users.js';
import { optionalAuth } from './middleware/auth.js';

// Load .env from backend directory
const backendDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(backendDir, '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || [
    'http://localhost:5173',
    'https://marodi-mykhailo.github.io',
    'https://marodi-mykhailo.github.io/pan-zelek',
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/cart', optionalAuth, cartRouter);
app.use('/api/orders', optionalAuth, ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/box-templates', boxTemplatesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/users', usersRouter);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
