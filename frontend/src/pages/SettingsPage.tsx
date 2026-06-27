import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Shield, Globe, CreditCard, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  const inputStyle = {
    background: 'var(--color-surface-hover)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
  };

  return (
    <div className="max-w-[1000px] space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Manage your account preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-52 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: isActive ? 'var(--color-accent-muted)' : 'transparent',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl p-6"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Profile</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                    style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}
                  >
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <button
                      className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                      style={{ background: 'var(--color-surface-hover)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}
                    >
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Full Name</label>
                    <input type="text" defaultValue={user?.name || ''} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
                    <input type="email" defaultValue={user?.email || ''} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Currency</label>
                    <select className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>INR (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Timezone</label>
                    <select className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                      <option>UTC</option>
                      <option>America/New_York</option>
                      <option>Europe/London</option>
                      <option>Asia/Kolkata</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                    style={{ background: 'linear-gradient(135deg, var(--color-accent), hsl(252 87% 57%))' }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Appearance</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--color-surface-hover)' }}>
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? <Moon size={18} style={{ color: 'var(--color-accent)' }} /> : <Sun size={18} style={{ color: 'var(--color-warning)' }} />}
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Theme</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Switch between light and dark mode</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="relative w-12 h-6 rounded-full transition-colors"
                      style={{ background: theme === 'dark' ? 'var(--color-accent)' : 'var(--color-border)' }}
                    >
                      <motion.div
                        className="absolute top-1 w-4 h-4 rounded-full bg-white"
                        animate={{ left: theme === 'dark' ? '28px' : '4px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Notifications</h2>
                {[
                  { label: 'Budget Alerts', description: 'Get notified when you exceed a budget' },
                  { label: 'Bill Reminders', description: 'Reminders for upcoming bills' },
                  { label: 'Goal Updates', description: 'Progress updates on savings goals' },
                  { label: 'Monthly Reports', description: 'Receive monthly financial summary' },
                  { label: 'Email Notifications', description: 'Send notifications via email' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--color-surface-hover)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{item.label}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.description}</p>
                    </div>
                    <button className="relative w-12 h-6 rounded-full" style={{ background: i < 3 ? 'var(--color-accent)' : 'var(--color-border)' }}>
                      <div className="absolute top-1 w-4 h-4 rounded-full bg-white" style={{ left: i < 3 ? '28px' : '4px' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Security</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Current Password</label>
                    <input type="password" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>New Password</label>
                    <input type="password" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Confirm New Password</label>
                    <input type="password" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                    style={{ background: 'linear-gradient(135deg, var(--color-accent), hsl(252 87% 57%))' }}
                  >
                    Update Password
                  </motion.button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Billing</h2>
                <div className="rounded-xl p-5" style={{ background: 'var(--color-accent-muted)', border: '1px solid var(--color-accent)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>Free Plan</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                    You're on the free plan. Upgrade for AI insights, unlimited reports, and priority support.
                  </p>
                  <button className="mt-3 px-4 py-2 rounded-xl text-sm font-medium text-white"
                    style={{ background: 'linear-gradient(135deg, var(--color-accent), hsl(252 87% 57%))' }}>
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
