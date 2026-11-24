import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getServerBaseUrl, setServerBaseUrl } from '../services/api';
import { AVATARS } from '../data/avatars';
import { validateUserId, validatePassword } from '../utils/validation';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, CheckCircle2, AlertCircle, Sparkles, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServerConfigModal } from '../components/ServerConfigModal';
import audioService from '../services/audioService';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, intendedRedirectUrl, setIntendedRedirectUrl } = useAuthStore();

  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar-1');
  const [fullName, setFullName] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [serverUrl, setServerUrlState] = useState<string>(getServerBaseUrl());
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEditServer = () => {
    setIsServerModalOpen(true);
  };

  const handleServerSaved = (newUrl: string) => {
    setServerUrlState(newUrl);
    setError(null);
  };

  const pwdValidation = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client side validation
    const userIdErr = validateUserId(userId);
    if (userIdErr) {
      setError(userIdErr);
      return;
    }

    if (!username.trim()) {
      setError('Username display name is required');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }

    if (!pwdValidation.isValid) {
      setError(pwdValidation.message || 'Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    audioService.playButtonClick();

    try {
      await register({
        userId: userId.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        avatar: selectedAvatar,
        fullName: fullName.trim() || undefined,
      });

      audioService.playWinFanfare();
      setSuccessMessage('ACCOUNT CREATED SUCCESSFULLY!\nWelcome to GUESS THE ELEVEN.');

      setTimeout(() => {
        if (intendedRedirectUrl) {
          const redirect = intendedRedirectUrl;
          setIntendedRedirectUrl(null);
          navigate(redirect);
        } else {
          navigate('/home');
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
      audioService.playWrongGuess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel-elevated w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative z-10"
      >
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 mb-2.5 flex items-center justify-center font-display font-black text-2xl text-white shadow-sm">
            11
          </div>
          <h2 className="font-display font-black text-2xl text-white">CREATE ACCOUNT</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            JOIN GUESS THE ELEVEN
          </p>
        </div>

        {/* Success Banner */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-center font-bold text-sm whitespace-pre-line shadow-lg"
            >
              <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-bounce" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User ID */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              User ID <span className="text-orange-400">* (Login handle)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-500 font-bold text-sm">@</span>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value.toLowerCase())}
                placeholder="e.g. speedy_eleven"
                maxLength={20}
                required
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-8 pr-4 py-3 rounded-2xl border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Display Username */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Display Name <span className="text-cyan-400">* (Seen in game room)</span>
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Sketch Master"
                maxLength={25}
                required
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-2xl border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Email Address <span className="text-slate-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@example.com"
                required
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-2xl border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Choose Your Game Avatar:
            </label>
            <div className="grid grid-cols-6 gap-2 p-2 bg-slate-900/60 rounded-2xl border border-slate-800 max-h-36 overflow-y-auto">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    audioService.playButtonClick();
                    setSelectedAvatar(av.id);
                  }}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${
                    av.bgGradient
                  } transition-all ${
                    selectedAvatar === av.id
                      ? 'scale-110 ring-2 ring-white shadow-neon-cyan border-2 border-white'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                  title={av.name}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Password <span className="text-slate-400">* (Min 8 chars, letter & number)</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-10 py-3 rounded-2xl border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-sm font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <div
                  className={`h-1 flex-1 rounded-full ${
                    pwdValidation.strength === 'weak'
                      ? 'bg-rose-500'
                      : pwdValidation.strength === 'medium'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {pwdValidation.strength}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Confirm Password <span className="text-slate-400">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-10 py-3 rounded-2xl border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-sm font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 transform active:scale-95 transition-all mt-4"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              'CREATE ACCOUNT'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link
            to="/login"
            onClick={() => audioService.playButtonClick()}
            className="text-cyan-400 hover:underline font-bold"
          >
            Log In here
          </Link>
        </div>

        {/* Server Connection Badge */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 truncate mr-2">
            <Server className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Server: <strong className="text-cyan-300 font-mono">{serverUrl || 'https://guess-the-eleven-umyl.onrender.com'}</strong></span>
          </div>
          <button
            type="button"
            onClick={handleEditServer}
            className="text-orange-400 hover:text-orange-300 font-bold shrink-0 underline"
          >
            Change
          </button>
        </div>

        <ServerConfigModal
          isOpen={isServerModalOpen}
          onClose={() => setIsServerModalOpen(false)}
          onSaved={handleServerSaved}
        />
      </motion.div>
    </div>
  );
};
