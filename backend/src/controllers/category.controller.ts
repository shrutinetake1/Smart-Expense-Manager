import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

export class CategoryController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as string;
      const where: any = {
        OR: [
          { userId: req.user!.id },
          { isDefault: true, userId: null },
        ],
      };
      if (type) where.type = type;

      const categories = await prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
      });
      res.json({ success: true, data: categories });
    } catch (error) { next(error); }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const category = await prisma.category.create({
        data: { ...req.body, userId: req.user!.id },
      });
      res.status(201).json({ success: true, data: category });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await prisma.category.findFirst({
        where: { id: req.params.id, userId: req.user!.id },
      });
      if (!existing) throw new NotFoundError('Category not found');

      const category = await prisma.category.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: category });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await prisma.category.findFirst({
        where: { id: req.params.id, userId: req.user!.id },
      });
      if (!existing) throw new NotFoundError('Category not found');

      await prisma.category.delete({ where: { id: req.params.id } });
      res.json({ success: true, data: { message: 'Category deleted' } });
    } catch (error) { next(error); }
  }
}
