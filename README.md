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

Login memakai **Google Identity Services** (`accounts.google.com/gsi/client`), bukan OAuth redirect klasik — jadi tidak perlu backend untuk proses login itu sendiri.

Client ID yang sudah dipasang di `index.html`:
```
236954718406-jt2mchqaktllrnh95c8ffgfho937cmja.apps.googleusercontent.com
```

**Wajib dilakukan sebelum login bisa berfungsi**, di [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → pilih OAuth Client ID di atas → bagian **Authorized JavaScript origins**, tambahkan:

- `http://localhost:PORT` (untuk tes lokal, lihat bagian "Menjalankan lokal" di bawah)
- Domain hasil deploy nanti, misalnya `https://notulars.vercel.app` atau `https://notulars.netlify.app` (baru tahu setelah deploy pertama — tambahkan lalu tunggu 1-2 menit sebelum dicoba lagi)

Tanpa origin yang terdaftar, tombol Google tidak akan muncul / akan menampilkan pesan error di halaman.

Setelah login, data dari Google (nama, email, foto) diambil langsung dari ID token yang dikirim Google, disimpan di `localStorage`, lalu ditampilkan di tab **Profil**. Ini **belum diverifikasi di server** — cukup aman untuk prototipe, tapi untuk versi produksi sebaiknya token diverifikasi ulang lewat backend (endpoint `tokeninfo` Google atau library resmi) sebelum dipercaya penuh.

## Menjalankan lokal

Google Identity Services menolak berjalan di `file://` — harus lewat server lokal:

```bash
# opsi 1: pakai Node (tanpa install apa pun)
npx serve .

# opsi 2: pakai Python
python -m http.server 8000
```

Lalu buka `http://localhost:PORT`, dan pastikan origin tersebut sudah didaftarkan di Google Cloud Console (lihat di atas).

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

Setelah deploy, **jangan lupa** tambahkan domain barunya ke Authorized JavaScript origins di Google Cloud Console.

## Yang masih dummy / belum tersambung

- Data proyek, tangkapan (foto/voice note/catatan), dan hasil pencarian — semua contoh statis di `app.js`.
- Tombol "Bagikan ke Klien" (PDF/WhatsApp) — simulasi toast, belum benar-benar ekspor/mengirim.
- Toggle "Sumber Terhubung" (WhatsApp/Drive/Galeri) — hanya mengubah tampilan, belum benar-benar menyambungkan API apa pun.
- Nomor WhatsApp bot di alur onboarding — nomor contoh, bukan nomor aktif.
