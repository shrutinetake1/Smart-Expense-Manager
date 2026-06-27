import prisma from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';

export class BudgetService {
  static async getAll(userId: string, query: { month?: number; year?: number }) {
    const where: any = { userId };
    if (query.month) where.month = query.month;
    if (query.year) where.year = query.year;

    const budgets = await prisma.budget.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
      orderBy: { category: { name: 'asc' } },
    });

    // Calculate totals
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

    return { budgets, summary: { totalBudget, totalSpent, remaining: totalBudget - totalSpent } };
  }

  static async create(userId: string, data: { amount: number; categoryId: string; month: number; year: number }) {
    // Check for duplicate
    const existing = await prisma.budget.findFirst({
      where: { userId, categoryId: data.categoryId, month: data.month, year: data.year },
    });
    if (existing) throw new ConflictError('Budget already exists for this category and period');

    // Calculate current spent
    const spent = await prisma.expense.aggregate({
      where: {
        userId,
        categoryId: data.categoryId,
        date: {
          gte: new Date(data.year, data.month - 1, 1),
          lt: new Date(data.year, data.month, 1),
        },
      },
      _sum: { amount: true },
    });

    return prisma.budget.create({
      data: { ...data, spent: spent._sum.amount || 0, userId },
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
    });
  }

  static async update(id: string, userId: string, data: { amount?: number }) {
    const existing = await prisma.budget.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Budget not found');

    return prisma.budget.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
    });
  }

  static async delete(id: string, userId: string) {
    const existing = await prisma.budget.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Budget not found');
    await prisma.budget.delete({ where: { id } });
    return { message: 'Budget deleted successfully' };
  }
}
