# Portofolio — Kerangka Modern

Ini adalah kerangka statis untuk website portofolio satu-halaman (single landing page) dengan fitur:
- Estetika minimalis, responsive (grid & flexbox)
- Dark mode + toggle (disimpan di localStorage)
- Navigasi smooth scrolling
- On-scroll reveal animations (IntersectionObserver)
- Lightweight parallax di hero
- Formulir kontak fungsional (gunakan Formspree atau endpoint backend Anda)
- Performa: sistem font default, gambar lazy-loading, prefer-reduced-motion support

File utama:
- `index.html` — struktur HTML5
- `styles.css` — CSS (variabel, dark/light, layout, animasi)
- `scripts.js` — interaksi (tema, nav, scroll, parallax, form)
- `assets/` — tempat meletakkan gambar: profile.jpg, project-1.jpg, project-2.jpg, project-3.jpg

Petunjuk cepat:
1. Gambar: ganti `assets/profile.jpg` dan gambar proyek dengan versi webp/jpg terkompresi. Gunakan ukuran responsif.
2. Formulir: ganti `CONFIG.formEndpoint` pada `scripts.js` dengan endpoint Formspree Anda (atau endpoint backend REST). Contoh Formspree: https://formspree.io/f/your-id
3. Deploy: dapat di-deploy ke Netlify / Vercel / GitHub Pages. Untuk performa tambahan, aktifkan minify CSS/JS dan gunakan optimasi gambar.
4. Aksesibilitas: sudah ada label, focus styles, dan prefer-reduced-motion. Tambahkan atribut ARIA lanjutan bila perlu.
5. Kustomisasi: ubah warna di :root pada `styles.css`, tambahkan komponen atau modal tanpa dependensi eksternal.

Tips performa:
- Gunakan format next-gen (WebP/AVIF) untuk gambar.
- Aktifkan HTTP caching, dan gzip/brotli di server.
- Jika menambahkan font custom, gunakan font-display: swap dan subset font.

Jika Anda ingin:
- Saya bisa menyediakan varian SCSS, atau bundling (Vite) untuk alur kerja modern.
- Menambahkan CMS sederhana (Netlify Forms / Formspree / Supabase) untuk menyimpan pesan.
- Mengonversi ke React/Vue dengan komponen terpisah.
