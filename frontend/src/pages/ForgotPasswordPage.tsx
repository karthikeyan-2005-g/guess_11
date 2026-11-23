import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import audioService from '../services/audioService';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    audioService.playButtonClick();

    try {
      const res = await authService.forgotPassword(email.trim());
      setMessage(res.message);
      if (res.devResetToken) {
        setResetToken(res.devResetToken);
      }
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    audioService.playButtonClick();

    try {
      const res = await authService.resetPassword({
        token: resetToken.trim(),
        newPassword,
        confirmNewPassword,
      });
      setMessage(res.message);
      audioService.playWinFanfare();
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel-elevated w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl"
      >
        <div className="text-center mb-6">
          <h2 className="font-display font-black text-2xl text-white">RESET PASSWORD</h2>
          <p className="text-xs text-slate-400 mt-1">
            {step === 'request'
              ? 'Enter your registered email to receive reset instructions'
              : 'Enter your reset token and new password'}
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  required
                  className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-2xl border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-black text-sm shadow-neon-cyan disabled:opacity-50"
            >
              {isSubmitting ? 'SENDING...' : 'CONTINUE'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Reset Token</label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Enter reset token"
                required
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 px-4 py-3 rounded-2xl border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-10 py-3 rounded-2xl border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-2xl border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 text-slate-950 font-black text-sm shadow-neon-orange disabled:opacity-50"
            >
              {isSubmitting ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-400">
          Remember your password?{' '}
          <Link
            to="/login"
            onClick={() => audioService.playButtonClick()}
            className="text-cyan-400 hover:underline font-bold"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
