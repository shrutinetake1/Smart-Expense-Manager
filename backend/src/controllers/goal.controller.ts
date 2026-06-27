import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { GoalService } from '../services/goal.service';

export class GoalController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const goals = await GoalService.getAll(req.user!.id);
      res.json({ success: true, data: goals });
    } catch (error) { next(error); }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const goal = await GoalService.getById(req.params.id, req.user!.id);
      res.json({ success: true, data: goal });
    } catch (error) { next(error); }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const goal = await GoalService.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data: goal });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const goal = await GoalService.update(req.params.id, req.user!.id, req.body);
      res.json({ success: true, data: goal });
    } catch (error) { next(error); }
  }

  static async contribute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const goal = await GoalService.contribute(req.params.id, req.user!.id, req.body.amount);
      res.json({ success: true, data: goal });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await GoalService.delete(req.params.id, req.user!.id);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}
