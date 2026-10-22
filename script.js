// Mobile menu, active-link highlighting, header shadow, and footer year.
(() => {
  const btn = document.getElementById('menuBtn');
  const list = document.getElementById('navList');
  const header = document.querySelector('.site-header');
  const links = [...list.querySelectorAll('a')];

  const setMenu = (open) => {
    list.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => setMenu(!list.classList.contains('open')));
  links.forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); btn.focus(); } });
  document.addEventListener('click', e => { if (!header.contains(e.target)) setMenu(false); });

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

  // Footer year updates automatically
  document.getElementById('year').textContent = new Date().getFullYear();

  // Make sure the site opens on the Home section
  if (!location.hash) window.scrollTo(0, 0);
})();