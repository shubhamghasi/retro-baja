// Web Audio API pure synthesized ambient soundscape generator
// Completely independent, legal, and isolated from YouTube player.

export class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Rain nodes
  private rainGain: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;

  // Vinyl nodes
  private vinylGain: GainNode | null = null;
  private vinylSource: AudioBufferSourceNode | null = null;

  // Fan nodes
  private fanGain: GainNode | null = null;
  private fanOsc1: OscillatorNode | null = null;
  private fanOsc2: OscillatorNode | null = null;
  private fanLfo: OscillatorNode | null = null;

  // CRT Hum nodes
  private humGain: GainNode | null = null;
  private humOsc1: OscillatorNode | null = null;
  private humOsc2: OscillatorNode | null = null;

  private isRunning: boolean = false;

  private initContext(): boolean {
    if (this.ctx) return true;
    if (typeof window === 'undefined') return false;

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return false;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
    return true;
  }

  private createPinkNoiseBuffer(durationSeconds = 5): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private createVinylCrackleBuffer(durationSeconds = 6): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Background hiss
      let sample = (Math.random() * 2 - 1) * 0.015;
      // Random pops and crackles
      if (Math.random() < 0.0008) {
        sample += (Math.random() * 2 - 1) * (0.3 + Math.random() * 0.4);
      }
      data[i] = sample;
    }
    return buffer;
  }

  public start(): void {
    if (this.isRunning) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const t = this.ctx.currentTime;

    // 1. Rain setup
    const rainBuffer = this.createPinkNoiseBuffer(6);
    if (rainBuffer) {
      this.rainSource = this.ctx.createBufferSource();
      this.rainSource.buffer = rainBuffer;
      this.rainSource.loop = true;

      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.value = 1200;

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0, t);

      this.rainSource.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);
      this.rainSource.start();
    }

    // 2. Vinyl setup
    const vinylBuffer = this.createVinylCrackleBuffer(6);
    if (vinylBuffer) {
      this.vinylSource = this.ctx.createBufferSource();
      this.vinylSource.buffer = vinylBuffer;
      this.vinylSource.loop = true;

      const vinylFilter = this.ctx.createBiquadFilter();
      vinylFilter.type = 'bandpass';
      vinylFilter.frequency.value = 2200;
      vinylFilter.Q.value = 0.8;

      this.vinylGain = this.ctx.createGain();
      this.vinylGain.gain.setValueAtTime(0, t);

      this.vinylSource.connect(vinylFilter);
      vinylFilter.connect(this.vinylGain);
      this.vinylGain.connect(this.masterGain);
      this.vinylSource.start();
    }

    // 3. Ceiling Fan setup (Hum + LFO blade whoosh)
    this.fanOsc1 = this.ctx.createOscillator();
    this.fanOsc1.type = 'sine';
    this.fanOsc1.frequency.value = 110;

    this.fanOsc2 = this.ctx.createOscillator();
    this.fanOsc2.type = 'triangle';
    this.fanOsc2.frequency.value = 55;

    const fanFilter = this.ctx.createBiquadFilter();
    fanFilter.type = 'lowpass';
    fanFilter.frequency.value = 240;

    const fanLfoGain = this.ctx.createGain();
    fanLfoGain.gain.value = 0.3;

    this.fanLfo = this.ctx.createOscillator();
    this.fanLfo.frequency.value = 1.8; // Fan rotation speed
    this.fanLfo.connect(fanLfoGain.gain);

    this.fanGain = this.ctx.createGain();
    this.fanGain.gain.setValueAtTime(0, t);

    this.fanOsc1.connect(fanFilter);
    this.fanOsc2.connect(fanFilter);
    fanFilter.connect(fanLfoGain);
    fanLfoGain.connect(this.fanGain);
    this.fanGain.connect(this.masterGain);

    this.fanOsc1.start();
    this.fanOsc2.start();
    this.fanLfo.start();

    // 4. CRT Hum setup (50Hz mains + harmonics)
    this.humOsc1 = this.ctx.createOscillator();
    this.humOsc1.type = 'sine';
    this.humOsc1.frequency.value = 50;

    this.humOsc2 = this.ctx.createOscillator();
    this.humOsc2.type = 'sine';
    this.humOsc2.frequency.value = 100;

    const humFilter = this.ctx.createBiquadFilter();
    humFilter.type = 'lowpass';
    humFilter.frequency.value = 180;

    this.humGain = this.ctx.createGain();
    this.humGain.gain.setValueAtTime(0, t);

    this.humOsc1.connect(humFilter);
    this.humOsc2.connect(humFilter);
    humFilter.connect(this.humGain);
    this.humGain.connect(this.masterGain);

    this.humOsc1.start();
    this.humOsc2.start();

    this.isRunning = true;
  }

  public setMasterVolume(volume: number): void {
    if (!this.ctx || !this.masterGain) return;
    const clamped = Math.max(0, Math.min(1, volume / 100));
    this.masterGain.gain.setTargetAtTime(clamped * 0.45, this.ctx.currentTime, 0.05);
  }

  public setRainVolume(volume: number): void {
    if (!this.ctx || !this.rainGain) return;
    const clamped = Math.max(0, Math.min(1, volume / 100));
    this.rainGain.gain.setTargetAtTime(clamped * 0.35, this.ctx.currentTime, 0.05);
  }

  public setVinylVolume(volume: number): void {
    if (!this.ctx || !this.vinylGain) return;
    const clamped = Math.max(0, Math.min(1, volume / 100));
    this.vinylGain.gain.setTargetAtTime(clamped * 0.4, this.ctx.currentTime, 0.05);
  }

  public setFanVolume(volume: number): void {
    if (!this.ctx || !this.fanGain) return;
    const clamped = Math.max(0, Math.min(1, volume / 100));
    this.fanGain.gain.setTargetAtTime(clamped * 0.25, this.ctx.currentTime, 0.05);
  }

  public setCrtHumVolume(volume: number): void {
    if (!this.ctx || !this.humGain) return;
    const clamped = Math.max(0, Math.min(1, volume / 100));
    this.humGain.gain.setTargetAtTime(clamped * 0.2, this.ctx.currentTime, 0.05);
  }

  public stop(): void {
    if (!this.isRunning) return;

    try {
      this.rainSource?.stop();
      this.vinylSource?.stop();
      this.fanOsc1?.stop();
      this.fanOsc2?.stop();
      this.fanLfo?.stop();
      this.humOsc1?.stop();
      this.humOsc2?.stop();
      this.ctx?.close();
    } catch {
      // Ignored on teardown
    }

    this.ctx = null;
    this.masterGain = null;
    this.rainGain = null;
    this.vinylGain = null;
    this.fanGain = null;
    this.humGain = null;
    this.isRunning = false;
  }
}

export const ambientEngine = new AmbientAudioEngine();
