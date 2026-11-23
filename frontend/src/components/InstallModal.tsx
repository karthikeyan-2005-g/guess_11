import React from 'react';
import { Modal } from './Modal';
import { Download, Smartphone, Laptop, Apple, CheckCircle2, Share2, Sparkles } from 'lucide-react';
import audioService from '../services/audioService';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isInstallable: boolean;
  isIOS: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isInstallable,
  isIOS,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Install GUESS THE ELEVEN">
      <div className="space-y-4 text-left">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-cyan-500/20 border border-slate-700 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 via-purple-600 to-cyan-400 p-0.5 shadow-neon-orange mx-auto mb-2.5 overflow-hidden">
            <img src="/images/logo.png" alt="Guess The Eleven" className="w-full h-full object-cover rounded-[14px]" />
          </div>
          <h4 className="font-display font-black text-lg text-white">
            Play Fullscreen on Any Device
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Install on Android, iOS, Windows, and Mac with 1 click! Zero app store download needed.
          </p>

          {/* 1-Click Install Button if supported by browser */}
          <button
            type="button"
            onClick={() => {
              audioService.playButtonClick();
              onInstall();
            }}
            className="w-full mt-4 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 text-slate-950 font-black text-sm shadow-neon-orange flex items-center justify-center gap-2 transform active:scale-95 transition-all"
          >
            <Download className="w-5 h-5" />
            <span>CLICK TO INSTALL NOW</span>
          </button>
        </div>

        {/* Device-Specific Guides */}
        <div className="space-y-2.5 text-xs">
          {/* Android */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-white mb-1">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Android (Pure Mobile App Format - No Browser Bar)</span>
            </div>
            <p className="text-slate-400">
              When opened via <strong>HTTPS</strong> (such as the link from <code>npm run tunnel</code>), Chrome installs a native WebAPK with <strong>zero browser bars</strong> and full-screen gameplay.
            </p>
            <p className="text-slate-400 mt-1">
              Or build the native <strong>.apk</strong> file anytime using <code>npm run mobile:open:android</code> in Android Studio.
            </p>
          </div>

          {/* Windows PC */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-white mb-1">
              <Laptop className="w-4 h-4 text-cyan-400" />
              <span>Windows PC & Laptop</span>
            </div>
            <p className="text-slate-400">
              Click the <strong>"Install App"</strong> icon in your browser address bar (top right in Chrome/Edge), or click the button above. The game launches in its own dedicated window!
            </p>
          </div>

          {/* iOS (iPhone / iPad) */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-white mb-1">
              <Apple className="w-4 h-4 text-rose-400" />
              <span>iPhone & iPad (iOS)</span>
            </div>
            <p className="text-slate-400">
              In Safari, tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-cyan-400" /> at the bottom, scroll down, and tap <strong>"Add to Home Screen"</strong>.
            </p>
          </div>

          {/* Native Android APK Build */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-white mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Native Android APK & AAB Files</span>
            </div>
            <p className="text-slate-400">
              The project is fully configured with Capacitor. Run <code className="text-cyan-300 font-mono">npm run mobile:android</code> to open the native project in Android Studio and build the standalone <code className="text-amber-300 font-mono">.apk</code> or Google Play <code className="text-amber-300 font-mono">.aab</code> bundle!
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
