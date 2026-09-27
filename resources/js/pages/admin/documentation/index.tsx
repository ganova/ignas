import { Head, Link } from '@inertiajs/react';
import {
    BadgeCheck,
    BookOpenText,
    CheckCircle2,
    CircleHelp,
    Film,
    HelpCircle,
    Images,
    LayoutDashboard,
    ListChecks,
    Mail,
    Search,
    Settings,
    Sparkles,
    Tags,
    Wrench,
} from 'lucide-react';
import { useMemo, useState, type ComponentType } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

interface Guide {
    id: string;
    title: string;
    summary: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
    steps: string[];
    fields: string[];
    tip: string;
    warning?: string;
}

const GUIDES: Guide[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        summary: 'Melihat ringkasan konten, status showreel, availability, dan aktivitas terbaru.',
        steps: [
            'Buka Dashboard setelah login.',
            'Periksa jumlah portfolio Published.',
            'Gunakan tombol cepat untuk menambah project, memperbarui showreel, atau kontak.',
            'Klik Lihat Website untuk mengecek hasil publik.',
        ],
        fields: ['Total Portfolio', 'Published', 'Showreel', 'Availability'],
        tip: 'Biasakan membuka website publik setelah melakukan perubahan penting.',
    },
    {
        id: 'portfolio',
        title: 'Portfolio',
        href: '/admin/portfolio',
        icon: Film,
        summary: 'Menambah, mengedit, menerbitkan, menampilkan video, thumbnail, dan featured work.',
        steps: [
            'Klik Portfolio → Tambah Project.',
            'Isi Judul lalu pilih sumber video: link atau upload.',
            'Pilih Platform dan Kategori dari master.',
            'Isi durasi, views, deskripsi, dan link eksternal jika ada.',
            'Upload thumbnail; untuk YouTube/Google Drive cover dapat terisi otomatis.',
            'Aktifkan Published. Aktifkan Featured hanya untuk karya terbaik.',
            'Klik Simpan lalu cek hasil di website.',
        ],
        fields: ['Judul', 'Sumber video', 'Platform', 'Kategori', 'Thumbnail', 'Published'],
        tip: 'Google Drive harus dibagikan sebagai “Anyone with the link”. Gunakan thumbnail 9:16 untuk Short-Form dan 16:9 untuk Long-Form.',
        warning:
            'Project Draft tidak tampil. Project baru juga dapat tidak terlihat di homepage jika melewati batas jumlah pada Settings, tetapi tetap ada di Full Archive.',
    },
    {
        id: 'categories',
        title: 'Kategori Portfolio',
        href: '/admin/portfolio-categories',
        icon: Tags,
        summary: 'Menjaga nama kategori Short-Form tetap konsisten dan otomatis membentuk baris showcase.',
        steps: [
            'Buka Kategori Portfolio.',
            'Tambahkan kategori seperti Talking Head, Review, Event, Promo Brand, atau Recipe.',
            'Gunakan Edit untuk mengganti nama; project terkait ikut diperbarui.',
            'Kembali ke form Portfolio dan pilih kategori dari dropdown.',
        ],
        fields: ['Nama kategori', 'Tambah', 'Edit', 'Hapus'],
        tip: 'Gunakan kategori berdasarkan tipe konten, bukan nama klien.',
        warning:
            'Kategori yang masih digunakan project tidak dapat dihapus. Pindahkan project ke kategori lain terlebih dahulu.',
    },
    {
        id: 'photos',
        title: 'Galeri Foto',
        href: '/admin/photos',
        icon: Images,
        summary: 'Menambahkan portfolio foto kecil yang tampil sebagai galeri visual di homepage.',
        steps: [
            'Buka Galeri Foto dari menu admin.',
            'Klik area upload lalu pilih foto JPG, PNG, WebP, atau AVIF.',
            'Isi judul dan caption singkat.',
            'Aktifkan Tampil lalu klik Tambah.',
            'Seret foto untuk mengatur urutan dan gunakan Simpan setelah mengedit.',
            'Klik Lihat Website untuk memeriksa galeri dan tampilan lightbox.',
        ],
        fields: ['Foto', 'Judul', 'Caption', 'Tampil', 'Urutan'],
        tip: 'Gunakan foto dengan kualitas baik dan ukuran file yang sudah dikompresi. Campuran foto portrait dan landscape tetap ditampilkan rapi.',
        warning: 'Foto yang tidak diaktifkan sebagai Tampil hanya tersimpan di admin dan tidak muncul di website.',
    },
    {
        id: 'services',
        title: 'Layanan',
        href: '/admin/services',
        icon: Sparkles,
        summary: 'Mengelola layanan yang ditawarkan pada halaman utama.',
        steps: [
            'Buka Layanan.',
            'Tambah judul dan deskripsi capability.',
            'Aktifkan Published.',
            'Atur urutan dengan drag handle.',
            'Simpan dan cek section Services di website.',
        ],
        fields: ['Judul layanan', 'Deskripsi', 'Published', 'Urutan'],
        tip: 'Jelaskan hasil yang diterima klien, bukan hanya nama software atau teknik.',
    },
    {
        id: 'process',
        title: 'Proses',
        href: '/admin/process',
        icon: ListChecks,
        summary: 'Mengatur tahapan workflow produksi dari brief sampai delivery.',
        steps: [
            'Buka Proses.',
            'Isi nomor, label, judul, dan penjelasan setiap tahap.',
            'Susun urutan: Brief → Assembly → Polish → Delivery.',
            'Aktifkan Published dan simpan.',
        ],
        fields: ['Nomor', 'Label', 'Judul', 'Deskripsi'],
        tip: 'Gunakan empat sampai enam langkah agar mudah dipahami calon klien.',
    },
    {
        id: 'faq',
        title: 'QnA',
        href: '/admin/faqs',
        icon: HelpCircle,
        summary: 'Mengelola pertanyaan yang sering diajukan calon klien.',
        steps: [
            'Buka QnA.',
            'Tambahkan pertanyaan dan jawaban yang singkat.',
            'Pilih apakah item terbuka secara default.',
            'Aktifkan Published dan atur urutannya.',
        ],
        fields: ['Pertanyaan', 'Jawaban', 'Open default', 'Published'],
        tip: 'Prioritaskan pertanyaan tentang harga, revisi, turnaround, file footage, dan cara pembayaran.',
    },
    {
        id: 'brands',
        title: 'Brand Klien',
        href: '/admin/brands',
        icon: BadgeCheck,
        summary: 'Menampilkan logo brand atau klien sebagai social proof.',
        steps: [
            'Buka Brand Klien.',
            'Isi nama brand.',
            'Upload logo PNG/JPG/WebP dengan ruang kosong seminimal mungkin.',
            'Tambahkan website brand jika tersedia.',
            'Aktifkan Published dan susun urutan.',
        ],
        fields: ['Nama brand', 'Logo', 'Website', 'Published'],
        tip: 'Gunakan logo transparan atau versi monokrom yang tetap terbaca pada background terang.',
        warning:
            'Pastikan memiliki izin untuk menampilkan logo. Section otomatis tidak tampil bila tidak ada brand Published.',
    },
    {
        id: 'software',
        title: 'Software Expertise',
        href: '/admin/tools',
        icon: Wrench,
        summary: 'Menampilkan software dan skill teknis yang benar-benar dikuasai.',
        steps: [
            'Buka Software.',
            'Isi nama software dan kategori, misalnya Editing atau Motion.',
            'Upload ikon jika tersedia.',
            'Aktifkan Published dan susun urutan.',
        ],
        fields: ['Nama software', 'Kategori', 'Ikon', 'Published'],
        tip: 'Tampilkan software yang relevan saja, misalnya Premiere Pro, After Effects, DaVinci Resolve, dan Photoshop.',
    },
    {
        id: 'media',
        title: 'Media',
        href: '/admin/media',
        icon: Images,
        summary: 'Mengelola asset gambar yang digunakan pada bagian publik.',
        steps: [
            'Buka Media.',
            'Pilih jenis atau posisi media.',
            'Upload gambar yang sudah dioptimalkan.',
            'Isi alt text yang menjelaskan isi gambar.',
            'Simpan lalu cek tampilan desktop dan mobile.',
        ],
        fields: ['Jenis media', 'Gambar', 'Alt text', 'Published'],
        tip: 'Gunakan WebP bila memungkinkan dan hindari file gambar yang terlalu besar.',
    },
    {
        id: 'messages',
        title: 'Pesan Masuk',
        href: '/admin/messages',
        icon: Mail,
        summary: 'Membaca pesan dari form kontak website dan menandai statusnya.',
        steps: [
            'Buka Pesan.',
            'Pilih pesan untuk melihat detail pengirim dan kebutuhan project.',
            'Balas melalui email atau WhatsApp yang tersedia.',
            'Tandai sebagai sudah dibaca.',
            'Hapus hanya jika benar-benar tidak dibutuhkan.',
        ],
        fields: ['Nama', 'Kontak', 'Pesan', 'Status'],
        tip: 'Jangan menunda follow-up untuk lead baru. Catat brief penting di tempat kerja utama sebelum menghapus pesan.',
    },
    {
        id: 'settings',
        title: 'Settings & Showreel',
        href: '/admin/settings',
        icon: Settings,
        summary: 'Mengubah identitas, hero, showreel, kontak, CTA, limit portfolio, dan visual brand.',
        steps: [
            'Buka Settings.',
            'Perbarui identitas dan bio pada bagian Identity.',
            'Upload atau ganti Foto profil About Me pada tab Identity.',
            'Atur headline, availability, CTA, dan statistik Hero.',
            'Masukkan showreel hanya jika video final sudah tersedia.',
            'Isi WhatsApp, email, dan social links.',
            'Atur jumlah Short-Form dan Long-Form di homepage.',
            'Klik Simpan lalu cek website.',
        ],
        fields: ['Identity & foto profil', 'Hero', 'Showreel', 'Contact', 'Portfolio limit', 'Visual'],
        tip: 'Nomor WhatsApp ditulis dengan kode negara, misalnya 62812…, tanpa tanda + atau spasi.',
        warning: 'Jangan membuat klaim statistik, views, atau jumlah klien yang tidak dapat dibuktikan.',
    },
    {
        id: 'seo',
        title: 'SEO',
        href: '/admin/seo',
        icon: Search,
        summary: 'Mengatur judul situs, deskripsi pencarian, Open Graph, dan indexing.',
        steps: [
            'Buka SEO.',
            'Isi site title dan meta description yang menggambarkan jasa utama.',
            'Upload OG image untuk preview saat link dibagikan.',
            'Aktifkan indexing hanya ketika website dan seluruh konten siap.',
            'Simpan lalu cek preview saat link dibagikan.',
        ],
        fields: ['Site title', 'Meta description', 'OG image', 'Indexing'],
        tip: 'Judul ideal sekitar 50–60 karakter dan deskripsi sekitar 140–160 karakter.',
        warning: 'Jangan mematikan indexing setelah website sudah dipublikasikan kecuali memang diperlukan.',
    },
];

function ScreenPreview({ guide }: { guide: Guide }) {
    return (
        <div className="docs-screen" aria-label={`Ilustrasi tampilan ${guide.title}`}>
            <div className="docs-screen-bar">
                <i />
                <i />
                <i />
                <span>admin / {guide.id}</span>
            </div>
            <div className="docs-screen-body">
                <div className="docs-screen-nav">
                    <strong>Ignas.studio</strong>
                    <span>{guide.title}</span>
                </div>
                <div className="docs-screen-content">
                    <small>MODUL ADMIN</small>
                    <h3>{guide.title}</h3>
                    <div className="docs-screen-fields">
                        {guide.fields.map((field, index) => (
                            <span key={field} className={index === 1 ? 'is-focus' : ''}>
                                {field}
                            </span>
                        ))}
                    </div>
                    <button type="button" tabIndex={-1}>
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DocumentationIndex() {
    const [query, setQuery] = useState('');
    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return GUIDES;
        return GUIDES.filter((guide) =>
            `${guide.title} ${guide.summary} ${guide.steps.join(' ')}`.toLowerCase().includes(needle),
        );
    }, [query]);

    return (
        <AdminLayout>
            <Head title="Dokumentasi" />
            <div className="docs-hero admin-card">
                <div>
                    <p className="admin-eyebrow">Use Guide</p>
                    <h1>Panduan Admin Ignas.studio</h1>
                    <p>Petunjuk lengkap mengelola website, dari upload portfolio sampai SEO.</p>
                </div>
                <BookOpenText className="h-14 w-14" aria-hidden="true" />
            </div>

            <div className="docs-search admin-card">
                <Search className="h-4 w-4" aria-hidden="true" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari tutorial, misalnya thumbnail atau WhatsApp…"
                    aria-label="Cari dokumentasi"
                />
            </div>

            <div className="docs-layout">
                <nav className="docs-toc admin-card" aria-label="Daftar dokumentasi">
                    <strong>Daftar modul</strong>
                    {GUIDES.map((guide) => (
                        <a key={guide.id} href={`#guide-${guide.id}`}>
                            {guide.title}
                        </a>
                    ))}
                </nav>

                <div className="docs-guides">
                    {filtered.map((guide, guideIndex) => {
                        const Icon = guide.icon;
                        return (
                            <article className="docs-guide admin-card" id={`guide-${guide.id}`} key={guide.id}>
                                <header>
                                    <span className="docs-guide-number">{String(guideIndex + 1).padStart(2, '0')}</span>
                                    <span className="docs-guide-icon">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <h2>{guide.title}</h2>
                                        <p>{guide.summary}</p>
                                    </div>
                                    <Link href={guide.href}>Buka modul →</Link>
                                </header>
                                <ScreenPreview guide={guide} />
                                <ol>
                                    {guide.steps.map((step, index) => (
                                        <li key={step}>
                                            <span>{index + 1}</span>
                                            <p>{step}</p>
                                        </li>
                                    ))}
                                </ol>
                                <div className="docs-tip">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <p>
                                        <strong>Tips</strong>
                                        {guide.tip}
                                    </p>
                                </div>
                                {guide.warning && (
                                    <div className="docs-warning">
                                        <CircleHelp className="h-5 w-5" />
                                        <p>
                                            <strong>Perhatikan</strong>
                                            {guide.warning}
                                        </p>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="admin-card p-8 text-center">
                            <CircleHelp className="mx-auto mb-3 h-7 w-7" />
                            <h2 className="font-bold">Tutorial tidak ditemukan</h2>
                            <p className="mt-1 text-sm text-[var(--color-ink-2)]">
                                Coba gunakan kata kunci yang lebih singkat.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
