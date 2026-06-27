import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ExpenseService } from '../services/expense.service';

export class ExpenseController {
  // GET /api/expenses
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        search: req.query.search as string,
        categoryId: req.query.categoryId as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        minAmount: req.query.minAmount ? parseFloat(req.query.minAmount as string) : undefined,
        maxAmount: req.query.maxAmount ? parseFloat(req.query.maxAmount as string) : undefined,
        paymentMethod: req.query.paymentMethod as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await ExpenseService.getAll(req.user!.id, query);
      res.json({ success: true, data: result.expenses, meta: result.meta });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/expenses/:id
  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const expense = await ExpenseService.getById(req.params.id, req.user!.id);
      res.json({ success: true, data: expense });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/expenses
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const expense = await ExpenseService.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data: expense });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/expenses/:id
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const expense = await ExpenseService.update(req.params.id, req.user!.id, req.body);
      res.json({ success: true, data: expense });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/expenses/:id
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ExpenseService.delete(req.params.id, req.user!.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/expenses/:id/duplicate
  static async duplicate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const expense = await ExpenseService.duplicate(req.params.id, req.user!.id);
      res.status(201).json({ success: true, data: expense });
    } catch (error) {
      next(error);
    }
  }
}
