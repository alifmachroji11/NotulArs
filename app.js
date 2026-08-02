/* ============================================================
   NotulArs — dashboard logic
   ============================================================ */

/* ---------- Auth guard ---------- */
let currentUser = null;
(function authGuard(){
  const raw = localStorage.getItem('notulars_user');
  if(!raw){
    window.location.href = 'index.html';
    return;
  }
  try{ currentUser = JSON.parse(raw); }
  catch(e){ window.location.href = 'index.html'; }
})();

function logout(){
  localStorage.removeItem('notulars_user');
  window.location.href = 'index.html';
}

/* ---------- Photo placeholder scenes (inline SVG illustrations, theme-aware) ---------- */
const PATTERNS = {
  /* Kamar mandi — pemasangan keramik */
  bathroom: (accent) => `<svg viewBox="0 0 64 64" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <rect width="64" height="64" fill="var(--surface-2)"/>
    <g stroke="${accent}" stroke-width="1" opacity=".4">
      <path d="M0 9H64M0 18H64M0 27H64M0 36H64M12 0V44M24 0V44M36 0V44M48 0V44"/>
    </g>
    <line x1="0" y1="44" x2="64" y2="44" stroke="${accent}" stroke-width="1.5" opacity=".55"/>
    <rect x="8" y="46" width="30" height="7" rx="3.5" fill="${accent}"/>
    <ellipse cx="23" cy="49.5" rx="10" ry="2.8" fill="var(--surface-2)"/>
    <rect x="18" y="40" width="10" height="6" rx="1.5" fill="none" stroke="${accent}" stroke-width="1.5"/>
  </svg>`,
  /* Pengecoran lantai / konstruksi beton */
  concrete: (accent) => `<svg viewBox="0 0 64 64" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <rect width="64" height="64" fill="var(--surface-2)"/>
    <polygon points="0,64 64,64 64,38 0,30" fill="${accent}" opacity=".16"/>
    <line x1="0" y1="30" x2="64" y2="38" stroke="${accent}" stroke-width="1.5" opacity=".5"/>
    <g stroke="${accent}" stroke-width="1" opacity=".25">
      <path d="M8 46H24M32 50H48M14 58H30"/>
    </g>
    <g transform="translate(30,14) rotate(18)">
      <path d="M0 0 L16 4 L14 10 L-2 6 Z" fill="${accent}"/>
      <line x1="14" y1="10" x2="20" y2="18" stroke="${accent}" stroke-width="2.4" stroke-linecap="round"/>
    </g>
  </svg>`,
  /* Jendela — posisi/ukuran kusen */
  window: (accent) => `<svg viewBox="0 0 64 64" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <rect width="64" height="64" fill="var(--surface-2)"/>
    <rect x="14" y="8" width="36" height="36" fill="${accent}" opacity=".1"/>
    <rect x="14" y="8" width="36" height="36" fill="none" stroke="${accent}" stroke-width="2.5"/>
    <path d="M32 8V44M14 26H50" stroke="${accent}" stroke-width="1.8"/>
    <rect x="10" y="44" width="44" height="4" rx="1.5" fill="${accent}" opacity=".8"/>
    <rect x="10" y="48" width="44" height="3" rx="1.2" fill="${accent}" opacity=".4"/>
  </svg>`,
  /* Rak / etalase toko */
  shelf: (accent) => `<svg viewBox="0 0 64 64" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <rect width="64" height="64" fill="var(--surface-2)"/>
    <g stroke="${accent}" stroke-width="2" opacity=".6">
      <path d="M8 20H56M8 36H56M8 52H56"/>
    </g>
    <g fill="${accent}" opacity=".85">
      <rect x="12" y="10" width="8" height="10" rx="1"/>
      <rect x="23" y="8" width="7" height="12" rx="1"/>
      <rect x="33" y="11" width="9" height="9" rx="1"/>
      <rect x="45" y="9" width="7" height="11" rx="1"/>
      <rect x="12" y="26" width="9" height="10" rx="1"/>
      <rect x="25" y="24" width="8" height="12" rx="1"/>
      <rect x="38" y="27" width="10" height="9" rx="1"/>
      <rect x="16" y="42" width="10" height="10" rx="1"/>
      <rect x="30" y="40" width="8" height="12" rx="1"/>
      <rect x="42" y="43" width="9" height="9" rx="1"/>
    </g>
  </svg>`,
  /* Lantai granit / ubin */
  floor: (accent) => `<svg viewBox="0 0 64 64" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <rect width="64" height="64" fill="var(--surface-2)"/>
    <g stroke="${accent}" stroke-width="1.5" opacity=".35">
      <path d="M0 32H64M32 0V64"/>
    </g>
    <g stroke="${accent}" stroke-width="1" opacity=".2">
      <path d="M0 16H64M0 48H64M16 0V64M48 0V64"/>
    </g>
    <polygon points="4,60 20,4 28,4 12,60" fill="${accent}" opacity=".15"/>
  </svg>`,
  /* Talang air / atap */
  gutter: (accent) => `<svg viewBox="0 0 64 64" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <rect width="64" height="64" fill="var(--surface-2)"/>
    <path d="M0 18L64 6V15L0 27Z" fill="${accent}" opacity=".6"/>
    <rect x="44" y="15" width="7" height="36" rx="2" fill="${accent}" opacity=".85"/>
    <path d="M44 51 Q47.5 60 51 51" stroke="${accent}" stroke-width="2.2" fill="none"/>
    <circle cx="47.5" cy="57" r="2" fill="${accent}"/>
    <circle cx="53" cy="60" r="1.4" fill="${accent}" opacity=".7"/>
  </svg>`,
  /* Partisi kaca */
  partition: (accent) => `<svg viewBox="0 0 64 64" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <rect width="64" height="64" fill="var(--surface-2)"/>
    <rect x="16" y="6" width="34" height="52" fill="${accent}" opacity=".1"/>
    <rect x="16" y="6" width="34" height="52" fill="none" stroke="${accent}" stroke-width="2.2"/>
    <rect x="12" y="4" width="42" height="4" rx="1.5" fill="${accent}" opacity=".8"/>
    <rect x="46" y="28" width="3" height="9" rx="1.5" fill="${accent}"/>
    <line x1="16" y1="58" x2="50" y2="58" stroke="${accent}" stroke-width="2" opacity=".5"/>
  </svg>`,
};
function photoThumb(pattern, extraClass){
  return `<div class="capture-photo ${extraClass||''}">${PATTERNS[pattern]('var(--accent)')}
    <span style="position:absolute;bottom:8px;left:8px;width:26px;height:26px;border-radius:8px;background:rgba(20,15,10,.45);display:flex;align-items:center;justify-content:center;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
    </span></div>`;
}

/* ---------- Icons ---------- */
const ICON = {
  photo: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  mic: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4"/></svg>`,
  note: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z"/></svg>`,
  clock: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  chevronRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,
  drive: `<svg width="18" height="18" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg"><path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/><path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/><path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/><path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/><path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/><path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/></svg>`,
  wa: `<svg width="18" height="18" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path fill="#25D366" d="M16 0C7.163 0 0 7.163 0 16c0 2.837.744 5.5 2.04 7.804L0 32l8.412-2.204A15.9 15.9 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0z"/><path fill="#fff" d="M23.3 19.1c-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.6.2-.2.2-.4.3-.6.1-.2 0-.5 0-.7-.1-.2-.9-2.2-1.3-3-.3-.8-.7-.7-.9-.7h-.8c-.2 0-.6.1-.9.5-.3.4-1.2 1.1-1.2 2.7 0 1.6 1.2 3.2 1.4 3.4.2.2 2.4 3.6 5.8 5.1.8.3 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z"/></svg>`,
  camera: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  search: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
};

/* ---------- Dummy data: Projects & captures ---------- */
const projects = [
  {
    id:'p1', name:'Rumah Bu Sari', client:'Bu Sari Wijaya', pattern:'bathroom',
    newCount:5, lastUpdateLabel:'2 jam lalu',
    captures:[
      {id:'p1-c1', type:'photo', tag:'Progres', daysAgo:0, time:'Hari ini, 10.15', pattern:'bathroom', caption:'Pemasangan keramik kamar mandi utama — Roman Griya 30x60 abu muda, sudah 70% selesai.'},
      {id:'p1-c2', type:'voice', tag:'Perlu Tindak Lanjut', daysAgo:0, time:'Hari ini, 09.40', transcript:'Bu, untuk posisi stop kontak di dapur ternyata kepentok kabinet gantung. Perlu digeser 15 cm ke kiri, mohon konfirmasi sebelum tukang lanjut pasang.'},
      {id:'p1-c3', type:'note', tag:'Revisi', daysAgo:1, time:'Kemarin, 16.20', text:'Klien minta warna cat ruang tamu diganti dari abu ke warna gading hangat. Sudah dikonfirmasi ke tukang cat, mulai Senin.'},
      {id:'p1-c4', type:'photo', tag:'Progres', daysAgo:1, time:'Kemarin, 11.05', pattern:'concrete', caption:'Pengecoran lantai 2 selesai, curing 7 hari sebelum lanjut pasang keramik.'},
      {id:'p1-c5', type:'voice', tag:'Progres', daysAgo:3, time:'3 hari lalu, 14.50', transcript:'Update pondasi sudah selesai semua, sekarang masuk tahap pasang bata di lantai 1, insya Allah 2 minggu selesai.'},
      {id:'p1-c6', type:'photo', tag:'Revisi', daysAgo:5, time:'5 hari lalu, 08.30', pattern:'window', caption:'Posisi jendela kamar tidur utama digeser 20 cm sesuai revisi gambar terakhir.'},
      {id:'p1-c7', type:'note', tag:'Perlu Tindak Lanjut', daysAgo:7, time:'1 minggu lalu, 19.10', text:'Perlu tukang listrik tambahan — yang sekarang kewalahan kejar target minggu ini.'},
    ]
  },
  {
    id:'p2', name:'Toko Pak Andi', client:'Pak Andi Kurniawan', pattern:'shelf',
    newCount:2, lastUpdateLabel:'Kemarin',
    captures:[
      {id:'p2-c1', type:'photo', tag:'Progres', daysAgo:1, time:'Kemarin, 17.00', pattern:'shelf', caption:'Rak display etalase depan sudah terpasang, tinggal finishing cat besi.'},
      {id:'p2-c2', type:'note', tag:'Revisi', daysAgo:1, time:'Kemarin, 10.00', text:'Pak Andi minta tambah 1 titik lampu sorot di area kasir.'},
      {id:'p2-c3', type:'voice', tag:'Progres', daysAgo:3, time:'3 hari lalu, 13.20', transcript:'Lantai granit tile 60x60 warna abu tua sudah terpasang semua di area depan toko.'},
      {id:'p2-c4', type:'photo', tag:'Perlu Tindak Lanjut', daysAgo:7, time:'1 minggu lalu, 09.00', pattern:'gutter', caption:'Talang air belakang toko masih rembes, perlu dicek tukang sebelum plafon dipasang.'},
    ]
  },
  {
    id:'p3', name:'Klinik Medika', client:'dr. Ratna Puspita', pattern:'partition',
    newCount:0, lastUpdateLabel:'4 hari lalu',
    captures:[
      {id:'p3-c1', type:'note', tag:'Progres', daysAgo:4, time:'4 hari lalu, 15.40', text:'Pengecatan dinding ruang tunggu selesai, warna hijau sage sesuai brief awal.'},
      {id:'p3-c2', type:'photo', tag:'Progres', daysAgo:7, time:'1 minggu lalu, 11.15', pattern:'partition', caption:'Partisi kaca ruang periksa 1 dan 2 sudah terpasang.'},
      {id:'p3-c3', type:'voice', tag:'Revisi', daysAgo:7, time:'1 minggu lalu, 08.50', transcript:'dr. Ratna minta plafon ruang tunggu pakai gypsum motif kayu, bukan polos putih seperti gambar awal.'},
    ]
  },
];

const TAG_TONE = {'Progres':'tone-progres','Revisi':'tone-revisi','Perlu Tindak Lanjut':'tone-tindak'};

/* ---------- Dummy data: semantic search ---------- */
const searchEntries = [
  {
    id:'e1', project:'Rumah Bu Sari',
    keywords:['keramik','kamar mandi','bu sari','sari','mandi'],
    answer:'Keramik yang dipakai di kamar mandi utama Rumah Bu Sari adalah Roman Griya ukuran 30x60 warna abu muda, sesuai spesifikasi revisi kedua. Pemasangan sudah berjalan sekitar 70% per laporan tukang terbaru.',
    sources:[
      {type:'whatsapp', project:'Rumah Bu Sari', date:'31 Jul 2026, 10.15', sender:'Pak Wowo (Tukang)',
        before:[{from:'Anda', text:'Piye kamar mandi utama, Pak? Update dong fotonya'}],
        match:{from:'Pak Wowo (Tukang)', text:'Ini pak, keramik Roman Griya 30x60 abu muda sudah kepasang 70%, tinggal bagian shower aja.'},
        after:[{from:'Anda', text:'Siap mantap, lanjut terus ya Pak 🙏'}]},
      {type:'photo', project:'Rumah Bu Sari', date:'31 Jul 2026', pattern:'bathroom',
        caption:'Pemasangan keramik kamar mandi utama — Roman Griya 30x60 abu muda, sudah 70% selesai.'},
      {type:'drive', project:'Rumah Bu Sari', date:'2 Jun 2026', filename:'Spek Material Rumah Bu Sari — Rev 2.pdf',
        excerpt:'Kamar Mandi Utama — Keramik dinding & lantai: Roman Griya, seri Griya Series, ukuran 30x60 cm, warna Light Grey (kode RG-2140).'},
    ]
  },
  {
    id:'e2', project:'Toko Pak Andi',
    keywords:['lantai','toko','andi','granit','material lantai'],
    answer:'Lantai area depan Toko Pak Andi memakai granite tile ukuran 60x60 warna abu tua, dan sudah terpasang menyeluruh sejak 3 hari lalu.',
    sources:[
      {type:'whatsapp', project:'Toko Pak Andi', date:'29 Jul 2026, 13.20', sender:'Bang Ujang (Tukang)',
        before:[{from:'Anda', text:'Lantai depan udah kelar semua Bang?'}],
        match:{from:'Bang Ujang (Tukang)', text:'Udah Kak, lantai granit 60x60 abu tua udah kelar dipasang semua di depan.'},
        after:[{from:'Anda', text:'Oke sip, nanti saya foto buat laporan ya'}]},
      {type:'photo', project:'Toko Pak Andi', date:'29 Jul 2026', pattern:'floor',
        caption:'Lantai granite tile 60x60 abu tua, area depan toko sudah terpasang penuh.'},
    ]
  },
  {
    id:'e3', project:'Klinik Medika',
    keywords:['cat','warna','klinik','medika','dinding','ruang tunggu'],
    answer:'Dinding ruang tunggu Klinik Medika dicat warna hijau sage, pengerjaan selesai 4 hari lalu sesuai brief awal dr. Ratna.',
    sources:[
      {type:'whatsapp', project:'Klinik Medika', date:'28 Jul 2026, 15.40', sender:'Anda',
        before:[{from:'Tim Cat', text:'Bu, ruang tunggu udah kelar dicat semua'}],
        match:{from:'Anda', text:'Update: pengecatan dinding ruang tunggu selesai, warna hijau sage sesuai brief awal.'},
        after:[{from:'Tim Cat', text:'Siap, lanjut ke plafon besok ya'}]},
      {type:'drive', project:'Klinik Medika', date:'15 Jul 2026', filename:'Skema Warna Klinik Medika.pdf',
        excerpt:'Ruang Tunggu — Dinding: cat hijau sage (Nippon Paint, kode Sage Whisper). Plafon: gypsum motif kayu (sesuai revisi).'},
    ]
  },
  {
    id:'e4', project:'Rumah Bu Sari',
    keywords:['jendela','kusen','ukuran jendela','kamar tidur','aluminium'],
    answer:'Jendela kamar tidur utama Rumah Bu Sari memakai kusen aluminium ukuran 120×150 cm. Posisinya sempat digeser 20 cm sesuai revisi gambar terakhir.',
    sources:[
      {type:'photo', project:'Rumah Bu Sari', date:'27 Jul 2026', pattern:'window',
        caption:'Posisi jendela kamar tidur utama digeser 20 cm sesuai revisi gambar terakhir.'},
      {type:'drive', project:'Rumah Bu Sari', date:'20 Jul 2026', filename:'Gambar Kerja Rumah Bu Sari — Rev 3.pdf',
        excerpt:'Kamar Tidur Utama — Jendela: kusen aluminium 120×150 cm, posisi digeser 20 cm ke arah taman sesuai revisi klien.'},
    ]
  },
];

let recentSearches = [
  'Keramik kamar mandi Rumah Bu Sari',
  'Material lantai Toko Pak Andi',
  'Warna cat dinding Klinik Medika',
  'Ukuran jendela kamar tidur Bu Sari',
];

const placeholderExamples = [
  "Coba tanya: “keramik apa yang dipakai di kamar mandi Bu Sari?”",
  "Coba tanya: “material lantai apa di Toko Pak Andi?”",
  "Coba tanya: “warna cat ruang tunggu Klinik Medika apa?”",
  "Coba tanya: “ukuran jendela kamar tidur Rumah Bu Sari?”",
];

/* ---------- Connected sources ---------- */
let connectedSources = [
  {id:'wa', title:'WhatsApp', sub:'Tersambung · disinkron 5 menit lalu', on:true, icon:ICON.wa},
  {id:'drive', title:'Google Drive', sub:'Tersambung · disinkron 1 jam lalu', on:true, icon:ICON.drive},
  {id:'gallery', title:'Galeri Foto', sub:'Belum terhubung', on:false, icon:ICON.camera},
];

/* ---------- State ---------- */
const state = {
  tab:'proyek',
  currentProjectId:null,
  filterTag:'Semua',
  reportRange:'all',
  emptyDemo:false,
  cari:{ scope:null, activeEntry:null, notFound:false, home:true },
};

/* ============================================================
   Render: Proyek — Beranda
   ============================================================ */
function renderProjectList(){
  const wrap = document.getElementById('project-list-wrap');
  if(state.emptyDemo){
    wrap.innerHTML = `
      <div class="empty-state">
        <div class="empty-illustration">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect x="24" y="18" width="56" height="80" rx="10" fill="var(--surface)" stroke="var(--border)" stroke-width="2"/>
            <path d="M34 38h36M34 50h36M34 62h24" stroke="var(--border)" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="82" cy="86" r="22" fill="var(--accent-tint)"/>
            <path d="M73 86l6 6 11-13" stroke="var(--accent-hover)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </div>
        <h2 class="empty-title">Belum ada proyek di sini</h2>
        <p class="empty-sub">NotulArs akan menyusun semua tangkapan lapanganmu secara otomatis, begitu proyek pertama terhubung.</p>
        <div class="empty-steps">
          <div class="empty-step"><span class="empty-step-num">1</span><span class="empty-step-text">Simpan <b>nomor WhatsApp NotulArs</b> ke kontakmu.</span></div>
          <div class="empty-step"><span class="empty-step-num">2</span><span class="empty-step-text">Forward foto, voice note, atau chat dari proyek pertamamu.</span></div>
          <div class="empty-step"><span class="empty-step-num">3</span><span class="empty-step-text">NotulArs otomatis merapikannya di sini — <b>tanpa input manual</b>.</span></div>
        </div>
        <button class="btn btn-primary" onclick="openOnboarding()">Hubungkan Nomor WhatsApp</button>
        <button class="demo-toggle-link" onclick="toggleEmptyDemo()">← Kembali ke proyek contoh</button>
      </div>`;
    return;
  }

  let html = `<div class="section-label">Proyek Aktif</div><div class="project-list">`;
  projects.forEach(p=>{
    html += `
      <button class="project-card card" onclick="openProject('${p.id}')">
        <div class="project-thumb">${photoThumb(p.pattern)}</div>
        <div class="project-card-body">
          <div class="project-card-top">
            <div>
              <div class="project-name">${p.name}</div>
              <div class="project-client">${p.client}</div>
            </div>
          </div>
          <div class="project-meta-row">
            ${p.newCount>0 ? `<span class="badge-new">${p.newCount} tangkapan baru</span>` : ''}
            <span class="time-meta">${ICON.clock} ${p.lastUpdateLabel}</span>
          </div>
        </div>
      </button>`;
  });
  html += `</div>
    <div class="fab-row">
      <button class="fab-card" onclick="openOnboarding()">
        <span class="fab-icon-circle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>
        <span class="fab-card-text">
          <div class="fab-card-title">Hubungkan Nomor WhatsApp Baru</div>
          <div class="fab-card-sub">Mulai menyusun proyek berikutnya</div>
        </span>
      </button>
    </div>
    <button class="demo-toggle-link" onclick="toggleEmptyDemo()">Lihat tampilan tanpa proyek →</button>
  `;
  wrap.innerHTML = html;
}

function toggleEmptyDemo(){
  state.emptyDemo = !state.emptyDemo;
  renderProjectList();
}

/* ============================================================
   Render: Proyek — Timeline
   ============================================================ */
function openProject(id){
  state.currentProjectId = id;
  state.filterTag = 'Semua';
  document.getElementById('app').classList.add('drilled');
  renderTimeline();
  window.scrollTo({top:0});
}
function closeProject(){
  state.currentProjectId = null;
  document.getElementById('app').classList.remove('drilled');
  renderTimeline();
}

function renderTimeline(){
  const shell = document.getElementById('timeline-shell');
  const project = projects.find(p=>p.id===state.currentProjectId);
  if(!project){ shell.classList.add('no-selection'); return; }
  shell.classList.remove('no-selection');

  document.getElementById('tl-project-name').textContent = project.name;
  document.getElementById('tl-project-client').textContent = project.client;

  const tags = ['Semua','Progres','Revisi','Perlu Tindak Lanjut'];
  document.getElementById('tl-filter-chips').innerHTML = tags.map(t=>{
    return `<button class="chip ${t===state.filterTag?'is-active':''} ${t!=='Semua'?TAG_TONE[t]:''}" onclick="setFilterTag('${t}')">${t}</button>`;
  }).join('');

  const items = project.captures.filter(c=> state.filterTag==='Semua' || c.tag===state.filterTag);
  const feed = document.getElementById('tl-feed');
  if(items.length===0){
    feed.innerHTML = `<div class="feed-empty">Belum ada tangkapan dengan tag ini.</div>`;
  } else {
    feed.innerHTML = items.map(renderCaptureCard).join('');
  }

  const ranges = [{k:'7',l:'7 hari'},{k:'30',l:'30 hari'},{k:'all',l:'Semua waktu'}];
  document.getElementById('tl-range-chips').innerHTML = ranges.map(r=>
    `<button class="chip ${state.reportRange===r.k?'is-active':''}" onclick="setReportRange('${r.k}')">${r.l}</button>`
  ).join('');
}

function renderCaptureCard(c){
  const tone = TAG_TONE[c.tag];
  if(c.type==='photo'){
    return `<div class="card capture-card">
      <div class="capture-top-row">
        <span class="capture-type-icon">${ICON.photo}</span>
        <span class="capture-type-label">Foto</span>
        <span class="tag-pill ${tone}" onclick="setFilterTag('${c.tag}')">${c.tag}</span>
      </div>
      ${photoThumb(c.pattern)}
      <div class="capture-caption">${c.caption}</div>
      <div class="capture-time mt-2">${c.time}</div>
    </div>`;
  }
  if(c.type==='voice'){
    return `<div class="card capture-card">
      <div class="capture-top-row">
        <span class="capture-type-icon">${ICON.mic}</span>
        <span class="capture-type-label">Pesan suara · diucapkan</span>
        <span class="tag-pill ${tone}" onclick="setFilterTag('${c.tag}')">${c.tag}</span>
      </div>
      <div class="capture-transcript">“${c.transcript}”</div>
      <div class="capture-time mt-2">${c.time}</div>
    </div>`;
  }
  return `<div class="card capture-card">
    <div class="capture-top-row">
      <span class="capture-type-icon">${ICON.note}</span>
      <span class="capture-type-label">Catatan</span>
      <span class="tag-pill ${tone}" onclick="setFilterTag('${c.tag}')">${c.tag}</span>
    </div>
    <div class="capture-note-text">${c.text}</div>
    <div class="capture-time mt-2">${c.time}</div>
  </div>`;
}

function setFilterTag(tag){
  state.filterTag = (state.filterTag===tag && tag!=='Semua') ? 'Semua' : tag;
  renderTimeline();
}
function setReportRange(r){
  state.reportRange = r;
  renderTimeline();
}

/* ============================================================
   Draf Laporan
   ============================================================ */
const RANGE_DAYS = {'7':7,'30':30,'all':Infinity};
const RANGE_LABEL = {'7':'7 hari terakhir','30':'30 hari terakhir','all':'seluruh waktu'};

function stripPeriod(t){ return t.replace(/\.+\s*$/,''); }

function buildSummary(project, items){
  const photos = items.filter(i=>i.type==='photo').length;
  const voices = items.filter(i=>i.type==='voice').length;
  const notes = items.filter(i=>i.type==='note').length;
  const tindak = items.filter(i=>i.tag==='Perlu Tindak Lanjut');
  const revisi = items.filter(i=>i.tag==='Revisi');

  let s = `Selama ${RANGE_LABEL[state.reportRange]}, ${project.name} mencatat ${items.length} tangkapan baru dari lokasi — ${photos} foto, ${voices} catatan suara, dan ${notes} catatan tertulis. `;

  if(revisi.length){
    s += `Ada ${revisi.length} revisi yang perlu diperhatikan: ${revisi.slice(0,2).map(r=>stripPeriod(captureText(r))).join('; ')}. `;
  }
  if(tindak.length){
    s += `${tindak.length} hal masih menunggu tindak lanjut, salah satunya: ${stripPeriod(captureText(tindak[0]))}. `;
  }
  const latestPhoto = items.find(i=>i.type==='photo');
  if(latestPhoto){
    s += `Progres terbaru di lapangan: ${captureText(latestPhoto)}`;
  }
  return s.trim();
}
function captureText(c){
  return c.type==='photo' ? c.caption : c.type==='voice' ? c.transcript : c.text;
}

function openReport(){
  const project = projects.find(p=>p.id===state.currentProjectId);
  if(!project) return;
  const maxDays = RANGE_DAYS[state.reportRange];
  const items = project.captures.filter(c=>c.daysAgo<=maxDays);

  document.getElementById('report-title').value = `Laporan Progres — ${project.name} (${RANGE_LABEL[state.reportRange]})`;
  document.getElementById('report-summary').innerText = items.length ? buildSummary(project, items) : `Belum ada tangkapan di ${RANGE_LABEL[state.reportRange]}. Coba perluas rentangnya buat bikin laporan.`;

  const photos = items.filter(i=>i.type==='photo');
  const photoWrap = document.getElementById('report-photo-list');
  photoWrap.innerHTML = photos.length ? photos.map(p=>`
    <div class="report-photo-item">
      ${photoThumb(p.pattern)}
      <div class="report-photo-cap" contenteditable="true">${p.caption}</div>
    </div>`).join('') : `<div class="report-empty-note">Tidak ada foto pada rentang ini.</div>`;

  document.getElementById('report-overlay').classList.add('open');
}
function closeReport(){
  document.getElementById('report-overlay').classList.remove('open');
}
function saveReportDraft(){
  closeReport();
  showToast('Draf laporan tersimpan.');
}
function shareToClient(){
  showToast('Menyiapkan PDF laporan…');
  setTimeout(()=>{ closeReport(); showToast('Laporan PDF siap dibagikan.'); }, 1200);
}

/* ============================================================
   Onboarding
   ============================================================ */
let onboardingStep = 1;
function openOnboarding(){
  onboardingStep = 1;
  updateOnboardingStep();
  document.getElementById('onboarding-overlay').classList.add('open');
}
function closeOnboarding(){ document.getElementById('onboarding-overlay').classList.remove('open'); }
function updateOnboardingStep(){
  document.getElementById('ob-step-1').classList.toggle('active', onboardingStep===1);
  document.getElementById('ob-step-2').classList.toggle('active', onboardingStep===2);
  document.getElementById('ob-dot-1').classList.toggle('active', onboardingStep===1);
  document.getElementById('ob-dot-2').classList.toggle('active', onboardingStep===2);
}
function onboardingNext(){ onboardingStep = 2; updateOnboardingStep(); }
function onboardingBack(){ onboardingStep = 1; updateOnboardingStep(); }
function copyBotNumber(){
  const num = '+6281234567890';
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(num).then(()=>showToast('Nomor disalin.')).catch(()=>showToast('Nomor: '+num));
  } else { showToast('Nomor: '+num); }
}
let newProjectAdded = false;
function onboardingFinish(){
  closeOnboarding();
  if(!newProjectAdded){
    projects.unshift({id:'p-new', name:'Proyek Baru', client:'Menunggu informasi…', pattern:'concrete', newCount:0, lastUpdateLabel:'Baru saja', captures:[]});
    newProjectAdded = true;
  }
  state.tab='proyek'; state.currentProjectId=null;
  document.getElementById('app').classList.remove('drilled');
  switchTab('proyek');
  showToast('Nomor WhatsApp terhubung! Mulai forward tangkapan pertamamu.');
}

/* ============================================================
   Tabs
   ============================================================ */
function switchTab(tab){
  state.tab = tab;
  document.querySelectorAll('.tabpanel').forEach(el=> el.classList.toggle('active', el.dataset.tab===tab));
  document.querySelectorAll('.nav-btn').forEach(el=> el.classList.toggle('active', el.dataset.nav===tab));
  if(tab==='cari'){ renderCari(); }
  if(tab==='profil'){ renderProfil(); }
  window.scrollTo({top:0});
}

/* ============================================================
   Cari
   ============================================================ */
let placeholderIdx = 0;
function cyclePlaceholder(){
  const input = document.getElementById('search-input');
  if(document.activeElement===input || input.value) return;
  placeholderIdx = (placeholderIdx+1)%placeholderExamples.length;
  input.setAttribute('placeholder', placeholderExamples[placeholderIdx]);
}

function renderCari(){
  renderScopeRow();
  if(state.cari.home){ renderCariHome(); }
  else if(state.cari.notFound){ renderCariNotFound(); }
  else if(state.cari.activeEntry){ renderCariResults(state.cari.activeEntry); }
}

function renderScopeRow(){
  const wrap = document.getElementById('search-scope-wrap');
  const input = document.getElementById('search-input');
  if(state.cari.scope){
    wrap.innerHTML = `<span class="search-scope-active">Dalam proyek: ${state.cari.scope}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="cursor:pointer" onclick="setScope(null)"><path d="M18 6L6 18M6 6l12 12"/></svg></span>`;
    input.placeholder = `Cari dalam proyek "${state.cari.scope}"...`;
  } else {
    wrap.innerHTML = '';
    input.placeholder = placeholderExamples[placeholderIdx];
  }
}

function renderCariHome(){
  const body = document.getElementById('cari-body');
  body.innerHTML = `
    <div class="cari-home-hero">
      <h1>Tanya apa saja tentang proyekmu</h1>
      <p>NotulArs mencari lewat WhatsApp, Google Drive, dan galeri foto sekaligus — lengkap dengan rujukan ke sumber aslinya.</p>
    </div>
    <div class="cari-section">
      <div class="cari-section-label">Pencarian Terakhir</div>
      <div class="chip-row" id="recent-chip-row"></div>
    </div>
    <div class="cari-section">
      <div class="cari-section-label">Proyek yang Terhubung</div>
      <div class="chip-row" id="project-chip-row"></div>
    </div>
  `;
  document.getElementById('recent-chip-row').innerHTML = recentSearches.map(q=>
    `<button class="chip" onclick="submitSearch(${JSON.stringify(q)})">${q}</button>`
  ).join('');
  document.getElementById('project-chip-row').innerHTML = projects.filter(p=>p.captures.length).map(p=>
    `<button class="chip ${state.cari.scope===p.name?'is-active':''}" onclick="setScope('${p.name.replace(/'/g,"\\'")}')">${p.name}</button>`
  ).join('');
}

function setScope(name){
  state.cari.scope = (state.cari.scope===name) ? null : name;
  renderScopeRow();
  document.getElementById('search-input').focus();
  if(!state.cari.home){ document.getElementById('search-input').value=''; state.cari.home=true; renderCari(); }
}

function scoreEntry(entry, q){
  let score = 0;
  entry.keywords.forEach(k=>{ if(q.includes(k)) score++; });
  return score;
}

function submitSearch(query){
  query = (query||'').trim();
  if(!query) return;
  document.getElementById('search-input').value = query;
  const q = query.toLowerCase();

  let candidates = searchEntries.map(e=>({e, score:scoreEntry(e,q)})).filter(x=>x.score>0);
  if(state.cari.scope){
    candidates = candidates.filter(x=>x.e.project===state.cari.scope);
  }
  candidates.sort((a,b)=>b.score-a.score);

  if(!recentSearches.includes(query)){
    recentSearches.unshift(query);
    recentSearches = recentSearches.slice(0,4);
  }

  state.cari.home = false;
  if(candidates.length){
    state.cari.notFound = false;
    state.cari.activeEntry = candidates[0].e;
  } else {
    state.cari.notFound = true;
    state.cari.activeEntry = null;
  }
  renderCari();
}

function renderCariResults(entry){
  const body = document.getElementById('cari-body');
  body.innerHTML = `
    <div class="results-layout">
      <div class="answer-block card">
        <div class="answer-text">${entry.answer}</div>
        <div class="answer-source-count">Berdasarkan ${entry.sources.length} sumber</div>
      </div>
      <div class="source-list" id="source-list"></div>
    </div>`;
  document.getElementById('source-list').innerHTML = entry.sources.map((s,i)=>renderSourceCard(s,i)).join('');
}

function sourceTitleSub(s){
  if(s.type==='whatsapp') return {title:s.sender, sub:`${s.project} · ${s.date}`, icon:ICON.wa, cls:'type-whatsapp'};
  if(s.type==='photo') return {title:s.caption, sub:`${s.project} · ${s.date}`, icon:ICON.camera, cls:'type-photo'};
  return {title:s.filename, sub:`${s.project} · ${s.date}`, icon:ICON.drive, cls:'type-drive'};
}
function renderSourceCard(s,i){
  const meta = sourceTitleSub(s);
  return `<button class="source-card card" onclick="openSource(${i})">
    <span class="source-icon-box ${meta.cls}">${meta.icon}</span>
    <span class="source-body">
      <div class="source-title">${meta.title}</div>
      <div class="source-sub">${meta.sub}</div>
    </span>
    <span class="source-chevron">${ICON.chevronRight}</span>
  </button>`;
}

function renderCariNotFound(){
  const body = document.getElementById('cari-body');
  body.innerHTML = `
    <div class="not-found card">
      <div class="not-found-icon" style="color:var(--text-3);display:flex;justify-content:center;">${ICON.search}</div>
      <h3>Belum nemu jawaban pasti</h3>
      <p>Coba perluas kata kuncinya, lepas filter proyek, atau pastikan sumber yang relevan sudah terhubung di Profil.</p>
      <div class="row-gap" style="justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="setScope(null)">Lepas filter proyek</button>
        <button class="btn btn-primary" onclick="switchTab('profil')">Cek Sumber Terhubung</button>
      </div>
    </div>`;
}

/* ---------- Source detail overlay ---------- */
function openSource(i){
  const entry = state.cari.activeEntry;
  if(!entry) return;
  const s = entry.sources[i];
  const titleEl = document.getElementById('source-detail-title');
  const bodyEl = document.getElementById('source-detail-body');

  if(s.type==='whatsapp'){
    titleEl.textContent = 'Percakapan WhatsApp';
    bodyEl.innerHTML = `
      <div class="source-detail-project">${s.project} · ${s.date}</div>
      <div class="wa-context">
        ${s.before.map(m=>waCtxRow(m)).join('')}
        ${waCtxRow(s.match, true)}
        ${s.after.map(m=>waCtxRow(m)).join('')}
      </div>`;
  } else if(s.type==='photo'){
    titleEl.textContent = 'Foto Lapangan';
    bodyEl.innerHTML = `
      <div class="source-photo-full">${PATTERNS[s.pattern]('var(--accent)')}</div>
      <div class="capture-caption" style="margin-bottom:12px;">${s.caption}</div>
      <div class="source-meta-row">
        <span class="source-meta-item">${ICON.clock} ${s.date}</span>
        <span class="source-meta-item">${ICON.note} ${s.project}</span>
      </div>`;
  } else {
    titleEl.textContent = 'Dokumen Drive';
    bodyEl.innerHTML = `
      <div class="source-detail-project">${s.project} · ${s.date}</div>
      <div class="drive-doc-preview">
        <div class="drive-doc-name">${ICON.drive} ${s.filename}</div>
        <div class="drive-doc-excerpt">${s.excerpt}</div>
      </div>
      <button class="btn btn-secondary btn-block" onclick="showToast('Ini baru prototipe — versi aslinya nanti bakal buka Google Drive beneran.')">Buka File Asli</button>`;
  }
  document.getElementById('source-overlay').classList.add('open');
}
function waCtxRow(m, isMatch){
  const isSelf = m.from==='Anda';
  return `<div class="wa-ctx-msg ${isMatch?'match':''} ${isSelf?'self':''}">
    <div class="wa-ctx-sender">${m.from}</div>
    <div class="wa-ctx-bubble">${m.text}</div>
  </div>`;
}
function closeSourceOverlay(){ document.getElementById('source-overlay').classList.remove('open'); }

/* ============================================================
   Profil
   ============================================================ */
function renderProfil(){
  const nameEl = document.getElementById('profil-name');
  const emailEl = document.getElementById('profil-email');
  const avatarEl = document.getElementById('profil-avatar');
  if(currentUser){
    nameEl.textContent = currentUser.name || 'Pengguna NotulArs';
    emailEl.textContent = currentUser.email || '';
    if(currentUser.picture){
      avatarEl.innerHTML = `<img src="${currentUser.picture}" alt="${currentUser.name||''}">`;
    }
  }

  const card = document.getElementById('sources-card');
  card.innerHTML = connectedSources.map(s=>`
    <div class="settings-row">
      <span class="settings-icon">${s.icon}</span>
      <span class="settings-body">
        <div class="settings-title">${s.title}</div>
        <div class="settings-sub">${s.sub}</div>
      </span>
      <span class="toggle-switch ${s.on?'on':''}" role="switch" aria-checked="${s.on}" tabindex="0" onclick="toggleSource('${s.id}')" onkeydown="if(event.key===' '||event.key==='Enter'){event.preventDefault();toggleSource('${s.id}')}"></span>
    </div>`).join('');
}
function toggleSource(id){
  const s = connectedSources.find(x=>x.id===id);
  s.on = !s.on;
  s.sub = s.on ? 'Tersambung · disinkron baru saja' : 'Belum terhubung';
  renderProfil();
  showToast(s.on ? `${s.title} terhubung.` : `${s.title} diputus.`);
}

/* ============================================================
   Toast
   ============================================================ */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 2400);
}

/* ============================================================
   Init
   ============================================================ */
document.addEventListener('DOMContentLoaded', ()=>{
  renderProjectList();
  renderTimeline();
  setInterval(cyclePlaceholder, 3200);
});
