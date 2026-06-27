import { motion } from 'framer-motion';
import { Plus, Trophy, Calendar, TrendingUp } from 'lucide-react';

const demoGoals = [
  { id: '1', name: 'Vacation Fund', icon: '✈️', color: '#3b82f6', targetAmount: 5000, currentAmount: 3200, monthlyContribution: 500, deadline: '2026-12-01' },
  { id: '2', name: 'Emergency Fund', icon: '🛡️', color: '#22c55e', targetAmount: 10000, currentAmount: 7500, monthlyContribution: 800, deadline: '2027-03-01' },
  { id: '3', name: 'New Laptop', icon: '💻', color: '#6366f1', targetAmount: 2000, currentAmount: 1650, monthlyContribution: 200, deadline: '2026-09-01' },
  { id: '4', name: 'Car Down Payment', icon: '🚗', color: '#f97316', targetAmount: 15000, currentAmount: 4200, monthlyContribution: 1000, deadline: '2027-06-01' },
  { id: '5', name: 'Home Renovation', icon: '🏠', color: '#ec4899', targetAmount: 8000, currentAmount: 2400, monthlyContribution: 600, deadline: '2027-01-01' },
  { id: '6', name: 'Wedding Fund', icon: '💍', color: '#8b5cf6', targetAmount: 20000, currentAmount: 5000, monthlyContribution: 1500, deadline: '2027-12-01' },
];

function getEstimatedCompletion(goal: typeof demoGoals[0]) {
  const remaining = goal.targetAmount - goal.currentAmount;
  if (remaining <= 0) return 'Completed!';
  if (goal.monthlyContribution <= 0) return 'Set a contribution';
  const months = Math.ceil(remaining / goal.monthlyContribution);
  if (months <= 1) return 'This month';
  if (months < 12) return `${months} months`;
  return `${Math.ceil(months / 12)} years`;
}

export default function GoalsPage() {
  const totalSaved = demoGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = demoGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Savings Goals</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Track progress toward your financial goals</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, var(--color-accent), hsl(252 87% 57%))' }}
        >
          <Plus size={16} />
          New Goal
        </motion.button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={18} style={{ color: 'var(--color-accent)' }} />
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Saved</span>
          </div>
          <p className="text-2xl font-bold font-mono-numbers" style={{ color: 'var(--color-text-primary)' }}>${totalSaved.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} style={{ color: 'var(--color-success)' }} />
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Overall Progress</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{((totalSaved / totalTarget) * 100).toFixed(1)}%</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} style={{ color: 'var(--color-info)' }} />
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Active Goals</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{demoGoals.length}</p>
        </motion.div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoGoals.map((goal, i) => {
          const percentage = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="rounded-2xl p-5 transition-all duration-200 cursor-pointer group"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = goal.color; e.currentTarget.style.boxShadow = `0 0 20px ${goal.color}15`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Icon & Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${goal.color}15` }}>
                  {goal.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{goal.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Est. {getEstimatedCompletion(goal)}
                  </p>
                </div>
              </div>

              {/* Progress Ring (simplified as bar) */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    ${goal.currentAmount.toLocaleString()}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    ${goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-hover)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.6 + i * 0.08, duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ background: `linear-gradient(90deg, ${goal.color}, ${goal.color}cc)` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" style={{ animationDuration: '2s' }} />
                  </motion.div>
                </div>
                <p className="text-right text-xs font-medium mt-1" style={{ color: goal.color }}>
                  {percentage.toFixed(0)}%
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                <div>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Remaining</p>
                  <p className="text-sm font-semibold font-mono-numbers" style={{ color: 'var(--color-text-primary)' }}>
                    ${remaining.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Monthly</p>
                  <p className="text-sm font-semibold font-mono-numbers" style={{ color: 'var(--color-success)' }}>
                    ${goal.monthlyContribution.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
