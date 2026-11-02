/**
 * Web Audio API Material Haptics Synthesizer
 * Generates tactile acoustic feedback simulating the physical touch
 * and vibration of different architectural materials without external assets.
 */

class AudioHaptics {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playMaterialSound(materialType: 'timber' | 'metal' | 'lacquer' | 'plaster' | 'textile' | 'mineral' | 'default') {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const master = this.ctx.createGain();
      master.connect(this.ctx.destination);

      switch (materialType) {
        case 'timber': {
          // Warm hollow timber knock (resonance around 210Hz with fast wood damping)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(260, t);
          osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);

          gain.gain.setValueAtTime(0.22, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

          osc.connect(gain);
          gain.connect(master);
          osc.start(t);
          osc.stop(t + 0.13);
          break;
        }

        case 'metal': {
          // Crisp metallic brass chime with shimmering harmonic overtones
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(1420, t);
          osc1.frequency.exponentialRampToValueAtTime(1280, t + 0.28);

          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(2840, t);
          osc2.frequency.exponentialRampToValueAtTime(2560, t + 0.22);

          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(master);

          osc1.start(t);
          osc2.start(t);
          osc1.stop(t + 0.32);
          osc2.stop(t + 0.32);
          break;
        }

        case 'lacquer': {
          // Soft smooth micro-click / silky glide
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(540, t);
          osc.frequency.exponentialRampToValueAtTime(320, t + 0.05);

          gain.gain.setValueAtTime(0.14, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

          osc.connect(gain);
          gain.connect(master);
          osc.start(t);
          osc.stop(t + 0.07);
          break;
        }

        case 'plaster':
        case 'mineral': {
          // Dry mineral stone tap / acoustic chalk contact
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(380, t);
          osc.frequency.exponentialRampToValueAtTime(190, t + 0.09);

          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

          osc.connect(gain);
          gain.connect(master);
          osc.start(t);
          osc.stop(t + 0.11);
          break;
        }

        case 'textile': {
          // Soft woven friction whisper
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(180, t);
          osc.frequency.exponentialRampToValueAtTime(90, t + 0.14);

          gain.gain.setValueAtTime(0.09, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

          osc.connect(gain);
          gain.connect(master);
          osc.start(t);
          osc.stop(t + 0.16);
          break;
        }

        default: {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, t);
          gain.gain.setValueAtTime(0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          osc.connect(gain);
          gain.connect(master);
          osc.start(t);
          osc.stop(t + 0.06);
          break;
        }
      }
    } catch {
      // Audio playback fails gracefully if audio context is blocked
    }
  }

  public playClick() {
    this.playMaterialSound('lacquer');
  }
}

export const audioHaptics = new AudioHaptics();
