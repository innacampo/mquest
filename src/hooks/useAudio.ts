import { useCallback, useEffect, useRef, useState } from 'react';

type AudioScene = 'map' | 'village' | 'battle' | 'none';

interface AudioState {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
  scene: AudioScene;
}

// Procedural audio engine using Web Audio API
class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private activeOscillators: OscillatorNode[] = [];
  private currentScene: AudioScene = 'none';
  private isPlaying = false;
  private loopTimers: number[] = [];

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.connect(this.masterGain);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setMasterVolume(v: number) {
    if (this.masterGain) this.masterGain.gain.setValueAtTime(v, this.ctx!.currentTime);
  }
  setMusicVolume(v: number) {
    if (this.musicGain) this.musicGain.gain.setValueAtTime(v, this.ctx!.currentTime);
  }
  setSfxVolume(v: number) {
    if (this.sfxGain) this.sfxGain.gain.setValueAtTime(v, this.ctx!.currentTime);
  }
  setMuted(m: boolean) {
    this.setMasterVolume(m ? 0 : 1);
  }

  stopAll() {
    this.isPlaying = false;
    this.loopTimers.forEach(t => clearTimeout(t));
    this.loopTimers = [];
    this.activeOscillators.forEach(o => {
      try { o.stop(); } catch {}
    });
    this.activeOscillators = [];
    this.activeNodes = [];
    this.currentScene = 'none';
  }

  playScene(scene: AudioScene) {
    if (scene === this.currentScene && this.isPlaying) return;
    this.stopAll();
    if (scene === 'none') return;
    this.currentScene = scene;
    this.isPlaying = true;
    const ctx = this.getCtx();

    switch (scene) {
      case 'village': this.playVillageAmbience(ctx); break;
      case 'map': this.playMapAmbience(ctx); break;
      case 'battle': this.playBattleMusic(ctx); break;
    }
  }

  // --- Village: warm pad + gentle wind + bird chirps ---
  private playVillageAmbience(ctx: AudioContext) {
    // Warm pad chord (C major 7th)
    const padFreqs = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3
    padFreqs.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain!);
      osc.start();
      this.activeOscillators.push(osc);
      this.activeNodes.push(gain, filter);
    });

    // Gentle wind noise
    this.createWindNoise(ctx, 0.015, 400);

    // Bird chirps loop
    const chirpLoop = () => {
      if (!this.isPlaying || this.currentScene !== 'village') return;
      this.playChirp(ctx);
      const t = window.setTimeout(chirpLoop, 2000 + Math.random() * 5000);
      this.loopTimers.push(t);
    };
    const t = window.setTimeout(chirpLoop, 1000);
    this.loopTimers.push(t);
  }

  private playChirp(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const baseFreq = 1200 + Math.random() * 800;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.3, ctx.currentTime + 0.05);
    osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, ctx.currentTime + 0.12);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.1, ctx.currentTime + 0.18);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  // --- Map: mysterious drone + shimmering high tones ---
  private playMapAmbience(ctx: AudioContext) {
    // Deep mysterious drone (D minor)
    const droneFreqs = [73.42, 110.00, 146.83]; // D2, A2, D3
    droneFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sawtooth' : 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(i === 0 ? 0.02 : 0.035, ctx.currentTime + 3);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain!);
      osc.start();
      this.activeOscillators.push(osc);
      this.activeNodes.push(gain, filter);
    });

    // Shimmer tones loop
    const shimmerLoop = () => {
      if (!this.isPlaying || this.currentScene !== 'map') return;
      this.playShimmer(ctx);
      const t = window.setTimeout(shimmerLoop, 3000 + Math.random() * 4000);
      this.loopTimers.push(t);
    };
    const t = window.setTimeout(shimmerLoop, 2000);
    this.loopTimers.push(t);

    // Wind
    this.createWindNoise(ctx, 0.01, 300);
  }

  private playShimmer(ctx: AudioContext) {
    const freq = [523.25, 587.33, 659.25, 783.99, 880][Math.floor(Math.random() * 5)];
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.3);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start();
    osc.stop(ctx.currentTime + 2.1);
  }

  // --- Battle: driving pulse + tension drone + percussion hits ---
  private playBattleMusic(ctx: AudioContext) {
    // Tension drone (diminished chord)
    const battleFreqs = [98.00, 116.54, 138.59]; // G2, Bb2, Db3
    battleFreqs.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 1);
      osc.frequency.value = freq;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      // LFO for filter wobble
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.5;
      lfoGain.gain.value = 200;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain!);
      osc.start();
      this.activeOscillators.push(osc, lfo);
      this.activeNodes.push(gain, filter, lfoGain);
    });

    // Rhythmic pulse
    const bpm = 120;
    const beatMs = (60 / bpm) * 1000;
    let beat = 0;
    const pulseLoop = () => {
      if (!this.isPlaying || this.currentScene !== 'battle') return;
      this.playBattlePulse(ctx, beat % 4 === 0);
      beat++;
      const t = window.setTimeout(pulseLoop, beatMs);
      this.loopTimers.push(t);
    };
    pulseLoop();
  }

  private playBattlePulse(ctx: AudioContext, accent: boolean) {
    // Kick-like thump
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(accent ? 80 : 60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(accent ? 0.15 : 0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);

    // Accent hi-hat noise
    if (accent) {
      this.playNoiseHit(ctx, 0.04, 0.05);
    }
  }

  private playNoiseHit(ctx: AudioContext, vol: number, dur: number) {
    const bufferSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 8000;
    src.connect(hp);
    hp.connect(gain);
    gain.connect(this.sfxGain!);
    src.start();
  }

  // --- Utility: wind noise ---
  private createWindNoise(ctx: AudioContext, vol: number, cutoff: number) {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 2);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    // Slow modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = cutoff * 0.3;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain!);
    src.start();
    this.activeOscillators.push(lfo);
    this.activeNodes.push(src, gain, filter, lfoGain);
    // Store src so stop works
    (src as any).__isBufferSource = true;
  }

  // --- SFX: shrine chimes ---
  playChime() {
    const ctx = this.getCtx();
    const chimeFreqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chimeFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 1.5);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 1.6);
    });
  }

  // --- SFX: victory fanfare ---
  playVictory() {
    const ctx = this.getCtx();
    const notes = [392, 440, 523.25, 659.25, 783.99]; // G4, A4, C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.8);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.9);
    });
  }

  // --- SFX: collect item ---
  playCollect() {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.15);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  }

  // --- SFX: wrong answer ---
  playError() {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  }

  destroy() {
    this.stopAll();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

// Singleton
let engineInstance: ProceduralAudioEngine | null = null;
function getEngine() {
  if (!engineInstance) engineInstance = new ProceduralAudioEngine();
  return engineInstance;
}

export type { AudioScene };

export function useAudio() {
  const [audioState, setAudioState] = useState<AudioState>(() => {
    const saved = localStorage.getItem('mq-audio-prefs');
    return saved ? JSON.parse(saved) : {
      masterVolume: 0.7,
      musicVolume: 0.6,
      sfxVolume: 0.8,
      muted: false,
      scene: 'none' as AudioScene,
    };
  });
  const engineRef = useRef(getEngine());

  // Persist prefs
  useEffect(() => {
    localStorage.setItem('mq-audio-prefs', JSON.stringify(audioState));
  }, [audioState]);

  // Sync volumes
  useEffect(() => {
    const e = engineRef.current;
    e.setMasterVolume(audioState.muted ? 0 : audioState.masterVolume);
    e.setMusicVolume(audioState.musicVolume);
    e.setSfxVolume(audioState.sfxVolume);
  }, [audioState.masterVolume, audioState.musicVolume, audioState.sfxVolume, audioState.muted]);

  const setScene = useCallback((scene: AudioScene) => {
    engineRef.current.playScene(scene);
    setAudioState(prev => ({ ...prev, scene }));
  }, []);

  const toggleMute = useCallback(() => {
    setAudioState(prev => ({ ...prev, muted: !prev.muted }));
  }, []);

  const setMasterVolume = useCallback((v: number) => {
    setAudioState(prev => ({ ...prev, masterVolume: v }));
  }, []);
  const setMusicVolume = useCallback((v: number) => {
    setAudioState(prev => ({ ...prev, musicVolume: v }));
  }, []);
  const setSfxVolume = useCallback((v: number) => {
    setAudioState(prev => ({ ...prev, sfxVolume: v }));
  }, []);

  const playChime = useCallback(() => engineRef.current.playChime(), []);
  const playVictory = useCallback(() => engineRef.current.playVictory(), []);
  const playCollect = useCallback(() => engineRef.current.playCollect(), []);
  const playError = useCallback(() => engineRef.current.playError(), []);

  return {
    ...audioState,
    setScene,
    toggleMute,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    playChime,
    playVictory,
    playCollect,
    playError,
  };
}
