import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { PlayerGrid } from '../components/PlayerGrid';
import { Modal } from '../components/Modal';
import { shareService } from '../services/shareService';
import socketService from '../services/socketService';
import { apiRequest } from '../services/api';
import audioService from '../services/audioService';
import {
  Share2,
  Copy,
  Check,
  Play,
  LogOut,
  Users,
  MessageCircle,
  Send,
  Sparkles,
  Crown,
  Smartphone,
  Globe,
  Laptop,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LobbyPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const roomCode = code?.toUpperCase() || '';

  const { room, players, isHost, resetRoom, setRoom, updatePlayers } = useRoomStore();
  const { status, countdown } = useGameStore();
  const { user } = useAuthStore();

  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [localIp, setLocalIp] = useState<string>('');
  const [customTunnelUrl, setCustomTunnelUrl] = useState<string>('');
  const [shareTab, setShareTab] = useState<'wifi' | 'internet' | 'local'>('wifi');

  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Fetch server network IP (e.g. 10.161.180.82)
  useEffect(() => {
    fetch('/api/health/network')
      .then((res) => res.json())
      .then((data) => {
        if (data.localIp && data.localIp !== 'localhost') {
          setLocalIp(data.localIp);
        }
      })
      .catch(() => {});
  }, []);

  // Compute best share URL for friends on other devices / mobile
  const port = window.location.port ? `:${window.location.port}` : '';
  const effectiveIp = localIp || window.location.hostname;

  // Wi-Fi share URL (accessible by phones/laptops on same Wi-Fi)
  const wifiShareUrl = isLocalhost && localIp
    ? `http://${localIp}${port || ':5173'}/room/${roomCode}`
    : `${window.location.origin}/room/${roomCode}`;

  // 24/7 Cloud share URL (hosted on Render - ALWAYS accessible anywhere!)
  const cloudShareUrl = `https://guess-the-eleven-umyl.onrender.com/room/${roomCode}`;

  // Internet share URL
  const internetShareUrl = customTunnelUrl
    ? `${customTunnelUrl.replace(/\/$/, '')}/room/${roomCode}`
    : cloudShareUrl;

  // Selected share URL for sharing buttons (default to 24/7 Cloud URL for universal access)
  const activeShareUrl = shareTab === 'wifi' && isLocalhost && localIp
    ? wifiShareUrl
    : cloudShareUrl;

  const playerCount = Object.keys(players).length;
  const isFull = playerCount >= 11;

  // Effective Host Check (checking both store flag and user credentials)
  const isEffectiveHost = isHost || !!(
    user && (
      room?.hostId === user.userId ||
      room?.hostId === user.id ||
      players[user.userId]?.isHost ||
      players[user.id]?.isHost
    )
  );

  // Auto-connect socket to this room upon mounting + 2-second continuous REST sync
  useEffect(() => {
    if (!roomCode) return;

    socketService.joinRoom(roomCode);

    const syncRoom = () => {
      apiRequest(`/rooms/${roomCode}`)
        .then((res) => {
          if (res?.data) {
            setRoom(res.data);
            if (res.data.players) {
              updatePlayers(res.data.players);
            }
          }
        })
        .catch(() => {});
    };

    // Immediate initial sync
    syncRoom();

    // Fast periodic poll every 2 seconds to guarantee 100% real-time player list sync
    const pollTimer = setInterval(syncRoom, 2000);
    return () => clearInterval(pollTimer);
  }, [roomCode, setRoom, updatePlayers]);

  // Navigate to game page once game starts
  useEffect(() => {
    if (status === 'DRAWING' || status === 'ROUND_END') {
      navigate(`/game/${roomCode}`);
    }
  }, [status, roomCode, navigate]);

  const handleCopyLink = async (urlToCopy?: string) => {
    audioService.playButtonClick();
    const target = urlToCopy || activeShareUrl;
    const ok = await shareService.copyToClipboard(target);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    audioService.playButtonClick();
    await shareService.shareNative({ roomCode, roomUrl: activeShareUrl });
  };

  const handleStartGame = () => {
    if (!isEffectiveHost) return;
    audioService.playGameStart();
    socketService.emit('GAME_START', { roomCode });
  };

  const handleLeave = () => {
    audioService.playButtonClick();
    socketService.emit('ROOM_LEAVE');
    resetRoom();
    navigate('/home');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 3-2-1 Countdown Overlay */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md"
          >
            <div className="flex flex-col items-center">
              <span className="font-display font-black text-9xl text-amber-400 drop-shadow-lg">
                {countdown}
              </span>
              <p className="text-xl font-black text-cyan-400 uppercase tracking-widest mt-4">
                GAME STARTING...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Top Lobby Bar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 mb-6 border border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 tracking-wider">
              {roomCode}
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase">&bull; 2–11 PLAYERS</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white">
            {room?.name || 'Guess The Eleven Party'}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> Host:{' '}
              <strong className="text-slate-200">
                {room?.players[room?.hostId || '']?.username || 'Host'}
              </strong>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 font-bold text-cyan-400">
              <Users className="w-3.5 h-3.5" /> {playerCount}/11 Connected
            </span>
          </div>
        </div>

        {/* Share and Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE ROOM</span>
          </button>

          <button
            type="button"
            onClick={() => handleCopyLink(activeShareUrl)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all"
            title="Copy invitation link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'COPIED!' : 'COPY LINK'}</span>
          </button>

          <button
            type="button"
            onClick={() => shareService.shareWhatsApp({ roomCode, roomUrl: activeShareUrl })}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
            title="Share via WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => shareService.shareTelegram({ roomCode, roomUrl: activeShareUrl })}
            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-sm"
            title="Share via Telegram"
          >
            <Send className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleLeave}
            className="px-3.5 py-2.5 rounded-xl bg-rose-900/50 hover:bg-rose-800 text-rose-200 text-xs font-bold border border-rose-800/40 flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>LEAVE</span>
          </button>
        </div>
      </div>

      {/* Room Full Celebration Notification */}
      {isFull && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 text-center font-black text-sm sm:text-base shadow-neon-orange flex items-center justify-center gap-2.5 animate-bounce-short"
        >
          <Sparkles className="w-6 h-6 text-slate-950" />
          <span>ROOM FULL! ALL 11 PLAYERS CONNECTED! HOST CAN START THE GAME!</span>
        </motion.div>
      )}

      {/* 11 Slots Player Grid */}
      <div className="mb-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
          <span>Party Members ({playerCount}/11) &bull; Min 2 to Start</span>
          <span className="text-cyan-400 font-mono">11 Rounds</span>
        </h3>
        <PlayerGrid players={players} maxPlayers={11} />
      </div>

      {/* Host Launch Controls */}
      <div className="glass-panel-elevated rounded-3xl p-6 border border-slate-700 text-center max-w-md mx-auto shadow-2xl">
        {isEffectiveHost ? (
          <div>
            <h4 className="font-display font-black text-xl text-white mb-1">YOU ARE THE HOST 👑</h4>
            <p className="text-xs text-slate-400 mb-5">
              {playerCount < 2
                ? 'Invite at least 1 more friend (minimum 2 players, up to 11) to start!'
                : `Ready with ${playerCount} player${playerCount > 1 ? 's' : ''}! Host can start now or wait for more (up to 11).`}
            </p>
            <button
              type="button"
              disabled={playerCount < 2}
              onClick={handleStartGame}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 transform active:scale-95 transition-all"
            >
              <Play className="w-6 h-6 fill-current" />
              START GAME ({playerCount}/11 PLAYERS)
            </button>
          </div>
        ) : (
          <div>
            <h4 className="font-display font-black text-lg text-white mb-1">WAITING FOR HOST ⏳</h4>
            <p className="text-xs text-slate-400">
              {playerCount < 2
                ? 'Waiting for at least 2 players to join...'
                : `Host can start the game now (${playerCount}/11 players connected)!`}
            </p>
          </div>
        )}
      </div>

      {/* Multi-Device Sharing Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Invite Friends & Devices"
      >
        <div className="space-y-4">
          {/* Tab selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setShareTab('wifi')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                shareTab === 'wifi'
                  ? 'bg-cyan-500 text-slate-950 shadow-neon-cyan font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Same Wi-Fi / LAN</span>
            </button>

            <button
              type="button"
              onClick={() => setShareTab('internet')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                shareTab === 'internet'
                  ? 'bg-purple-600 text-white shadow-neon-purple font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>24/7 Cloud Link</span>
            </button>
          </div>

          {/* Tab 1: Same Wi-Fi Link */}
          {shareTab === 'wifi' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Share this link with any phone, tablet, or laptop connected to the <strong>same Wi-Fi network</strong>:
              </p>
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all">
                {wifiShareUrl}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(wifiShareUrl)}
                  className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-neon-cyan"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'LINK COPIED!' : 'COPY WI-FI LINK'}
                </button>

                <button
                  type="button"
                  onClick={() => shareService.shareWhatsApp({ roomCode, roomUrl: wifiShareUrl })}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
                  title="Share to WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>Important:</strong> Do not send "localhost" to your friends. This Wi-Fi link (<code>{localIp || '10.x.x.x'}</code>) reaches your computer from their mobile browsers.
                </span>
              </div>
            </div>
          )}

          {/* Tab 2: Over Internet / Render 24/7 Cloud */}
          {shareTab === 'internet' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Share this <strong>24/7 Cloud Link</strong> with your friends on mobile data (4G/5G) or any Wi-Fi:
              </p>
              <div className="p-3 bg-slate-900 rounded-2xl border border-purple-500/40 font-mono text-xs text-purple-300 break-all select-all">
                {cloudShareUrl}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(cloudShareUrl)}
                  className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-neon-purple transition-all"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'LINK COPIED!' : 'COPY 24/7 CLOUD LINK'}
                </button>

                <button
                  type="button"
                  onClick={() => shareService.shareWhatsApp({ roomCode, roomUrl: cloudShareUrl })}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
                  title="Share to WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                <span>
                  Friends can open this link directly in mobile Chrome/Safari without installing the app!
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
