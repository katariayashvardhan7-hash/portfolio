/* ==========================================================================
   3D PERSPECTIVE TILT MODULE
   Calculates card angle, depth matrix, and dynamic specular glare
   ========================================================================== */

const TiltManager = (() => {
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    if (isReducedMotion) return;

    const tiltCards = document.querySelectorAll('.tilt-card, [data-tilt]');

    tiltCards.forEach((card) => {
      // Add glare layer if missing
      if (!card.querySelector('.tilt-glare')) {
        const glare = document.createElement('div');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
      card.addEventListener('mouseleave', () => handleMouseLeave(card));
    });

    setupInteractiveLabPlatform();
  }

  function handleMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxTilt = parseFloat(card.getAttribute('data-tilt-max')) || 12;

    // Calculate rotation (-maxTilt to +maxTilt)
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

    // Update specular glare coordinates
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${glareX}%`);
    card.style.setProperty('--mouse-y', `${glareY}%`);
  }

  function handleMouseLeave(card) {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease-out';

    setTimeout(() => {
      card.style.transition = '';
    }, 500);
  }

  function setupInteractiveLabPlatform() {
    const platform = document.getElementById('tilt-test-platform');
    const readout = document.getElementById('tilt-readout');

    if (platform && readout) {
      platform.addEventListener('mousemove', (e) => {
        const rect = platform.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotX = (((y - centerY) / centerY) * -18).toFixed(1);
        const rotY = (((x - centerX) / centerX) * 18).toFixed(1);

        platform.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.06)`;
        readout.textContent = `X: ${rotX}° | Y: ${rotY}°`;
      });

      platform.addEventListener('mouseleave', () => {
        platform.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
        readout.textContent = 'Hover & Move Mouse';
      });
    }
  }

  return {
    init
  };
})();

window.TiltManager = TiltManager;
