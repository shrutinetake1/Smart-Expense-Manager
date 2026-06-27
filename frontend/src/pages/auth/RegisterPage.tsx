import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Check, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuthStore();

  // Password strength
  const checks = [
    { label: '8+ characters', valid: password.length >= 8 },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'Number', valid: /[0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  const inputStyle = {
    background: 'var(--color-surface-hover)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-primary)',
    '--tw-ring-color': 'var(--color-accent)',
  } as React.CSSProperties;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
        Create your account
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        Start managing your finances smarter
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Full Name
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
              style={inputStyle}
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

          {/* Password strength indicators */}
          {password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 space-y-1"
            >
              {checks.map((check, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {check.valid ? (
                    <Check size={12} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <X size={12} style={{ color: 'var(--color-text-muted)' }} />
                  )}
                  <span style={{ color: check.valid ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                    {check.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading || checks.some((c) => !c.valid)}
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
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </motion.button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>or</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
      </div>

      <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--color-accent)' }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
