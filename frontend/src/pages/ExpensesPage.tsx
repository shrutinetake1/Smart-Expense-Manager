import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit3,
  Copy,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Receipt,
  X,
  Calendar,
  DollarSign,
  Tag,
  MapPin,
  FileText,
} from 'lucide-react';

// Demo data
const demoExpenses = [
  { id: '1', description: 'Grocery Shopping at Whole Foods', amount: 125.50, date: '2026-06-27', category: { name: 'Groceries', icon: '🛒', color: '#8b5cf6' }, paymentMethod: 'CREDIT_CARD', merchant: 'Whole Foods', tags: ['food', 'weekly'] },
  { id: '2', description: 'Monthly Netflix Subscription', amount: 15.99, date: '2026-06-25', category: { name: 'Subscriptions', icon: '📱', color: '#6366f1' }, paymentMethod: 'CREDIT_CARD', merchant: 'Netflix', tags: ['entertainment'] },
  { id: '3', description: 'Gas Station Fill Up', amount: 52.30, date: '2026-06-24', category: { name: 'Transportation', icon: '🚗', color: '#f97316' }, paymentMethod: 'DEBIT_CARD', merchant: 'Shell', tags: ['auto'] },
  { id: '4', description: 'Restaurant Dinner', amount: 87.40, date: '2026-06-23', category: { name: 'Food & Dining', icon: '🍔', color: '#ef4444' }, paymentMethod: 'CASH', merchant: 'Olive Garden', tags: ['dining'] },
  { id: '5', description: 'Electric Bill Payment', amount: 145.00, date: '2026-06-22', category: { name: 'Bills & Utilities', icon: '💡', color: '#22c55e' }, paymentMethod: 'BANK_TRANSFER', merchant: 'City Power', tags: ['bills', 'monthly'] },
  { id: '6', description: 'Online Shopping - Amazon', amount: 89.99, date: '2026-06-21', category: { name: 'Shopping', icon: '🛍️', color: '#eab308' }, paymentMethod: 'CREDIT_CARD', merchant: 'Amazon', tags: ['online'] },
  { id: '7', description: 'Gym Membership', amount: 49.99, date: '2026-06-20', category: { name: 'Health', icon: '🏥', color: '#14b8a6' }, paymentMethod: 'CREDIT_CARD', merchant: 'Planet Fitness', tags: ['health', 'monthly'] },
  { id: '8', description: 'Coffee - Starbucks', amount: 6.75, date: '2026-06-20', category: { name: 'Food & Dining', icon: '🍔', color: '#ef4444' }, paymentMethod: 'UPI', merchant: 'Starbucks', tags: ['coffee'] },
];

const paymentMethodLabels: Record<string, string> = {
  CASH: 'Cash',
  CREDIT_CARD: 'Credit Card',
  DEBIT_CARD: 'Debit Card',
  BANK_TRANSFER: 'Bank Transfer',
  UPI: 'UPI',
  WALLET: 'Wallet',
  OTHER: 'Other',
};

export default function ExpensesPage() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredExpenses = demoExpenses.filter((e) => {
    const matchSearch = !search || 
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.merchant?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || e.category.name === selectedCategory;
    return matchSearch && matchCategory;
  });

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Expenses
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Track and manage your spending
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent), hsl(252 87% 57%))',
            }}
          >
            <Plus size={16} />
            Add Expense
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Summary Bar */}
      <div
        className="flex items-center justify-between p-4 rounded-xl"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {filteredExpenses.length} expenses found
        </span>
        <span className="text-sm font-semibold font-mono-numbers" style={{ color: 'var(--color-text-primary)' }}>
          Total: ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Expense Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Table Header */}
        <div
          className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-medium uppercase tracking-wider"
          style={{
            color: 'var(--color-text-muted)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="col-span-4">Description</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Payment</div>
          <div className="col-span-1 text-right">Amount</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {filteredExpenses.map((expense, i) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 items-center transition-all cursor-pointer"
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Description */}
              <div className="col-span-4 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${expense.category.color}15` }}
                >
                  {expense.category.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {expense.description}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                    {expense.merchant}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="col-span-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: `${expense.category.color}15`,
                    color: expense.category.color,
                  }}
                >
                  {expense.category.icon} {expense.category.name}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>

              {/* Payment Method */}
              <div className="col-span-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {paymentMethodLabels[expense.paymentMethod]}
              </div>

              {/* Amount */}
              <div className="col-span-1 text-right">
                <span className="text-sm font-semibold font-mono-numbers" style={{ color: 'var(--color-danger)' }}>
                  -${expense.amount.toFixed(2)}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end gap-1">
                <button
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-active)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <Edit3 size={14} />
                </button>
                <button
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-danger-muted)'; e.currentTarget.style.color = 'var(--color-danger)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Showing 1-{filteredExpenses.length} of {filteredExpenses.length}
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg" style={{ color: 'var(--color-text-muted)' }}>
              <ChevronLeft size={16} />
            </button>
            <button
              className="px-3 py-1 rounded-lg text-xs font-medium"
              style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}
            >
              1
            </button>
            <button className="p-1.5 rounded-lg" style={{ color: 'var(--color-text-muted)' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Add Expense Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 max-h-[90vh] overflow-y-auto rounded-2xl p-6"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Add Expense
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form className="space-y-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Amount
                  </label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none font-mono-numbers"
                      style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Description
                  </label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      placeholder="What did you spend on?"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                </div>

                {/* Date & Category row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                      Date
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                      <input
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                      Category
                    </label>
                    <select
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                    >
                      <option>🍔 Food & Dining</option>
                      <option>🚗 Transportation</option>
                      <option>🛍️ Shopping</option>
                      <option>💡 Bills & Utilities</option>
                      <option>🎬 Entertainment</option>
                      <option>🛒 Groceries</option>
                      <option>📱 Subscriptions</option>
                      <option>🏥 Health</option>
                      <option>📦 Other</option>
                    </select>
                  </div>
                </div>

                {/* Merchant & Payment */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                      Merchant
                    </label>
                    <input
                      type="text"
                      placeholder="Store name"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                      Payment Method
                    </label>
                    <select
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                    >
                      <option>Cash</option>
                      <option>Credit Card</option>
                      <option>Debit Card</option>
                      <option>Bank Transfer</option>
                      <option>UPI</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add notes..."
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                    style={{ background: 'linear-gradient(135deg, var(--color-accent), hsl(252 87% 57%))' }}
                  >
                    Add Expense
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
