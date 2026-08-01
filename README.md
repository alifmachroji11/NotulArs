# NotulArs

Prototipe web app mobile-first untuk asisten penangkap informasi proyek arsitektur lewat WhatsApp (Notula) yang digabung dengan pencarian semantik lintas sumber (Ingat), di bawah satu brand **NotulArs**.

## Struktur project

```
notulars/
  index.html          landing page + tombol "Masuk dengan Google"
  app.html            dashboard (Proyek / Cari / Profil)
  app.js              logika dashboard (data dummy + interaksi)
  styles.css          token warna, tipografi, logo — dipakai bersama kedua halaman
  assets/fonts/       Space Grotesk & Inter (self-hosted, tanpa CDN)
```

Semua data proyek/tangkapan/pencarian di dalam `app.js` masih **data dummy** untuk kebutuhan demo. Belum ada backend — WhatsApp, Google Drive, dan galeri foto belum benar-benar terhubung.

## Login dengan Google

Login memakai alur **OAuth 2.0 implicit flow lewat redirect penuh** (bukan popup, bukan Google Identity Services button) — dipilih setelah versi popup/GSI ternyata sering diblokir browser (`Failed to open popup window`). Dengan redirect, seluruh halaman pindah ke halaman resmi Google, lalu Google mengembalikan pengguna ke situs ini membawa ID token di URL fragment (`#id_token=...`). Tidak butuh backend.

Client ID yang sudah dipasang di `index.html`:
```
236954718406-jt2mchqaktllrnh95c8ffgfho937cmja.apps.googleusercontent.com
```

**Wajib dilakukan sebelum login bisa berfungsi**, di [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → pilih OAuth Client ID di atas, isi **dua** bagian ini (bukan cuma satu):

- **Authorized JavaScript origins** — tambahkan `http://localhost:PORT` dan domain deploy (misal `https://notul-ars.vercel.app`), tanpa trailing slash.
- **Authorized redirect URIs** — tambahkan `http://localhost:PORT/` dan `https://notul-ars.vercel.app/`, **dengan** trailing slash `/` di akhir (kode ini selalu mengirim `redirect_uri` sebagai origin + `/`, harus persis sama).

Tunggu 1-2 menit setelah disimpan sebelum dicoba.

Setelah login, data dari Google (nama, email, foto) diambil dari ID token yang dikembalikan Google di URL, disimpan di `localStorage`, lalu ditampilkan di tab **Profil**. Ini **belum diverifikasi di server** — cukup aman untuk prototipe (ada pengecekan `nonce` untuk mencegah replay dasar), tapi untuk versi produksi sebaiknya token diverifikasi ulang lewat backend (endpoint `tokeninfo` Google atau library resmi) sebelum dipercaya penuh.

## Menjalankan lokal

Karena `redirect_uri` harus persis cocok dengan yang didaftarkan, jalankan lewat server lokal (bukan buka file HTML langsung) supaya originnya konsisten:

```bash
# opsi 1: pakai Node (tanpa install apa pun)
npx serve .

# opsi 2: pakai Python
python -m http.server 8000
```

Lalu buka `http://localhost:PORT/` (perhatikan trailing slash), dan pastikan origin + redirect URI-nya sudah didaftarkan di Google Cloud Console (lihat di atas).

## Deploy ke Vercel

```bash
npm i -g vercel
vercel
```
Pilih "no build step" / static — project ini murni HTML/CSS/JS statis, tidak butuh build command.

## Deploy ke Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```
Atau drag folder `notulars/` ke [app.netlify.com/drop](https://app.netlify.com/drop).

Setelah deploy, **jangan lupa** tambahkan domain barunya ke Authorized JavaScript origins **dan** Authorized redirect URIs (dengan trailing slash) di Google Cloud Console.

## Yang masih dummy / belum tersambung

- Data proyek, tangkapan (foto/voice note/catatan), dan hasil pencarian — semua contoh statis di `app.js`.
- Tombol "Bagikan ke Klien" (PDF/WhatsApp) — simulasi toast, belum benar-benar ekspor/mengirim.
- Toggle "Sumber Terhubung" (WhatsApp/Drive/Galeri) — hanya mengubah tampilan, belum benar-benar menyambungkan API apa pun.
- Nomor WhatsApp bot di alur onboarding — nomor contoh, bukan nomor aktif.
