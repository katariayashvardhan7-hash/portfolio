/* ==========================================================================
   MAIN APPLICATION ENTRY POINT
   Yashvardhan Kataria Portfolio - Digital Literacy Class Project
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize UI Feedback & Toast Notifications
  if (window.ToastManager) {
    window.ToastManager.init();
  }

  // 2. Initialize Native Web Audio Synthesizer
  if (window.AudioManager) {
    window.AudioManager.init();
  }

  // 3. Initialize Theme Engine (Dark/Light)
  if (window.ThemeManager) {
    window.ThemeManager.init();
  }

  // 4. Initialize Particle Constellation Canvas
  if (window.ParticleCanvas) {
    window.ParticleCanvas.init();
  }

  // 5. Initialize Custom Cursor & Magnetic Attraction
  if (window.CursorManager) {
    window.CursorManager.init();
  }

  // 6. Initialize 3D Perspective Tilt Engine
  if (window.TiltManager) {
    window.TiltManager.init();
  }

  // 7. Initialize Confetti Canvas
  if (window.ConfettiManager) {
    window.ConfettiManager.init();
  }

  // 8. Initialize Page Interactions (Tabs, Filters, Form, Scroll Spy)
  if (window.PageInteractions) {
    window.PageInteractions.init();
  }

  // Console Welcome & Academic Credit
  console.log(
    `%c🚀 Yashvardhan Kataria %c| Digital Literacy Capstone Project\n%cBuilt with Semantic HTML5, Modular CSS3, and Vanilla JavaScript ES6+.\nTheme & Audio controls active.`,
    'background: #00f2fe; color: #0a0d14; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    'color: #4facfe; font-weight: bold;',
    'color: #94a3b8; font-family: monospace; font-size: 11px;'
  );
});
