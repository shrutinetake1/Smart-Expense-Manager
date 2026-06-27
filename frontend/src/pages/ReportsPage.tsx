import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileDown, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';

const monthlyData = [
  { category: 'Food & Dining', amount: 1200, color: '#ef4444' },
  { category: 'Transportation', amount: 850, color: '#f97316' },
  { category: 'Shopping', amount: 720, color: '#eab308' },
  { category: 'Bills', amount: 680, color: '#22c55e' },
  { category: 'Entertainment', amount: 450, color: '#3b82f6' },
  { category: 'Health', amount: 200, color: '#14b8a6' },
  { category: 'Other', amount: 1130, color: '#6366f1' },
];

const quarterlyData = [
  { month: 'Apr', income: 7800, expense: 5400, savings: 2400 },
  { month: 'May', income: 8200, expense: 5000, savings: 3200 },
  { month: 'Jun', income: 8500, expense: 5230, savings: 3270 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const totalExpense = monthlyData.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Reports</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Detailed financial reports and exports</p>
        </div>
        <div className="flex gap-2">
          {(['monthly', 'quarterly', 'yearly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                background: period === p ? 'var(--color-accent-muted)' : 'transparent',
                color: period === p ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                border: `1px solid ${period === p ? 'var(--color-accent)' : 'var(--color-border)'}`,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-2">
        {['PDF', 'Excel', 'CSV'].map((format) => (
          <button
            key={format}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            <FileDown size={14} />
            {format}
          </button>
        ))}
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} style={{ color: 'var(--color-success)' }} />
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Income</span>
          </div>
          <p className="text-2xl font-bold font-mono-numbers" style={{ color: 'var(--color-success)' }}>$8,500.00</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={18} style={{ color: 'var(--color-danger)' }} />
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Expenses</span>
          </div>
          <p className="text-2xl font-bold font-mono-numbers" style={{ color: 'var(--color-danger)' }}>${totalExpense.toLocaleString()}.00</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} style={{ color: 'var(--color-accent)' }} />
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Net Savings</span>
          </div>
          <p className="text-2xl font-bold font-mono-numbers" style={{ color: 'var(--color-accent)' }}>${(8500 - totalExpense).toLocaleString()}.00</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Category Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={monthlyData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="amount" nameKey="category">
                  {monthlyData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {monthlyData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                  <span style={{ color: 'var(--color-text-secondary)' }}>{cat.category}</span>
                </div>
                <span className="font-mono-numbers font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  ${cat.amount}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quarterly Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Quarterly Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} name="Expense" />
                <Bar dataKey="savings" fill="hsl(252 87% 67%)" radius={[4, 4, 0, 0]} name="Savings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
