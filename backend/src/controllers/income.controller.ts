import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { IncomeService } from '../services/income.service';

export class IncomeController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        search: req.query.search as string,
        source: req.query.source as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };
      const result = await IncomeService.getAll(req.user!.id, query);
      res.json({ success: true, data: result.incomes, meta: result.meta });
    } catch (error) { next(error); }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const income = await IncomeService.getById(req.params.id, req.user!.id);
      res.json({ success: true, data: income });
    } catch (error) { next(error); }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const income = await IncomeService.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data: income });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const income = await IncomeService.update(req.params.id, req.user!.id, req.body);
      res.json({ success: true, data: income });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await IncomeService.delete(req.params.id, req.user!.id);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}
