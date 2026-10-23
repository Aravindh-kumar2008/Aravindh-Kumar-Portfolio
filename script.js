// Mobile menu, active-link highlighting, header shadow, and footer year.
(() => {
  const btn = document.getElementById('menuBtn');
  const list = document.getElementById('navList');
  const header = document.querySelector('.site-header');
  const links = [...document.querySelectorAll('.nav-list a')];
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');

  const setMenu = (open) => {
    if (!list || !btn) return;
    list.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };

  if (btn) {
    btn.addEventListener('click', () => setMenu(!list.classList.contains('open')));
  }
  links.forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); btn?.focus(); } });
  document.addEventListener('click', e => { if (header && !header.contains(e.target)) setMenu(false); });

  // Header shadow after scrolling
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Highlight the nav link of the section currently in view
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }

  // Theme toggle
  const applyTheme = (isDark) => {
    body.classList.toggle('dark-mode', isDark);
    if (themeIcon) themeIcon.textContent = isDark ? '☾' : '☀';
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  };

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  applyTheme(isDark);

  themeToggle?.addEventListener('click', () => {
    const nextTheme = !body.classList.contains('dark-mode');
    applyTheme(nextTheme);
  });

  // Skills flip interaction
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach((card) => {
    const flipCard = () => {
      const isOpen = card.classList.contains('is-flipped');
      skillCards.forEach(item => {
        item.classList.remove('is-flipped');
        item.setAttribute('aria-pressed', 'false');
      });
      if (!isOpen) {
        card.classList.add('is-flipped');
        card.setAttribute('aria-pressed', 'true');
      }
    };

    card.addEventListener('click', flipCard);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        flipCard();
      }
    });
    card.setAttribute('aria-pressed', 'false');
  });

  // Typing animation
  const typedEl = document.querySelector('[data-typed]');
  const typedText = typedEl?.textContent.trim() || '';
  if (typedEl && typedText) {
    typedEl.textContent = '';
    let i = 0;
    const type = () => {
      typedEl.textContent = typedText.slice(0, i);
      i += 1;
      if (i <= typedText.length) {
        setTimeout(type, 60);
      }
    };
    setTimeout(type, 300);
  }

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Animated counters
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value + (target === 100 ? '%' : '');
      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = target + (target === 100 ? '%' : '');
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  // Project filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
      projects.forEach(project => {
        const match = filter === 'all' || project.dataset.category.includes(filter);
        project.classList.toggle('hidden', !match);
      });
    });
  });

  // Footer year updates automatically
  const yearTarget = document.getElementById('year');
  if (yearTarget) yearTarget.textContent = new Date().getFullYear();

  // Make sure the site opens on the Home section
  if (!location.hash) window.scrollTo(0, 0);
})();