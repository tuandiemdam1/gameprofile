/* ============================================================
   GAME.JS — Gaming Profile Scripts
   - Particle canvas
   - Scroll reveal
   - Counter animation
   - Splash / Agent art switcher
   - Navbar behavior
============================================================ */

// ── PARTICLE CANVAS ──────────────────────────────────────────
(function initParticles() {
  const canvas  = document.getElementById('particle-canvas');
  const ctx     = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const COLORS = [
    'rgba(200,155,60,',    // LoL gold
    'rgba(11,196,227,',    // LoL blue
    'rgba(255,70,85,',     // Valorant red
    'rgba(102,192,244,',   // Steam blue
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size  = Math.random() * 2 + 0.5;
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * 0.4,
      vy:  -(Math.random() * 0.6 + 0.2),
      size,
      maxSize: size,
      alpha:   Math.random() * 0.6 + 0.1,
      color,
      life:    Math.random() * 200 + 100,
      maxLife: 0,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < 80; i++) {
      const p = createParticle();
      p.maxLife = p.life;
      particles.push(p);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      const progress = p.life / p.maxLife;
      const a = p.alpha * Math.sin(progress * Math.PI);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * progress, 0, Math.PI * 2);
      ctx.fillStyle = p.color + a + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (p.life <= 0) {
        particles[i] = createParticle();
        particles[i].maxLife = particles[i].life;
      }
    });

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });

  init();
  draw();
})();


// ── NAVBAR SCROLL BEHAVIOR ────────────────────────────────────
(function initNavbar() {
  const nav = document.getElementById('game-nav');
  const sections = {
    lol:    document.getElementById('lol-section'),
    val:    document.getElementById('valorant-section'),
    steam:  document.getElementById('steam-section'),
  };

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
})();


// ── SCROLL REVEAL ─────────────────────────────────────────────
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger reveal
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Add stagger delays to siblings
  elements.forEach((el, i) => {
    const parent = el.parentElement;
    const siblings = [...parent.querySelectorAll('.reveal')];
    const idx = siblings.indexOf(el);
    if (idx > 0) {
      el.dataset.delay = idx * 100;
    }
    observer.observe(el);
  });
})();


// ── COUNTER ANIMATION ─────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.counter-anim');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const step   = target / (duration / 16);
        let current  = 0;

        const update = () => {
          current += step;
          if (current >= target) {
            el.textContent = target.toLocaleString();
          } else {
            el.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(update);
          }
        };
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


// ── LOL SPLASH SWITCHER ───────────────────────────────────────
(function initSplashSwitcher() {
  const btns    = document.querySelectorAll('.splash-btn');
  const splash  = document.getElementById('featured-splash');
  const caption = document.getElementById('splash-caption');

  const captions = {
    'Yasuo':    'Yasuo — The Unforgiven · 312,482 Mastery pts',
    'LeeSin':   'Lee Sin — The Blind Monk · 142,018 Mastery pts',
    'JarvanIV': 'Jarvan IV — The Exemplary Warrior · Season 2026',
  };

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Fade transition
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.src = btn.dataset.splash;
        caption.textContent = captions[btn.dataset.name] || btn.dataset.name;
        splash.style.opacity = '1';
      }, 350);
    });
  });

  // Also update hero background on section scroll
  const lolBg = document.querySelector('.bg-splash');
  if (splash && lolBg) {
    splash.addEventListener('load', () => {
      splash.style.transition = 'opacity 0.4s';
    });
  }
})();


// ── VALORANT AGENT ART SWITCHER ───────────────────────────────
(function initAgentArt() {
  const btns    = document.querySelectorAll('.agent-art-btn');
  const artImg  = document.getElementById('agent-full-img');
  const caption = document.getElementById('agent-art-caption');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      artImg.style.opacity = '0';
      setTimeout(() => {
        artImg.src = btn.dataset.img;
        caption.textContent = btn.dataset.name;
        artImg.style.opacity = '1';
      }, 350);
    });
  });

  // Agent card click syncs with art select
  const agentCards = document.querySelectorAll('.agent-card');
  agentCards.forEach(card => {
    card.addEventListener('click', () => {
      agentCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const agentName = card.dataset.agent;
      const matchBtn  = [...btns].find(b => b.textContent.trim() === agentName);
      if (matchBtn) {
        matchBtn.click();
      }
    });
  });
})();





// ── PROGRESS BAR ANIMATION ────────────────────────────────────
(function initProgressBars() {
  const bars = document.querySelectorAll('.champ-progress-fill, .game-hours-fill');
  const origWidths = [];

  bars.forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0';
    origWidths.push(w);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = [...bars].indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.width = origWidths[idx];
        }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(b => observer.observe(b));
})();


// ── SMOOTH SCROLL ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── CURSOR GLOW EFFECT ────────────────────────────────────────
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,155,60,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease, background 0.5s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  const sectionColors = {
    'lol-section':      'rgba(200,155,60,0.07)',
    'valorant-section': 'rgba(255,70,85,0.07)',
    'steam-section':    'rgba(102,192,244,0.06)',
  };

  let currentSection = 'lol-section';

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';

    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (el) {
      const section = el.closest('.game-section');
      if (section) {
        const id = section.id;
        if (id !== currentSection && sectionColors[id]) {
          currentSection = id;
          glow.style.background = `radial-gradient(circle, ${sectionColors[id]} 0%, transparent 70%)`;
        }
      }
    }
  });
})();
