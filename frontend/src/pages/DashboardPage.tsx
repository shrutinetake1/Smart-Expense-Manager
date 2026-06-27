import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import api from '../services/api';

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedNumber({ value, prefix = '$' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="font-mono-numbers">
      {prefix}{display.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded-xl ${className}`} />;
}

// ─── Summary Card ────────────────────────────────────────────────────────────

function SummaryCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  delay = 0,
}: {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
  color: string;
  delay?: number;
}) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-2xl p-5 transition-all duration-200"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 0 20px ${color}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, color }}
        >
          <Icon size={20} />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full`}
          style={{
            background: isPositive ? 'var(--color-success-muted)' : 'var(--color-danger-muted)',
            color: isPositive ? 'var(--color-success)' : 'var(--color-danger)',
          }}
        >
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(change)}%
        </div>
      </div>

      <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
        {title}
      </p>
      <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
        <AnimatedNumber value={value} />
      </p>
    </motion.div>
  );
}

// ─── Chart Card Wrapper ──────────────────────────────────────────────────────

function ChartCard({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-2xl p-5"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <p className="font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
      {payload.map((item: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>
            {item.name}: ${item.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard Page ─────────────────────────────────────────────────────

const CHART_COLORS = [
  'hsl(252 87% 67%)',
  'hsl(199 89% 48%)',
  'hsl(142 71% 45%)',
  'hsl(38 92% 50%)',
  'hsl(0 84% 60%)',
  'hsl(316 72% 60%)',
  'hsl(175 80% 40%)',
  'hsl(30 100% 50%)',
];

// Demo data for display
const demoSummary = {
  monthlyIncome: 8500,
  monthlyExpenses: 5230,
  savings: 12450,
  budgetRemaining: 2770,
};

const demoMonthlySpending = [
  { month: 'Jan', income: 7200, expense: 4800 },
  { month: 'Feb', income: 7500, expense: 5100 },
  { month: 'Mar', income: 8000, expense: 4900 },
  { month: 'Apr', income: 7800, expense: 5400 },
  { month: 'May', income: 8200, expense: 5000 },
  { month: 'Jun', income: 8500, expense: 5230 },
];

const demoCategoryBreakdown = [
  { name: 'Food & Dining', amount: 1200, color: '#ef4444' },
  { name: 'Transportation', amount: 850, color: '#f97316' },
  { name: 'Shopping', amount: 720, color: '#eab308' },
  { name: 'Bills & Utilities', amount: 680, color: '#22c55e' },
  { name: 'Entertainment', amount: 450, color: '#3b82f6' },
  { name: 'Other', amount: 1330, color: '#6366f1' },
];

const demoWeeklyExpenses = [
  { week: 'Week 1', amount: 1200 },
  { week: 'Week 2', amount: 1450 },
  { week: 'Week 3', amount: 980 },
  { week: 'Week 4', amount: 1600 },
];

const demoSavingsGrowth = [
  { month: 'Jan', savings: 8200 },
  { month: 'Feb', savings: 9100 },
  { month: 'Mar', savings: 10200 },
  { month: 'Apr', savings: 10600 },
  { month: 'May', savings: 11800 },
  { month: 'Jun', savings: 12450 },
];

const demoTransactions = [
  { id: '1', type: 'expense', description: 'Grocery Shopping', amount: 85.50, date: '2026-06-27', category: { name: 'Groceries', icon: '🛒', color: '#8b5cf6' } },
  { id: '2', type: 'income', description: 'Freelance Payment', amount: 1200, date: '2026-06-26', category: { name: 'Freelancing', icon: '💻', color: '#3b82f6' } },
  { id: '3', type: 'expense', description: 'Netflix Subscription', amount: 15.99, date: '2026-06-25', category: { name: 'Subscriptions', icon: '📱', color: '#6366f1' } },
  { id: '4', type: 'expense', description: 'Gas Station', amount: 45.00, date: '2026-06-25', category: { name: 'Transportation', icon: '🚗', color: '#f97316' } },
  { id: '5', type: 'income', description: 'Monthly Salary', amount: 5500, date: '2026-06-24', category: { name: 'Salary', icon: '💰', color: '#22c55e' } },
  { id: '6', type: 'expense', description: 'Restaurant Dinner', amount: 62.30, date: '2026-06-23', category: { name: 'Food & Dining', icon: '🍔', color: '#ef4444' } },
];

export default function DashboardPage() {
  const [summary, setSummary] = useState(demoSummary);
  const [loading, setLoading] = useState(false);

  // Try to fetch real data, fall back to demo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes] = await Promise.all([
          api.get('/dashboard/summary'),
        ]);
        if (summaryRes.data.data) {
          setSummary(summaryRes.data.data);
        }
      } catch {
        // Use demo data
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-80" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* ─── Summary Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Income"
          value={summary.monthlyIncome}
          change={12.5}
          icon={TrendingUp}
          color="hsl(142 71% 45%)"
          delay={0}
        />
        <SummaryCard
          title="Total Expenses"
          value={summary.monthlyExpenses}
          change={-3.2}
          icon={TrendingDown}
          color="hsl(0 84% 60%)"
          delay={0.1}
        />
        <SummaryCard
          title="Savings"
          value={summary.savings}
          change={8.7}
          icon={PiggyBank}
          color="hsl(252 87% 67%)"
          delay={0.2}
        />
        <SummaryCard
          title="Budget Remaining"
          value={summary.budgetRemaining}
          change={15.3}
          icon={Wallet}
          color="hsl(199 89% 48%)"
          delay={0.3}
        />
      </div>

      {/* ─── Charts Row 1 ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Spending - Area Chart */}
        <ChartCard title="Monthly Spending" delay={0.4}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demoMonthlySpending}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="expense" stroke="hsl(0 84% 60%)" fill="url(#colorExpense)" strokeWidth={2} name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Category Pie Chart */}
        <ChartCard title="Spending by Category" delay={0.5}>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demoCategoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="amount"
                >
                  {demoCategoryBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {demoCategoryBreakdown.map((cat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                <span className="truncate" style={{ color: 'var(--color-text-secondary)' }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Weekly Expenses - Bar Chart */}
        <ChartCard title="Weekly Expenses" delay={0.6}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demoWeeklyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="hsl(252 87% 67%)" radius={[6, 6, 0, 0]} name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ─── Charts Row 2 ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Income vs Expense */}
        <ChartCard title="Income vs Expense" delay={0.7}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demoMonthlySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Savings Growth */}
        <ChartCard title="Savings Growth" delay={0.8}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demoSavingsGrowth}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(252 87% 67%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(252 87% 67%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="savings" stroke="hsl(252 87% 67%)" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(252 87% 67%)' }} name="Savings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ─── Recent Transactions ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between p-5 pb-0">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Recent Transactions
          </h3>
          <button
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{
              color: 'var(--color-accent)',
              background: 'var(--color-accent-muted)',
            }}
          >
            View All
          </button>
        </div>

        <div className="p-5">
          <div className="space-y-1">
            {demoTransactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl transition-all"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${tx.category.color}15` }}
                >
                  {tx.category.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {tx.description}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {tx.category.name} • {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                <p
                  className="text-sm font-semibold font-mono-numbers flex-shrink-0"
                  style={{
                    color: tx.type === 'income' ? 'var(--color-success)' : 'var(--color-text-primary)',
                  }}
                >
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Quick Actions FAB ─────────────────────────────────────────── */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 400, damping: 15 }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg z-50 transition-transform hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent), hsl(252 87% 57%))',
          boxShadow: '0 4px 20px rgb(99 102 241 / 0.4)',
        }}
      >
        <Plus size={24} />
      </motion.button>
    </div>
  );
}
