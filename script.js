/* ============================================================
   SELENA: PIANISSIMO — SCRIPT.JS
   Particles · Gallery · Accordion · Music · QR · Navigation
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   1. PARTICLE BACKGROUND (CANVAS)
   ------------------------------------------------------------ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 80;
  const COLORS = ['#c9a84c', '#4cd8e8', '#8b5cf6', '#e8d48b'];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;

      // Wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const currentOpacity = p.opacity + Math.sin(p.pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.05, currentOpacity);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

/* ------------------------------------------------------------
   2. SCROLL REVEAL
   ------------------------------------------------------------ */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
})();

/* ------------------------------------------------------------
   3. NAVIGATION — MOBILE TOGGLE & ACTIVE LINK
   ------------------------------------------------------------ */
(function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile menu on link click
  links.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      navLinks?.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          const activeLink = document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`
          );
          activeLink?.classList.add('active');
        }
      });
    },
    { threshold: 0.25, rootMargin: '-80px 0px -50% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
})();

/* ------------------------------------------------------------
   4. GALLERY LIGHTBOX
   ------------------------------------------------------------ */
(function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!lightbox || !galleryItems.length) return;

  let currentIndex = 0;
  const items = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const item = items[index];
    lightboxImg.src = item.dataset.src;
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    openLightbox(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    openLightbox(currentIndex);
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();

/* ------------------------------------------------------------
   5. ACCORDION
   ------------------------------------------------------------ */
(function initAccordion() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion-item').forEach((i) => {
        i.classList.remove('active');
      });

      // Open clicked if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
})();

/* ------------------------------------------------------------
   6. MUSIC PLAYER
   ------------------------------------------------------------ */
(function initMusicPlayer() {
  const player = document.getElementById('musicPlayer');
  const toggleBtn = document.getElementById('musicToggle');
  const playPauseBtn = document.getElementById('playPause');
  const volumeSlider = document.getElementById('volumeSlider');
  const audio = document.getElementById('bgMusic');

  if (!player || !audio) return;

  // Start with volume at 30%
  audio.volume = 0.3;

  toggleBtn.addEventListener('click', () => {
    player.classList.toggle('expanded');
  });

  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {
        // Autoplay may be blocked — user interaction required
      });
      playPauseBtn.textContent = '❚❚';
      player.classList.add('playing');
    } else {
      audio.pause();
      playPauseBtn.textContent = '▶';
      player.classList.remove('playing');
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    audio.volume = parseFloat(e.target.value);
  });

  // Auto-play attempt on first user interaction
  const startAudio = () => {
    audio.play().then(() => {
      playPauseBtn.textContent = '❚❚';
      player.classList.add('playing');
    }).catch(() => {});
    document.removeEventListener('click', startAudio);
    document.removeEventListener('touchstart', startAudio);
  };

  document.addEventListener('click', startAudio, { once: true });
  document.addEventListener('touchstart', startAudio, { once: true });
})();

/* ------------------------------------------------------------
   7. QR CODE GENERATION
   ------------------------------------------------------------ */
(function initQRCode() {
  const qrImg = document.getElementById('qrImage');
  const qrUrl = document.getElementById('qrUrl');
  if (!qrImg) return;

  // Change this to your actual deployed URL (GitHub Pages, etc.)
  const pageUrl = window.location.href.startsWith('http')
    ? window.location.href
    : 'https://github.com/yourusername/selena-pianissimo';

  const encoded = encodeURIComponent(pageUrl);
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}&color=0a0a0f&bgcolor=e8e6f0&margin=8`;

  if (qrUrl) {
    qrUrl.textContent = pageUrl;
  }
})();

/* ------------------------------------------------------------
   8. SMOOTH SCROLL FOR ANCHOR LINKS (fallback)
   ------------------------------------------------------------ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ------------------------------------------------------------
   9. PARALLAX EFFECT ON HERO
   ------------------------------------------------------------ */
(function initParallax() {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.15;
    hero.style.transform = `translateY(${rate}px)`;
    hero.style.opacity = 1 - scrolled / 800;
  }, { passive: true });
})();

/* ------------------------------------------------------------
   10. TYPING EFFECT ON HERO TAGLINE
   ------------------------------------------------------------ */
(function initTypingEffect() {
  const tagline = document.querySelector('.hero-tagline');
  if (!tagline) return;

  const text = tagline.textContent;
  tagline.textContent = '';
  let i = 0;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        const type = () => {
          if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(type, 30);
          }
        };
        type();
        observer.disconnect();
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(tagline);
})();
