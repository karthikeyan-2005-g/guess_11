class AudioService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private volume: number = 0.7;
  private bgmOscillator: OscillatorNode | null = null;
  private bgmGain: GainNode | null = null;
  private bgmInterval: any = null;

  constructor() {
    // Load persisted audio settings
    try {
      const storedSound = localStorage.getItem('gte_sound_enabled');
      if (storedSound !== null) this.soundEnabled = storedSound === 'true';

      const storedMusic = localStorage.getItem('gte_music_enabled');
      if (storedMusic !== null) this.musicEnabled = storedMusic === 'true';

      const storedVol = localStorage.getItem('gte_volume');
      if (storedVol !== null) this.volume = parseFloat(storedVol);
    } catch (e) {
      // fallback
    }
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    localStorage.setItem('gte_sound_enabled', String(enabled));
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    localStorage.setItem('gte_music_enabled', String(enabled));
    if (!enabled) {
      this.stopBGM();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('gte_volume', String(this.volume));
  }

  public isSoundEnabled() {
    return this.soundEnabled;
  }

  public isMusicEnabled() {
    return this.musicEnabled;
  }

  public getVolume() {
    return this.volume;
  }

  // Synthesis tone generator for guaranteed, instant, zero-asset audio playback
  private playTone(freq: number, type: OscillatorType, duration: number, delay: number = 0, gainLevel: number = 0.5) {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    setTimeout(() => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const targetGain = gainLevel * this.volume;
        gain.gain.setValueAtTime(targetGain, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (err) {
        // audio context safety
      }
    }, delay * 1000);
  }

  // UI Sounds
  public playButtonClick() {
    this.playTone(600, 'sine', 0.08, 0, 0.4);
  }

  public playPopup() {
    this.playTone(400, 'triangle', 0.1, 0, 0.4);
    this.playTone(600, 'triangle', 0.12, 0.05, 0.4);
  }

  public playJoinPop() {
    this.playTone(523.25, 'sine', 0.1, 0, 0.5); // C5
    this.playTone(659.25, 'sine', 0.15, 0.08, 0.5); // E5
  }

  // Game Sounds
  public playGameStart() {
    // Dramatic fanfare
    this.playTone(440, 'triangle', 0.15, 0, 0.6);
    this.playTone(554.37, 'triangle', 0.15, 0.15, 0.6);
    this.playTone(659.25, 'triangle', 0.15, 0.3, 0.6);
    this.playTone(880, 'sine', 0.5, 0.45, 0.8);
  }

  public playDrawingStart() {
    // Whistle sound: slide pitch
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.3 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }

  public playWrongGuess() {
    // Cartoon boing
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.25 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  }

  public playCorrectGuess() {
    // Victory chime (Arpeggio)
    this.playTone(523.25, 'triangle', 0.15, 0, 0.5); // C5
    this.playTone(659.25, 'triangle', 0.15, 0.08, 0.5); // E5
    this.playTone(783.99, 'triangle', 0.25, 0.16, 0.6); // G5
  }

  public playFirstGuess() {
    // Epic celebration: higher octave + coin
    this.playTone(587.33, 'triangle', 0.12, 0, 0.6);
    this.playTone(739.99, 'triangle', 0.15, 0.09, 0.6);
    this.playTone(880, 'triangle', 0.2, 0.18, 0.7);
    this.playTone(1174.66, 'sine', 0.45, 0.27, 0.8);
  }

  public playScore11() {
    // Coin chime reward sound (+11 Points!)
    this.playTone(987.77, 'sine', 0.12, 0, 0.6); // B5
    this.playTone(1318.51, 'sine', 0.35, 0.1, 0.7); // E6
  }

  public playTimerWarning() {
    // Orange warning 30s
    this.playTone(440, 'sine', 0.15, 0, 0.4);
    this.playTone(440, 'sine', 0.15, 0.25, 0.4);
  }

  public playFinalCountdown() {
    // Urgent final tick
    this.playTone(880, 'square', 0.1, 0, 0.3);
  }

  public playTimeUp() {
    // Failure buzzer
    this.playTone(220, 'sawtooth', 0.2, 0, 0.4);
    this.playTone(180, 'sawtooth', 0.35, 0.15, 0.5);
  }

  public playSadTrombone() {
    // Wah wah wah waaaah
    this.playTone(311.13, 'sawtooth', 0.3, 0, 0.4);
    this.playTone(293.66, 'sawtooth', 0.3, 0.35, 0.4);
    this.playTone(277.18, 'sawtooth', 0.3, 0.7, 0.4);
    this.playTone(261.63, 'sawtooth', 0.7, 1.05, 0.5);
  }

  public playWinFanfare() {
    // Grand champion fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      this.playTone(f, 'triangle', 0.25, i * 0.12, 0.6);
    });
    this.playTone(1046.5, 'sine', 0.8, 0.5, 0.8);
  }

  public playRoomFull() {
    // Crowd party celebration chime
    this.playTone(440, 'triangle', 0.2, 0, 0.5);
    this.playTone(554.37, 'triangle', 0.2, 0.1, 0.5);
    this.playTone(659.25, 'triangle', 0.2, 0.2, 0.5);
    this.playTone(880, 'triangle', 0.4, 0.3, 0.7);
  }

  // Ambient rhythmic BGM generator
  public startLobbyMusic() {
    if (!this.musicEnabled) return;
    this.stopBGM();

    const ctx = this.initContext();
    if (!ctx) return;

    let step = 0;
    const chords = [
      [261.63, 329.63, 392.0], // C major
      [220.0, 261.63, 329.63], // A minor
      [174.61, 220.0, 261.63], // F major
      [196.0, 246.94, 293.66], // G major
    ];

    this.bgmInterval = setInterval(() => {
      if (!this.musicEnabled) {
        this.stopBGM();
        return;
      }
      const chord = chords[step % chords.length];
      chord.forEach((freq) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          const bgmVol = 0.05 * this.volume;
          gain.gain.setValueAtTime(bgmVol, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        } catch (e) {}
      });
      step++;
    }, 1500);
  }

  public stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audioService = new AudioService();
export default audioService;
