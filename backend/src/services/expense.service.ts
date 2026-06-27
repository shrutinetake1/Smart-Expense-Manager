import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';
import { Prisma } from '@prisma/client';

interface ExpenseQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ExpenseService {
  // Get all expenses with filtering, sorting, pagination
  static async getAll(userId: string, query: ExpenseQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ExpenseWhereInput = { userId };

    // Search
    if (query.search) {
      where.OR = [
        { description: { contains: query.search, mode: 'insensitive' } },
        { merchant: { contains: query.search, mode: 'insensitive' } },
        { notes: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    // Date range
    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) where.date.gte = new Date(query.startDate);
      if (query.endDate) where.date.lte = new Date(query.endDate);
    }

    // Amount range
    if (query.minAmount || query.maxAmount) {
      where.amount = {};
      if (query.minAmount) where.amount.gte = query.minAmount;
      if (query.maxAmount) where.amount.lte = query.maxAmount;
    }

    // Payment method
    if (query.paymentMethod) {
      where.paymentMethod = query.paymentMethod as any;
    }

    // Sort
    const orderBy: Prisma.ExpenseOrderByWithRelationInput = {};
    const sortBy = query.sortBy || 'date';
    const sortOrder = query.sortOrder || 'desc';
    (orderBy as any)[sortBy] = sortOrder;

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, icon: true, color: true } },
          receipt: { select: { id: true, imageUrl: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return {
      expenses,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single expense
  static async getById(id: string, userId: string) {
    const expense = await prisma.expense.findFirst({
      where: { id, userId },
      include: {
        category: true,
        receipt: true,
      },
    });

    if (!expense) {
      throw new NotFoundError('Expense not found');
    }

    return expense;
  }

  // Create expense
  static async create(userId: string, data: any) {
    const expense = await prisma.expense.create({
      data: {
        ...data,
        date: new Date(data.date),
        userId,
      },
      include: {
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
    });

    // Update budget spent amount
    await this.updateBudgetSpent(userId, data.categoryId, new Date(data.date));

    return expense;
  }

  // Update expense
  static async update(id: string, userId: string, data: any) {
    const existing = await prisma.expense.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Expense not found');

    const updateData = { ...data };
    if (data.date) updateData.date = new Date(data.date);

    const expense = await prisma.expense.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
    });

    // Recalculate budget if amount or category changed
    if (data.amount || data.categoryId) {
      await this.updateBudgetSpent(userId, expense.categoryId, expense.date);
      if (existing.categoryId !== expense.categoryId) {
        await this.updateBudgetSpent(userId, existing.categoryId, existing.date);
      }
    }

    return expense;
  }

  // Delete expense
  static async delete(id: string, userId: string) {
    const expense = await prisma.expense.findFirst({ where: { id, userId } });
    if (!expense) throw new NotFoundError('Expense not found');

    await prisma.expense.delete({ where: { id } });

    // Update budget
    await this.updateBudgetSpent(userId, expense.categoryId, expense.date);

    return { message: 'Expense deleted successfully' };
  }

  // Duplicate expense
  static async duplicate(id: string, userId: string) {
    const existing = await prisma.expense.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new NotFoundError('Expense not found');

    const { id: _, createdAt, updatedAt, ...data } = existing;

    const duplicate = await prisma.expense.create({
      data: {
        ...data,
        date: new Date(),
        description: `${data.description} (copy)`,
      },
      include: {
        category: { select: { id: true, name: true, icon: true, color: true } },
      },
    });

    return duplicate;
  }

  // Update budget spent amount based on expenses
  private static async updateBudgetSpent(userId: string, categoryId: string, date: Date) {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const totalSpent = await prisma.expense.aggregate({
      where: {
        userId,
        categoryId,
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      _sum: { amount: true },
    });

    await prisma.budget.updateMany({
      where: { userId, categoryId, month, year },
      data: { spent: totalSpent._sum.amount || 0 },
    });
  }
}
