import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/summary', DashboardController.getSummary);
router.get('/charts', DashboardController.getCharts);
router.get('/recent-transactions', DashboardController.getRecentTransactions);

export default router;
