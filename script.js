// ============================================================
//  PORTFOLIO SCRIPT — Le Minh Khue
// ============================================================

/* ----------------------------------------------------------
   1. NAVBAR — scroll behaviour
---------------------------------------------------------- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
})();

/* ----------------------------------------------------------
   2. HERO CANVAS — animated particle network
---------------------------------------------------------- */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 80;
  const CONNECT_DIST   = 120;
  const particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 180, 255, 0.6)';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(100, 180, 255, ${0.25 * (1 - d / CONNECT_DIST)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ----------------------------------------------------------
   3. TYPING ANIMATION
---------------------------------------------------------- */
(function initTyping() {
  const el = document.getElementById('typing');
  if (!el) return;

  const texts = [
    'R&D Engineer',
    'Robotics Researcher',
    'AMR Specialist',
    'Control Systems Engineer',
    'Fleet Management Expert',
  ];

  let ti = 0, ci = 0, deleting = false;

  function tick() {
    const current = texts[ti];
    if (!deleting) {
      ci++;
      el.textContent = current.slice(0, ci);
      if (ci === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 80);
    } else {
      ci--;
      el.textContent = current.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        ti = (ti + 1) % texts.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 40);
    }
  }
  tick();
})();

/* ----------------------------------------------------------
   4. VIETTEL CAROUSEL
---------------------------------------------------------- */
(function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  let current = 0;
  let autoTimer = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(n) {
    current = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  document.querySelector('.carousel-btn.prev')?.addEventListener('click', () => {
    goTo(current - 1);
    resetAuto();
  });
  document.querySelector('.carousel-btn.next')?.addEventListener('click', () => {
    goTo(current + 1);
    resetAuto();
  });

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }
  startAuto();
})();

/* ----------------------------------------------------------
   5. SCROLL REVEAL
---------------------------------------------------------- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    observer.observe(el);
  });
})();

/* ----------------------------------------------------------
   6. SMOOTH ACTIVE NAV HIGHLIGHT
---------------------------------------------------------- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => {
          const href = l.getAttribute('href');
          l.style.color = href === `#${id}` ? 'var(--accent)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();

/* ----------------------------------------------------------
   7. YOUTUBE CLICK-TO-OPEN — sorting slide
---------------------------------------------------------- */
(function initVideoClick() {
  const wrap = document.getElementById('sorting-video-wrap');
  if (!wrap) return;
  const url = wrap.getAttribute('data-yturl');
  wrap.addEventListener('click', function () {
    if (url) window.open(url, '_blank', 'noopener');
  });
})();
