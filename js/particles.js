/* ==========================================================================
   PARTICLE CONSTELLATION CANVAS ENGINE
   Interactive, theme-aware particle network with mouse proximity & physics
   ========================================================================== */

const ParticleCanvas = (() => {
  let canvas, ctx;
  let particles = [];
  let width, height;
  let animationFrameId;
  let mouse = { x: null, y: null, radius: 140 };
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Visual settings depending on theme
  let colors = {
    particle: 'rgba(0, 242, 254, 0.7)',
    line: 'rgba(79, 172, 254, 0.12)'
  };

  function updateColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      colors.particle = 'rgba(2, 132, 199, 0.6)';
      colors.line = 'rgba(2, 132, 199, 0.08)';
    } else {
      colors.particle = 'rgba(0, 242, 254, 0.65)';
      colors.line = 'rgba(79, 172, 254, 0.12)';
    }
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.density = Math.random() * 20 + 1;
    }

    update() {
      // Natural floating motion
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse proximity interaction (repulsion with elastic return)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density * 0.4;
          const directionY = forceDirectionY * force * this.density * 0.4;

          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = colors.particle;
      ctx.fill();
    }
  }

  function resize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    // Adjust count based on viewport area
    const particleCount = Math.floor((width * height) / 14000);
    const count = Math.min(Math.max(particleCount, 40), 90);

    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDistance = 110;
    const maxDistSq = maxDistance * maxDistance;

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const opacity = 1 - Math.sqrt(distSq) / maxDistance;
          ctx.strokeStyle = colors.line.replace(/[\d\.]+\)$/g, `${opacity * 0.18})`);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  function init() {
    canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    updateColors();
    resize();

    window.addEventListener('resize', debounce(resize, 150));

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('themeChanged', () => {
      updateColors();
    });

    if (!isReducedMotion) {
      animate();
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  return {
    init
  };
})();

window.ParticleCanvas = ParticleCanvas;
