import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { PlayerGrid } from '../components/PlayerGrid';
import { Modal } from '../components/Modal';
import { shareService } from '../services/shareService';
import socketService from '../services/socketService';
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

  const { room, players, isHost, resetRoom } = useRoomStore();
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

  // Internet share URL (if tunnel or custom domain provided)
  const internetShareUrl = customTunnelUrl
    ? `${customTunnelUrl.replace(/\/$/, '')}/room/${roomCode}`
    : wifiShareUrl;

  // Selected share URL for sharing buttons
  const activeShareUrl = shareTab === 'internet' ? internetShareUrl : wifiShareUrl;

  const playerCount = Object.keys(players).length;
  const isFull = playerCount >= 11;

  // Auto-connect socket to this room upon mounting
  useEffect(() => {
    if (roomCode) {
      socketService.emit('ROOM_JOIN', { roomCode });
    }
  }, [roomCode]);

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
    if (!isHost) return;
    audioService.playGameStart();
    socketService.emit('GAME_START');
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
              <span className="font-display font-black text-9xl text-transparent bg-clip-text bg-gradient-to-tr from-orange-400 via-amber-300 to-yellow-400 drop-shadow-2xl animate-pulse-fast">
                {countdown}
              </span>
              <p className="text-xl font-black text-cyan-400 uppercase tracking-widest mt-4">
                GAME STARTING...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helpful Mobile Wi-Fi Notice Banner if user is on localhost */}
      {isLocalhost && (
        <div className="mb-4 p-3.5 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <Smartphone className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <strong className="text-white block sm:inline">Playing with friends on mobile phones? </strong>
              <span>Friends on other devices cannot open "localhost". Use your Wi-Fi link below!</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shrink-0 shadow-neon-cyan"
          >
            VIEW SHARE LINKS
          </button>
        </div>
      )}

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
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black flex items-center gap-2 shadow-neon-cyan transition-all hover:scale-105"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE ROOM</span>
          </button>

          <button
            type="button"
            onClick={() => handleCopyLink(wifiShareUrl)}
            className="px-3.5 py-2.5 rounded-2xl glass-card hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all"
            title="Copy Wi-Fi invitation link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'COPIED!' : 'COPY LINK'}</span>
          </button>

          <button
            type="button"
            onClick={() => shareService.shareWhatsApp({ roomCode, roomUrl: wifiShareUrl })}
            className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md"
            title="Share via WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => shareService.shareTelegram({ roomCode, roomUrl: wifiShareUrl })}
            className="p-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-md"
            title="Share via Telegram"
          >
            <Send className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleLeave}
            className="px-3.5 py-2.5 rounded-2xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-bold border border-rose-800/40 flex items-center gap-1.5 transition-all"
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
        {isHost ? (
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
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-slate-950 font-black text-lg shadow-neon-orange disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 transform active:scale-95 transition-all"
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
              <span>Over Internet (Tunnel)</span>
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

          {/* Tab 2: Over Internet / Different Wi-Fi */}
          {shareTab === 'internet' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                If your friends are at their own houses or on mobile 4G/5G data, run this command in a new terminal to create a free public link:
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-400 select-all">
                npm run tunnel
              </div>
              <p className="text-xs text-slate-400">
                Then paste the generated <code>https://...</code> public URL here:
              </p>
              <input
                type="text"
                value={customTunnelUrl}
                onChange={(e) => setCustomTunnelUrl(e.target.value)}
                placeholder="https://your-tunnel-url.loca.lt"
                className="w-full bg-slate-900 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />

              {customTunnelUrl && (
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-purple-500/40 text-purple-300 text-xs font-mono break-all">
                    {internetShareUrl}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(internetShareUrl)}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-neon-purple flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    COPY INTERNET INVITATION LINK
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
