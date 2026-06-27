import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  static async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const summary = await DashboardService.getSummary(req.user!.id);
      res.json({ success: true, data: summary });
    } catch (error) { next(error); }
  }

  static async getCharts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const range = req.query.range as string || '6months';
      const charts = await DashboardService.getChartData(req.user!.id, range);
      res.json({ success: true, data: charts });
    } catch (error) { next(error); }
  }

  static async getRecentTransactions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const transactions = await DashboardService.getRecentTransactions(req.user!.id, limit);
      res.json({ success: true, data: transactions });
    } catch (error) { next(error); }
  }
}
