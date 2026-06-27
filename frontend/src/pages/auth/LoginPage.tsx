import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
        Welcome back
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        Sign in to your account to continue
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Email
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
              style={{
                background: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                '--tw-ring-color': 'var(--color-accent)',
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Password
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
              style={{
                background: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                '--tw-ring-color': 'var(--color-accent)',
              } as React.CSSProperties}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Forgot password link */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs font-medium transition-colors hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent), hsl(252 87% 57%))',
            boxShadow: '0 0 20px rgb(99 102 241 / 0.3)',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          or
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium transition-colors hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
