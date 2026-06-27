import { motion } from 'framer-motion';
import { Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';

const demoBudgets = [
  { id: '1', category: { name: 'Food & Dining', icon: '🍔', color: '#ef4444' }, amount: 800, spent: 620, month: 6, year: 2026 },
  { id: '2', category: { name: 'Transportation', icon: '🚗', color: '#f97316' }, amount: 400, spent: 380, month: 6, year: 2026 },
  { id: '3', category: { name: 'Shopping', icon: '🛍️', color: '#eab308' }, amount: 500, spent: 720, month: 6, year: 2026 },
  { id: '4', category: { name: 'Entertainment', icon: '🎬', color: '#84cc16' }, amount: 300, spent: 150, month: 6, year: 2026 },
  { id: '5', category: { name: 'Bills & Utilities', icon: '💡', color: '#22c55e' }, amount: 600, spent: 520, month: 6, year: 2026 },
  { id: '6', category: { name: 'Subscriptions', icon: '📱', color: '#6366f1' }, amount: 100, spent: 65, month: 6, year: 2026 },
  { id: '7', category: { name: 'Health', icon: '🏥', color: '#14b8a6' }, amount: 200, spent: 50, month: 6, year: 2026 },
  { id: '8', category: { name: 'Groceries', icon: '🛒', color: '#8b5cf6' }, amount: 600, spent: 450, month: 6, year: 2026 },
];

function getStatusColor(percentage: number) {
  if (percentage >= 100) return 'var(--color-danger)';
  if (percentage >= 80) return 'var(--color-warning)';
  return 'var(--color-success)';
}

export default function BudgetsPage() {
  const totalBudget = demoBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = demoBudgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCount = demoBudgets.filter((b) => b.spent > b.amount).length;

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Budgets</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>June 2026 budget overview</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, var(--color-accent), hsl(252 87% 57%))' }}
        >
          <Plus size={16} />
          Create Budget
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Budget</p>
          <p className="text-2xl font-bold font-mono-numbers mt-1" style={{ color: 'var(--color-text-primary)' }}>
            ${totalBudget.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-5"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Spent</p>
          <p className="text-2xl font-bold font-mono-numbers mt-1" style={{ color: 'var(--color-text-primary)' }}>
            ${totalSpent.toLocaleString()}
          </p>
          <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-hover)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-full rounded-full"
              style={{ background: getStatusColor((totalSpent / totalBudget) * 100) }}
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-5"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Over Budget</p>
          <p className="text-2xl font-bold mt-1" style={{ color: overBudgetCount > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
            {overBudgetCount} {overBudgetCount === 1 ? 'category' : 'categories'}
          </p>
        </motion.div>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {demoBudgets.map((budget, i) => {
          const percentage = (budget.spent / budget.amount) * 100;
          const remaining = budget.amount - budget.spent;
          const isOver = remaining < 0;
          const statusColor = getStatusColor(percentage);

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="rounded-2xl p-5 transition-all duration-200 cursor-pointer"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = statusColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{budget.category.icon}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {budget.category.name}
                  </span>
                </div>
                {isOver ? (
                  <AlertTriangle size={16} style={{ color: 'var(--color-danger)' }} />
                ) : percentage < 50 ? (
                  <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
                ) : null}
              </div>

              {/* Progress Bar */}
              <div className="h-2.5 rounded-full overflow-hidden mb-3" style={{ background: 'var(--color-surface-hover)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ background: statusColor }}
                />
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Spent
                  </p>
                  <p className="text-sm font-semibold font-mono-numbers" style={{ color: 'var(--color-text-primary)' }}>
                    ${budget.spent.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {isOver ? 'Over by' : 'Remaining'}
                  </p>
                  <p className="text-sm font-semibold font-mono-numbers" style={{ color: isOver ? 'var(--color-danger)' : 'var(--color-success)' }}>
                    ${Math.abs(remaining).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-xs mt-2 text-right font-medium" style={{ color: statusColor }}>
                {percentage.toFixed(0)}% used
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
