import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { BudgetService } from '../services/budget.service';

export class BudgetController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = {
        month: req.query.month ? parseInt(req.query.month as string) : undefined,
        year: req.query.year ? parseInt(req.query.year as string) : undefined,
      };
      const result = await BudgetService.getAll(req.user!.id, query);
      res.json({ success: true, data: result.budgets, summary: result.summary });
    } catch (error) { next(error); }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const budget = await BudgetService.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data: budget });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const budget = await BudgetService.update(req.params.id, req.user!.id, req.body);
      res.json({ success: true, data: budget });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await BudgetService.delete(req.params.id, req.user!.id);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}
