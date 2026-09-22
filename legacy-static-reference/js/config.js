/* Konfigurasi terpusat: ganti nilai di bawah ini dengan data asli. */
window.SITE_CONFIG = {
  whatsapp: {
    number: "6281234567890", // placeholder — ganti dengan nomor WhatsApp asli
    message: "Halo Ignas, saya mau tanya soal edit video."
  },
  email: "hello@ignas.studio", // placeholder — ganti dengan email asli
  showreelUrl: "", // isi dengan URL video (mp4/YouTube/Vimeo) untuk mengaktifkan tombol play
  availability: "Slot Oktober tersisa 2",
  heroStats: [
    { value: "240+", label: "video selesai" },
    { value: "48", label: "kreator & brand" },
    { value: "2–3 hari", label: "waktu pengerjaan" }
  ],
  portfolio: [
    { title: "Aurora Skincare", platform: "TIKTOK", filter: "tiktok", duration: "00:38", views: "1.2 jt", category: "Commercial", gradient: ["#B9A9FF", "#8FC2FF"], url: "" },
    { title: "Kopi Senja", platform: "IG REELS", filter: "instagram", duration: "00:45", views: "860 rb", category: "Brand Story", gradient: ["#FFD79B", "#FFAECF"], url: "" },
    { title: "“Pulang”", platform: "YOUTUBE", filter: "youtube", duration: "08:12", views: "412 rb", category: "Short Film", gradient: ["#A8E4FF", "#C5B6FF"], url: "" },
    { title: "Nusa Sneakers", platform: "TIKTOK", filter: "tiktok", duration: "00:30", views: "2.4 jt", category: "Reels Series", gradient: ["#FFC9D8", "#C0B4FF"], url: "" },
    { title: "Fintech X", platform: "IG REELS", filter: "instagram", duration: "02:05", views: "530 rb", category: "Explainer", gradient: ["#BFF0DC", "#9EC8FF"], url: "" },
    { title: "Sekolah Alam", platform: "YOUTUBE", filter: "youtube", duration: "03:40", views: "198 rb", category: "Dokumenter", gradient: ["#FFE6A8", "#B5B0FF"], url: "" },
    { title: "Halo Bank", platform: "TIKTOK", filter: "tiktok", duration: "00:52", views: "1.8 jt", category: "Explainer", gradient: ["#C9B6FF", "#8FE8DC"], url: "" },
    { title: "Rasa Nusantara", platform: "IG REELS", filter: "instagram", duration: "00:28", views: "740 rb", category: "Food Series", gradient: ["#FFBFA8", "#FFD9F0"], url: "" }
  ],
  services: [
    { title: "Edit dari footage mentah", desc: "Dari rekaman apa adanya jadi video utuh: struktur, ritme, warna, dan suara." },
    { title: "Potong long form", desc: "Podcast atau webinar panjang dipotong jadi klip pendek siap tayang." },
    { title: "Subtitle & motion text", desc: "Teks bergerak yang rapi, terbaca, dan sesuai gaya brand kamu." },
    { title: "Paket konten bulanan", desc: "Jadwal tetap tiap bulan dengan gaya visual yang konsisten." }
  ],
  process: [
    { step: "LANGKAH 1", title: "Chat WhatsApp", desc: "Ceritakan videonya. Brief santai pun cukup." },
    { step: "LANGKAH 2", title: "Pilih paket", desc: "Saya kasih estimasi waktu dan biaya di depan." },
    { step: "LANGKAH 3", title: "Kirim footage", desc: "Lewat Google Drive. Pengerjaan mulai hari itu juga." },
    { step: "LANGKAH 4", title: "Terima & revisi", desc: "Tiga putaran revisi sudah termasuk." }
  ],
  qna: [
    { q: "Berapa lama pengerjaan satu video?", a: "Konten social media 2–3 hari kerja. Commercial atau company profile 1–2 minggu. Dokumenter pendek 2–4 minggu." },
    { q: "Berapa kali revisi yang saya dapat?", a: "" },
    { q: "Format file apa saja yang saya terima?", a: "" },
    { q: "Apakah menyediakan musik & stock footage?", a: "" },
    { q: "Bagaimana sistem pembayarannya?", a: "" }
  ]
};

window.SITE_CONFIG.whatsappUrl = "https://wa.me/" + window.SITE_CONFIG.whatsapp.number + "?text=" + encodeURIComponent(window.SITE_CONFIG.whatsapp.message);
