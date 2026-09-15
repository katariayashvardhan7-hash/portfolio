/* ==========================================================================
   AUDIO SYNTHESIZER MODULE
   Zero-dependency micro-sound synthesizer using the native Web Audio API
   ========================================================================== */

const AudioManager = (() => {
  const SOUND_STORAGE_KEY = 'yk_portfolio_sound_enabled';
  let isSoundEnabled = localStorage.getItem(SOUND_STORAGE_KEY) !== 'false'; // default true
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function init() {
    updateButtonUI();
    const soundToggleBtn = document.getElementById('sound-toggle');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', toggleSound);
    }
  }

  function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    localStorage.setItem(SOUND_STORAGE_KEY, isSoundEnabled);
    updateButtonUI();

    if (isSoundEnabled) {
      playChime();
      if (window.ToastManager) {
        window.ToastManager.show('🔊 Audio Feedback Enabled', 'info');
      }
    } else {
      if (window.ToastManager) {
        window.ToastManager.show('🔇 Audio Feedback Muted', 'info');
      }
    }
  }

  function updateButtonUI() {
    const soundToggleBtn = document.getElementById('sound-toggle');
    if (soundToggleBtn) {
      if (isSoundEnabled) {
        soundToggleBtn.classList.remove('sound-muted');
        soundToggleBtn.setAttribute('title', 'Sound enabled (Click to mute)');
        soundToggleBtn.setAttribute('aria-label', 'Sound enabled');
      } else {
        soundToggleBtn.classList.add('sound-muted');
        soundToggleBtn.setAttribute('title', 'Sound muted (Click to enable)');
        soundToggleBtn.setAttribute('aria-label', 'Sound muted');
      }
    }
  }

  // Soft subtle click / pop
  function playClick(freq = 800) {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Audio context might need user interaction first
    }
  }

  // Soft blip for toggles
  function playBlip(freq = 520) {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Upbeat two-tone chime for success / activation
  function playChime() {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + i * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (e) {}
  }

  // Celebratory fan-fare for contact submission / confetti trigger
  function playCelebration() {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const chord = [440, 554.37, 659.25, 880]; // A major arpeggio
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch (e) {}
  }

  return {
    init,
    toggleSound,
    playClick,
    playBlip,
    playChime,
    playCelebration,
    isEnabled: () => isSoundEnabled
  };
})();

window.AudioManager = AudioManager;
