import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';
import { Prisma } from '@prisma/client';

export class IncomeService {
  static async getAll(userId: string, query: any) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.IncomeWhereInput = { userId };

    if (query.search) {
      where.OR = [
        { description: { contains: query.search, mode: 'insensitive' } },
        { notes: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.source) where.source = query.source;
    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) where.date.gte = new Date(query.startDate);
      if (query.endDate) where.date.lte = new Date(query.endDate);
    }

    const orderBy: any = {};
    orderBy[query.sortBy || 'date'] = query.sortOrder || 'desc';

    const [incomes, total] = await Promise.all([
      prisma.income.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, icon: true, color: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.income.count({ where }),
    ]);

    return {
      incomes,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getById(id: string, userId: string) {
    const income = await prisma.income.findFirst({ where: { id, userId }, include: { category: true } });
    if (!income) throw new NotFoundError('Income not found');
    return income;
  }

  static async create(userId: string, data: any) {
    return prisma.income.create({
      data: { ...data, date: new Date(data.date), userId },
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
    });
  }

  static async update(id: string, userId: string, data: any) {
    const existing = await prisma.income.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Income not found');

    const updateData = { ...data };
    if (data.date) updateData.date = new Date(data.date);

    return prisma.income.update({
      where: { id },
      data: updateData,
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
    });
  }

  static async delete(id: string, userId: string) {
    const existing = await prisma.income.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Income not found');
    await prisma.income.delete({ where: { id } });
    return { message: 'Income deleted successfully' };
  }
}
