import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/income', label: 'Income', icon: Wallet },
  { path: '/budgets', label: 'Budgets', icon: PiggyBank },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const currentPage = navItems.find((item) => item.path === location.pathname);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-background)' }}>
      {/* ─── Desktop Sidebar ────────────────────────────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
        style={{
          background: 'var(--color-sidebar)',
          borderRight: '1px solid var(--color-border)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 gap-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), hsl(199 89% 48%))' }}
          >
            E
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold whitespace-nowrap"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Expense<span className="gradient-text">IQ</span>
            </motion.span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
                style={{
                  background: isActive ? 'var(--color-sidebar-active)' : 'transparent',
                  color: isActive ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--color-sidebar-hover)';
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--color-sidebar-text)';
                  }
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: 'var(--color-accent)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={20} className="flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}

                {/* Tooltip for collapsed sidebar */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
                    style={{
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={toggleSidebarCollapsed}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm w-full transition-all duration-200"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-sidebar-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ─── Mobile Sidebar Overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] z-50 flex flex-col lg:hidden"
              style={{
                background: 'var(--color-sidebar)',
                borderRight: '1px solid var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between h-16 px-4"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, var(--color-accent), hsl(199 89% 48%))' }}
                  >
                    E
                  </div>
                  <span className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    Expense<span className="gradient-text">IQ</span>
                  </span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text-secondary)' }}>
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 py-4 px-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: isActive ? 'var(--color-sidebar-active)' : 'transparent',
                        color: isActive ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)',
                      }}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main Content ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header
          className="h-16 flex items-center justify-between px-4 lg:px-6 flex-shrink-0"
          style={{
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {currentPage?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
              style={{
                background: 'var(--color-surface-hover)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <Search size={16} />
              <span className="hidden md:inline">Search...</span>
              <kbd
                className="hidden md:inline text-xs px-1.5 py-0.5 rounded"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition-all"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <button
              className="p-2.5 rounded-xl transition-all relative"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Bell size={18} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: 'var(--color-danger)' }}
              />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl transition-all"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium"
                  style={{
                    background: 'var(--color-accent-muted)',
                    color: 'var(--color-accent)',
                  }}
                >
                  {user?.name?.[0]?.toUpperCase() || <User size={16} />}
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-50"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  >
                    <div className="p-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {user?.email || 'user@email.com'}
                      </p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors"
                        style={{ color: 'var(--color-danger)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-danger-muted)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
