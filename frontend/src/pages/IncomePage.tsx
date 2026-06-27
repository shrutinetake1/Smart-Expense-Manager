import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  TrendingUp,
  Briefcase,
  Laptop,
  Building2,
  Home,
  Coins,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const sourceIcons: Record<string, React.ElementType> = {
  SALARY: Briefcase,
  FREELANCING: Laptop,
  INVESTMENTS: TrendingUp,
  BUSINESS: Building2,
  RENTAL: Home,
  OTHER: Coins,
};

const sourceColors: Record<string, string> = {
  SALARY: '#22c55e',
  FREELANCING: '#3b82f6',
  INVESTMENTS: '#6366f1',
  BUSINESS: '#f97316',
  RENTAL: '#14b8a6',
  OTHER: '#6b7280',
};

const demoIncome = [
  { id: '1', description: 'Monthly Salary', amount: 5500, date: '2026-06-24', source: 'SALARY', category: { name: 'Salary', icon: '💰', color: '#22c55e' } },
  { id: '2', description: 'Web Development Project', amount: 1200, date: '2026-06-20', source: 'FREELANCING', category: { name: 'Freelancing', icon: '💻', color: '#3b82f6' } },
  { id: '3', description: 'Stock Dividends', amount: 350, date: '2026-06-15', source: 'INVESTMENTS', category: { name: 'Investments', icon: '📈', color: '#6366f1' } },
  { id: '4', description: 'Rental Payment', amount: 1200, date: '2026-06-10', source: 'RENTAL', category: { name: 'Rental', icon: '🏠', color: '#14b8a6' } },
  { id: '5', description: 'Logo Design', amount: 250, date: '2026-06-05', source: 'FREELANCING', category: { name: 'Freelancing', icon: '💻', color: '#3b82f6' } },
];

const trendData = [
  { month: 'Jan', income: 6200 },
  { month: 'Feb', income: 6800 },
  { month: 'Mar', income: 7100 },
  { month: 'Apr', income: 6900 },
  { month: 'May', income: 7500 },
  { month: 'Jun', income: 8500 },
];

const sourceBreakdown = [
  { source: 'SALARY', amount: 5500, percentage: 64.7 },
  { source: 'FREELANCING', amount: 1450, percentage: 17.1 },
  { source: 'RENTAL', amount: 1200, percentage: 14.1 },
  { source: 'INVESTMENTS', amount: 350, percentage: 4.1 },
];

export default function IncomePage() {
  const totalIncome = demoIncome.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Income</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Track your revenue streams</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, var(--color-accent), hsl(252 87% 57%))' }}
        >
          <Plus size={16} />
          Add Income
        </motion.button>
      </div>

      {/* Source Breakdown Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sourceBreakdown.map((source, i) => {
          const Icon = sourceIcons[source.source] || Coins;
          const color = sourceColors[source.source];
          return (
            <motion.div
              key={source.source}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, color }}>
                  <Icon size={16} />
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {source.source.replace('_', ' ')}
                </span>
              </div>
              <p className="text-lg font-bold font-mono-numbers" style={{ color: 'var(--color-text-primary)' }}>
                ${source.amount.toLocaleString()}
              </p>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-hover)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${source.percentage}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {source.percentage}% of total
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Income Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl p-5"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Income Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="income" stroke="hsl(142 71% 45%)" fill="url(#incomeGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Income List */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="p-5 pb-0">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Income History</h3>
        </div>
        <div className="p-5 space-y-1">
          {demoIncome.map((income, i) => (
            <motion.div
              key={income.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-xl transition-all"
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base" style={{ background: `${income.category.color}15` }}>
                {income.category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{income.description}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {income.source.replace('_', ' ')} • {new Date(income.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <p className="text-sm font-semibold font-mono-numbers" style={{ color: 'var(--color-success)' }}>
                +${income.amount.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
