/* ==========================================================================
   CUSTOM CURSOR & MAGNETIC INTERACTIONS
   Dual-layer responsive cursor with magnetic element attraction
   ========================================================================== */

const CursorManager = (() => {
  let dot, follower;
  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;
  let isHovering = false;
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hasTouch = window.matchMedia('(pointer: coarse)').matches;

  function init() {
    if (isReducedMotion || hasTouch) return;

    dot = document.createElement('div');
    dot.className = 'custom-cursor';
    document.body.appendChild(dot);

    follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      follower.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      follower.style.opacity = '0';
    });

    setupHoverStates();
    setupMagneticElements();

    requestAnimationFrame(render);
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }

  function render() {
    // Smooth trailing physics for outer follower ring
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;

    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(render);
  }

  function setupHoverStates() {
    const interactiveSelectors = 'a, button, input, textarea, select, .tab-btn, .filter-btn, .stat-card, .technique-card, .tilt-card, .synth-btn, .scramble-box, .contact-card-item';
    
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        follower.classList.add('hovering');
        isHovering = true;
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        follower.classList.remove('hovering');
        isHovering = false;
      }
    });
  }

  function setupMagneticElements() {
    const magneticItems = document.querySelectorAll('.btn-magnetic');

    magneticItems.forEach((item) => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.35;
        const deltaY = (e.clientY - centerY) * 0.35;

        item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  return {
    init,
    setupMagneticElements
  };
})();

window.CursorManager = CursorManager;
