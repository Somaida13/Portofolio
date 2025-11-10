// Minimal, dependency-free JS for interactions:
// - Dark mode toggle (localStorage)
// - Mobile nav toggle
// - Smooth scroll with header offset
// - IntersectionObserver reveals (on-scroll animation)
// - Lightweight parallax for hero layers (on scroll)
// - Contact form validation + fetch to Formspree (replace endpoint)

// Config
const CONFIG = {
  formEndpoint: "https://formspree.io/f/your-form-id", // <-- Ganti dengan endpoint Formspree atau backend Anda
  scrollOffset: 80 // header height to offset anchor scrolling on desktop
};

// Theme toggle
const rootEl = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(theme){
  if(theme === 'light') rootEl.classList.add('light');
  else rootEl.classList.remove('light');
  themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
}
(function initTheme(){
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
})();
themeToggle.addEventListener('click', () => {
  const isLight = rootEl.classList.contains('light');
  const next = isLight ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

// Mobile nav
const burger = document.getElementById('burger');
const nav = document.querySelector('.nav ul');
burger?.addEventListener('click', () => {
  const expanded = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!expanded));
  nav.style.display = expanded ? '' : 'flex';
});

// Smooth scroll with offset for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if(target){
      e.preventDefault();
      const headerOffset = window.innerWidth > 900 ? CONFIG.scrollOffset : 16;
      const rect = target.getBoundingClientRect();
      const top = window.scrollY + rect.top - headerOffset;
      window.scrollTo({top, behavior: 'smooth'});
    }
  }, {passive: true});
});

// IntersectionObserver reveals
const reveals = document.querySelectorAll('.reveal-anim');
if('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => io.observe(r));
} else {
  // fallback
  reveals.forEach(r => r.classList.add('revealed'));
}

// Lightweight parallax for hero layers
(function heroParallax(){
  const layers = document.querySelectorAll('.hero-parallax.layer');
  if(!layers.length) return;
  let latestScroll = 0;
  let ticking = false;
  function onScroll(){
    latestScroll = window.scrollY;
    if(!ticking){
      window.requestAnimationFrame(() => {
        layers.forEach(layer => {
          const speed = parseFloat(layer.dataset.speed) || 0.2;
          layer.style.transform = `translate3d(0, ${latestScroll * speed}px, 0)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
})();

// Form handling with client-side validation and fetch to endpoint
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
if(form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    const data = new FormData(form);
    // Basic validation
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const message = data.get('message')?.toString().trim();
    if(!name || !email || !message){
      formStatus.textContent = 'Mohon lengkapi semua kolom.';
      return;
    }
    form.querySelector('button[type="submit"]').disabled = true;
    formStatus.textContent = 'Mengirim...';
    try {
      const res = await fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: {'Accept': 'application/json'},
        body: data
      });
      if(res.ok){
        formStatus.textContent = 'Terima kasih — pesan Anda telah terkirim.';
        form.reset();
      } else {
        // Try to parse error
        const json = await res.json().catch(()=>null);
        formStatus.textContent = (json && json.error) ? json.error : 'Gagal mengirim. Silakan coba lagi atau hubungi via email.';
      }
    } catch (err){
      console.error(err);
      formStatus.textContent = 'Terjadi kesalahan jaringan. Silakan coba lagi nanti.';
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();