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

 
 <!-- SCRIPT INTEGRASI JADWAL SALAT & ANALOG CLOCK -->
 
    let prayerTimings = {};
    const prayerNames = {
        Fajr: "Subuh",
        Dhuhr: "Dzuhur",
        Asr: "Ashar",
        Maghrib: "Maghrib",
        Isha: "Isya"
    };

    function updateClockAndDate() {
        const now = new Date();
        
        // Logika Jam Analog
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        const secDeg = (seconds / 60) * 360;
        const minDeg = ((minutes / 60) * 360) + ((seconds/60)*6);
        const hourDeg = ((hours / 12) * 360) + ((minutes/60)*30);

        document.getElementById('sec-hand').style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
        document.getElementById('min-hand').style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
        document.getElementById('hour-hand').style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;

        // Update Digital untuk aksesibilitas
        const hDigital = String(hours).padStart(2, '0');
        const mDigital = String(minutes).padStart(2, '0');
        const sDigital = String(seconds).padStart(2, '0');
        document.getElementById('clock-digital').textContent = `${hDigital}:${mDigital}:${sDigital}`;
        
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const dateEl = document.getElementById('full-date');
        if(dateEl) dateEl.textContent = now.toLocaleDateString('id-ID', options);

        if (Object.keys(prayerTimings).length > 0) {
            processNextPrayer(now);
        }
    }

    function processNextPrayer(now) {
        const essential = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        let next = null;
        let minDiff = Infinity;

        essential.forEach(id => {
            const [h, m] = prayerTimings[id].split(':').map(Number);
            const pDate = new Date();
            pDate.setHours(h, m, 0, 0);

            let diff = pDate - now;
            if (diff < 0) {
                pDate.setDate(pDate.getDate() + 1);
                diff = pDate - now;
            }

            if (diff < minDiff) {
                minDiff = diff;
                next = { 
                    name: prayerNames[id], 
                    timeStr: prayerTimings[id],
                    countdownMs: diff
                };
            }
        });

        if (next) {
            document.getElementById('next-prayer-name').textContent = next.name;
            document.getElementById('next-prayer-time-display').textContent = next.timeStr;
            
            const h = Math.floor(next.countdownMs / 3600000);
            const m = Math.floor((next.countdownMs % 3600000) / 60000);
            const s = Math.floor((next.countdownMs % 60000) / 1000);
            
            document.getElementById('next-countdown-timer').textContent = 
                `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
    }

    async function fetchPrayerTimes(lat, lon, cityName = null) {
        try {
            const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=20`);
            const data = await response.json();
            if (data.code === 200) {
                prayerTimings = data.data.timings;
                const cityEl = document.getElementById('city-name');
                if (cityName) {
                    if(cityEl) cityEl.textContent = cityName;
                } else {
                    const locationLabel = data.data.meta.timezone.split('/')[1] || "Terdeteksi";
                    if(cityEl) cityEl.textContent = locationLabel.replace('_', ' ');
                }
            }
        } catch (err) {
            const cityEl = document.getElementById('city-name');
            if(cityEl) cityEl.textContent = "Gagal memuat data";
        }
    }

    function handleCityChange(value) {
        if (value === 'gps') {
            initGPS();
        } else {
            const [lat, lon] = value.split(',').map(Number);
            const selector = document.getElementById('city-selector');
            const cityName = selector.options[selector.selectedIndex].text;
            fetchPrayerTimes(lat, lon, cityName);
        }
    }

    function initGPS() {
        const cityEl = document.getElementById('city-name');
        if(cityEl) cityEl.textContent = "Mencari Lokasi...";
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude),
                () => fetchPrayerTimes(-6.2088, 106.8456, "Jakarta (Default)")
            );
        } else {
            fetchPrayerTimes(-6.2088, 106.8456, "Jakarta (Default)");
        }
    }

    setInterval(updateClockAndDate, 1000);
    window.addEventListener('load', () => {
        initGPS();
        updateClockAndDate();
        const yearEl = document.getElementById('year');
        if(yearEl) yearEl.textContent = new Date().getFullYear();
    });
 