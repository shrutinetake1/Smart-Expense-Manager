import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import logger from './utils/logger';

// Route imports
import authRoutes from './routes/auth.routes';
import expenseRoutes from './routes/expense.routes';
import incomeRoutes from './routes/income.routes';
import budgetRoutes from './routes/budget.routes';
import goalRoutes from './routes/goal.routes';
import dashboardRoutes from './routes/dashboard.routes';
import categoryRoutes from './routes/category.routes';
import notificationRoutes from './routes/notification.routes';

const app = express();

// ─── Security Middleware ─────────────────────────────────────────────────────

app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many authentication attempts' },
});
app.use('/api/auth/', authLimiter);

// ─── Body Parsing ────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Request Logging ─────────────────────────────────────────────────────────

app.use((req, _res, next) => {
  logger.debug(`${req.method} ${req.url}`);
  next();
});

// ─── Health Check ────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── Error Handling ──────────────────────────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
