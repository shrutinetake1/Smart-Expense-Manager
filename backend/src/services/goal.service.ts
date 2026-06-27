import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

export class GoalService {
  static async getAll(userId: string) {
    return prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(id: string, userId: string) {
    const goal = await prisma.savingsGoal.findFirst({ where: { id, userId } });
    if (!goal) throw new NotFoundError('Goal not found');
    return goal;
  }

  static async create(userId: string, data: any) {
    return prisma.savingsGoal.create({
      data: { ...data, deadline: data.deadline ? new Date(data.deadline) : null, userId },
    });
  }

  static async update(id: string, userId: string, data: any) {
    const existing = await prisma.savingsGoal.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Goal not found');

    if (data.deadline) data.deadline = new Date(data.deadline);

    return prisma.savingsGoal.update({ where: { id }, data });
  }

  static async contribute(id: string, userId: string, amount: number) {
    const goal = await prisma.savingsGoal.findFirst({ where: { id, userId } });
    if (!goal) throw new NotFoundError('Goal not found');

    const newAmount = goal.currentAmount + amount;
    const isCompleted = newAmount >= goal.targetAmount;

    return prisma.savingsGoal.update({
      where: { id },
      data: { currentAmount: newAmount, isCompleted },
    });
  }

  static async delete(id: string, userId: string) {
    const existing = await prisma.savingsGoal.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Goal not found');
    await prisma.savingsGoal.delete({ where: { id } });
    return { message: 'Goal deleted successfully' };
  }
}
