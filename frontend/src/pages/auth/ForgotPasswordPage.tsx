import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--color-success-muted)' }}
        >
          <Mail size={24} style={{ color: 'var(--color-success)' }} />
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Check your email
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
          style={{ color: 'var(--color-accent)' }}
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
        Forgot your password?
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        Enter your email and we'll send you a reset link
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              id="forgot-email"
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
              }}
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent), hsl(252 87% 57%))',
          }}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </motion.button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-secondary)' }}>
        <Link to="/login" className="inline-flex items-center gap-1 font-medium hover:underline" style={{ color: 'var(--color-accent)' }}>
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </p>
    </div>
  );
}
