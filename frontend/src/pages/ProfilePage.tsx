import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { AVATARS } from '../data/avatars';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { User, Trophy, Flame, Target, Award, Edit3, Key, Check, AlertCircle, Calendar } from 'lucide-react';
import audioService from '../services/audioService';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'avatar-1');
  const [bio, setBio] = useState(user?.bio || '');
  const [favoriteCategory, setFavoriteCategory] = useState(user?.favoriteCategory || 'General');

  // Change password states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await authService.getProfile();
        setStats(res.statistics);
        if (res.user) {
          setUsername(res.user.username);
          setAvatar(res.user.avatar);
          setBio(res.user.bio || '');
          setFavoriteCategory(res.user.favoriteCategory);
        }
      } catch (e) {
        // ignore
      }
    }
    loadData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);
    audioService.playButtonClick();

    try {
      const updated = await authService.updateProfile({
        username: username.trim(),
        avatar,
        bio: bio.trim(),
        favoriteCategory,
      });

      updateUser(updated);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      audioService.playWinFanfare();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsSaving(true);
    setMessage(null);
    setError(null);
    audioService.playButtonClick();

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setMessage('Password changed successfully!');
      audioService.playWinFanfare();
    } catch (err: any) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header Info Banner */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl mb-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <PlayerAvatar avatarId={isEditing ? avatar : user.avatar} size="lg" />
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              {user.username}
            </h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono font-bold text-cyan-400 mt-0.5">
              <span>@{user.userId}</span>
              <span>&bull;</span>
              <span className="text-slate-400 font-sans flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            {user.bio && <p className="text-xs text-slate-300 mt-2 max-w-sm">{user.bio}</p>}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            audioService.playButtonClick();
            setIsEditing(!isEditing);
            setIsChangingPassword(false);
          }}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
        >
          <Edit3 className="w-4 h-4 text-cyan-400" />
          <span>{isEditing ? 'CANCEL EDIT' : 'EDIT PROFILE'}</span>
        </button>
      </div>

      {message && (
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-700 mb-6">
          <h3 className="font-display font-black text-lg text-white mb-4">Edit Profile</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Display Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Change Avatar</label>
              <div className="grid grid-cols-6 gap-2 p-2 bg-slate-900/60 rounded-2xl border border-slate-800 max-h-32 overflow-y-auto">
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      audioService.playButtonClick();
                      setAvatar(av.id);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${
                      av.bgGradient
                    } ${avatar === av.id ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Bio / Status</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ready to score 11 points!"
                className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 text-xs shadow-neon-cyan"
            >
              SAVE CHANGES
            </button>
          </form>
        </div>
      )}

      {/* Change Password Form */}
      {isChangingPassword && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-700 mb-6">
          <h3 className="font-display font-black text-lg text-white mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-slate-950 text-xs shadow-neon-orange"
            >
              UPDATE PASSWORD
            </button>
          </form>
        </div>
      )}

      {/* Career Statistics Cards */}
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
        <Trophy className="w-4 h-4 text-amber-400" />
        <span>Career Game Statistics</span>
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Games Played</span>
          <p className="font-display font-black text-2xl text-white mt-1">
            {stats?.gamesPlayed || 0}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Games Won</span>
          <p className="font-display font-black text-2xl text-amber-400 mt-1">
            {stats?.gamesWon || 0}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Total Score</span>
          <p className="font-display font-black text-2xl text-purple-400 mt-1">
            {stats?.totalScore || 0}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Best Game</span>
          <p className="font-display font-black text-2xl text-cyan-400 mt-1">
            {stats?.bestScore || 0}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Correct Guesses</span>
          <p className="font-display font-black text-2xl text-emerald-400 mt-1">
            {stats?.correctGuesses || 0}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Drawing Turns</span>
          <p className="font-display font-black text-2xl text-orange-400 mt-1">
            {stats?.drawingRounds || 0}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Win Rate</span>
          <p className="font-display font-black text-2xl text-cyan-300 mt-1">
            {stats?.winPercentage || 0}%
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Fav Category</span>
          <p className="font-display font-bold text-sm text-yellow-300 truncate mt-2">
            {user.favoriteCategory || 'General'}
          </p>
        </div>
      </div>

      {/* Account Security Quick Links */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-purple-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Security & Password</h4>
            <p className="text-xs text-slate-400">Update your login credentials securely</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            audioService.playButtonClick();
            setIsChangingPassword(!isChangingPassword);
            setIsEditing(false);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700"
        >
          {isChangingPassword ? 'Cancel' : 'Change Password'}
        </button>
      </div>
    </div>
  );
};
