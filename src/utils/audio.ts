/**
 * Bộ phát âm thanh Web Audio API nhẹ nhàng, tinh tế cho lớp học
 * "TRỢ LÝ HỌC TẬP TIN HỌC THPT BÙI DỤC TÀI"
 * Không phụ thuộc file ngoài, không phát tự động khi chưa bấm
 */

class EducationalAudioSystem {
  private ctx: AudioContext | null = null;
  private isMusicPlaying = false;
  private musicInterval: any = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.15; // Âm lượng dịu nhẹ, không ồn ào

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Âm thanh báo thành công / lưu dữ liệu / nộp bài
  public playSuccessSound(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Hợp âm nhẹ C - E - G - C cao
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        if (this.masterGain) gain.connect(this.masterGain);
        else gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    } catch (e) {
      console.warn('Audio feedback unavailable:', e);
    }
  }

  // Âm thanh click nhẹ nhàng khi thao tác
  public playClickSound(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);
      else gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      // ignore
    }
  }

  // Bật/Tắt nhạc nền nhẹ nhàng (Giai điệu Lofi Study thư giãn)
  public toggleBackgroundMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }

  public isPlaying(): boolean {
    return this.isMusicPlaying;
  }

  private startBackgroundMusic(): void {
    try {
      const ctx = this.getContext();
      this.isMusicPlaying = true;

      // Thang âm ngũ cung ấm áp (Pentatonic: C D E G A)
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      let step = 0;

      const playChordNote = () => {
        if (!this.isMusicPlaying) return;
        const now = ctx.currentTime;

        // Nốt chính êm dịu (như tiếng đàn marimba/chuông gió xa)
        const noteIndex = [0, 2, 4, 3, 2, 5, 4, 1][step % 8];
        const freq = scale[noteIndex];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Attack mượt mà, decay dài
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        if (this.masterGain) gain.connect(this.masterGain);
        else gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.9);

        step++;
      };

      playChordNote();
      this.musicInterval = setInterval(playChordNote, 1400);
    } catch (e) {
      console.warn('Cannot start background audio:', e);
      this.isMusicPlaying = false;
    }
  }

  public stopBackgroundMusic(): void {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }
}

export const educationalAudio = new EducationalAudioSystem();
