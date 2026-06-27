import prisma from '../config/database';

export class DashboardService {
  // Get aggregated summary statistics
  static async getSummary(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [
      totalExpensesThisMonth,
      totalIncomeThisMonth,
      totalExpensesAll,
      totalIncomeAll,
      budgetData,
      savingsGoals,
    ] = await Promise.all([
      prisma.expense.aggregate({
        where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true },
      }),
      prisma.income.aggregate({
        where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      prisma.income.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      prisma.budget.findMany({
        where: { userId, month: now.getMonth() + 1, year: now.getFullYear() },
      }),
      prisma.savingsGoal.aggregate({
        where: { userId },
        _sum: { currentAmount: true },
      }),
    ]);

    const totalBudget = budgetData.reduce((sum, b) => sum + b.amount, 0);
    const totalBudgetSpent = budgetData.reduce((sum, b) => sum + b.spent, 0);

    return {
      monthlyIncome: totalIncomeThisMonth._sum.amount || 0,
      monthlyExpenses: totalExpensesThisMonth._sum.amount || 0,
      totalIncome: totalIncomeAll._sum.amount || 0,
      totalExpenses: totalExpensesAll._sum.amount || 0,
      savings: (totalIncomeAll._sum.amount || 0) - (totalExpensesAll._sum.amount || 0),
      monthlySavings: (totalIncomeThisMonth._sum.amount || 0) - (totalExpensesThisMonth._sum.amount || 0),
      budgetTotal: totalBudget,
      budgetSpent: totalBudgetSpent,
      budgetRemaining: totalBudget - totalBudgetSpent,
      savingsGoalTotal: savingsGoals._sum.currentAmount || 0,
    };
  }

  // Get chart data
  static async getChartData(userId: string, range: string = '6months') {
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case '1month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default: // 6months
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    }

    // Monthly spending data
    const expenses = await prisma.expense.findMany({
      where: { userId, date: { gte: startDate } },
      select: { amount: true, date: true, categoryId: true },
      orderBy: { date: 'asc' },
    });

    const incomes = await prisma.income.findMany({
      where: { userId, date: { gte: startDate } },
      select: { amount: true, date: true },
      orderBy: { date: 'asc' },
    });

    // Group by month
    const monthlyData: Record<string, { income: number; expense: number }> = {};
    const months = this.getMonthRange(startDate, now);

    months.forEach((m) => {
      monthlyData[m] = { income: 0, expense: 0 };
    });

    expenses.forEach((e) => {
      const key = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[key]) monthlyData[key].expense += e.amount;
    });

    incomes.forEach((i) => {
      const key = `${i.date.getFullYear()}-${String(i.date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[key]) monthlyData[key].income += i.amount;
    });

    // Category breakdown for current month
    const categoryExpenses = await prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
          lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
        },
      },
      _sum: { amount: true },
    });

    const categories = await prisma.category.findMany({
      where: { id: { in: categoryExpenses.map((c) => c.categoryId) } },
      select: { id: true, name: true, icon: true, color: true },
    });

    const categoryBreakdown = categoryExpenses.map((ce) => {
      const cat = categories.find((c) => c.id === ce.categoryId);
      return {
        categoryId: ce.categoryId,
        name: cat?.name || 'Unknown',
        icon: cat?.icon || '📦',
        color: cat?.color || '#6b7280',
        amount: ce._sum.amount || 0,
      };
    }).sort((a, b) => b.amount - a.amount);

    // Weekly expenses for current month
    const weeklyExpenses = this.getWeeklyData(expenses.filter((e) => {
      return e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear();
    }));

    // Savings growth (cumulative)
    let cumulativeSavings = 0;
    const savingsGrowth = Object.entries(monthlyData).map(([month, data]) => {
      cumulativeSavings += data.income - data.expense;
      return { month, savings: cumulativeSavings };
    });

    return {
      monthlySpending: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data,
      })),
      categoryBreakdown,
      weeklyExpenses,
      incomeVsExpense: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        ...data,
      })),
      savingsGrowth,
      cashFlow: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        cashFlow: data.income - data.expense,
      })),
    };
  }

  // Get recent transactions
  static async getRecentTransactions(userId: string, limit = 10) {
    const [expenses, incomes] = await Promise.all([
      prisma.expense.findMany({
        where: { userId },
        include: { category: { select: { name: true, icon: true, color: true } } },
        orderBy: { date: 'desc' },
        take: limit,
      }),
      prisma.income.findMany({
        where: { userId },
        include: { category: { select: { name: true, icon: true, color: true } } },
        orderBy: { date: 'desc' },
        take: limit,
      }),
    ]);

    const transactions = [
      ...expenses.map((e) => ({
        id: e.id,
        type: 'expense' as const,
        amount: e.amount,
        description: e.description,
        date: e.date,
        category: e.category,
        merchant: e.merchant,
      })),
      ...incomes.map((i) => ({
        id: i.id,
        type: 'income' as const,
        amount: i.amount,
        description: i.description,
        date: i.date,
        category: i.category,
        merchant: null,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);

    return transactions;
  }

  // Helper: generate month range strings
  private static getMonthRange(start: Date, end: Date): string[] {
    const months: string[] = [];
    const current = new Date(start);
    while (current <= end) {
      months.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  }

  // Helper: group expenses by week
  private static getWeeklyData(expenses: { amount: number; date: Date }[]) {
    const weeks: Record<string, number> = {
      'Week 1': 0,
      'Week 2': 0,
      'Week 3': 0,
      'Week 4': 0,
      'Week 5': 0,
    };

    expenses.forEach((e) => {
      const day = e.date.getDate();
      if (day <= 7) weeks['Week 1'] += e.amount;
      else if (day <= 14) weeks['Week 2'] += e.amount;
      else if (day <= 21) weeks['Week 3'] += e.amount;
      else if (day <= 28) weeks['Week 4'] += e.amount;
      else weeks['Week 5'] += e.amount;
    });

    return Object.entries(weeks).map(([week, amount]) => ({ week, amount }));
  }
}
