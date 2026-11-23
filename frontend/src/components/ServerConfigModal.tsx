import React, { useState } from 'react';
import { Modal } from './Modal';
import { getServerBaseUrl, setServerBaseUrl } from '../services/api';
import { Server, Wifi, Cloud, CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import audioService from '../services/audioService';

interface ServerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (newUrl: string) => void;
}

export const ServerConfigModal: React.FC<ServerConfigModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const currentUrl = getServerBaseUrl() || 'http://10.161.180.82:3001';
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  const defaultRenderUrl = 'https://guess-the-eleven.onrender.com';
  const defaultLocalIp = 'http://10.161.180.82:3001';
  const defaultLocalhost = 'http://localhost:3001';

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Pinging game server...');
    audioService.playButtonClick();

    const target = (urlInput.trim() || defaultLocalIp).replace(/\/$/, '');
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${target}/api/health`, {
        signal: controller.signal,
      });
      clearTimeout(timer);

      const elapsed = Math.round(performance.now() - startTime);

      if (res.ok) {
        setTestStatus('success');
        setTestMessage(`Connected successfully! Latency: ${elapsed}ms`);
        audioService.playCorrectGuess();
      } else {
        setTestStatus('error');
        setTestMessage(`Server responded with HTTP ${res.status}: ${res.statusText}`);
        audioService.playWrongGuess();
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(
        err.name === 'AbortError'
          ? 'Connection timed out (6s). Render free instances take ~30-50s to wake up on first ping.'
          : `Connection failed: ${err.message || 'Network unreachable'}`
      );
      audioService.playWrongGuess();
    }
  };

  const handleSave = () => {
    audioService.playButtonClick();
    const cleaned = urlInput.trim().replace(/\/$/, '');
    setServerBaseUrl(cleaned);
    onSaved(cleaned);
    onClose();
  };

  const handlePreset = (preset: string) => {
    setUrlInput(preset);
    setTestStatus('idle');
    setTestMessage('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Game Server Connection">
      <div className="space-y-4 text-slate-200 text-sm">
        <p className="text-xs text-slate-400">
          Connect to a 24/7 Render cloud server or your local computer over Wi-Fi.
        </p>

        {/* URL Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
            Server Address (Render Cloud or Local IP)
          </label>
          <div className="relative">
            <Server className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setTestStatus('idle');
              }}
              placeholder="https://your-service.onrender.com"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Quick Presets
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handlePreset(defaultRenderUrl)}
              className="px-3 py-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900 text-xs text-purple-300 font-semibold border border-purple-500/40 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Cloud className="w-3.5 h-3.5 text-purple-400" />
              ☁️ Render Cloud 24/7
            </button>
            <button
              type="button"
              onClick={() => handlePreset(defaultLocalIp)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-mono border border-cyan-500/30 flex items-center gap-1.5 transition-all"
            >
              <Wifi className="w-3 h-3 text-cyan-400" />
              10.161.180.82 (Wi-Fi)
            </button>
            <button
              type="button"
              onClick={() => handlePreset(defaultLocalhost)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              localhost:3001
            </button>
          </div>
        </div>

        {/* Test Result Message */}
        {testStatus !== 'idle' && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              testStatus === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : testStatus === 'error'
                ? 'bg-red-950/60 border-red-500/50 text-red-300'
                : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-200'
            }`}
          >
            {testStatus === 'testing' && <RefreshCw className="w-4 h-4 animate-spin shrink-0 mt-0.5" />}
            {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
            {testStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold">{testMessage}</p>
              {testStatus === 'error' && (
                <ul className="list-disc list-inside mt-1.5 text-[11px] text-red-200 space-y-0.5">
                  <li>If using Render: Free tier instances sleep when idle. Wait ~30s and click Test again.</li>
                  <li>If using Wi-Fi: Make sure PC and phone are on same Wi-Fi/Hotspot.</li>
                  <li>Check that your server URL begins with https:// (or http:// for local IP).</li>
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black shadow-neon-cyan transition-all"
          >
            Save & Connect
          </button>
        </div>
      </div>
    </Modal>
  );
};
