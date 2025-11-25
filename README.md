# Imageboard

Sebuah platform imageboard anonim yang dibangun dengan Next.js, Drizzle ORM, dan PostgreSQL. Terinspirasi dari imageboard populer, proyek ini bertujuan untuk menyediakan ruang bagi para pengguna untuk berbagi gambar dan berdiskusi secara bebas.

## Tentang Imageboard dan Budayanya di Indonesia

Imageboard adalah jenis forum internet yang berpusat pada gambar. Pengguna dapat memposting gambar dan memberikan komentar secara anonim. Di Indonesia, imageboard telah menjadi bagian dari budaya internet, menawarkan platform untuk diskusi yang tidak terikat pada identitas asli. Keanoniman ini mendorong kebebasan berekspresi, namun juga menuntut tanggung jawab dari para penggunanya untuk menjaga lingkungan yang sehat dan saling menghormati.

## Instalasi

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Prasyarat:**
    *   Node.js (versi 18 atau lebih tinggi)
    *   npm atau yarn

2.  **Clone Repositori:**
    ```bash
    git clone https://github.com/thirapi/imageboard.git
    cd imageboard
    ```

3.  **Instal Dependensi:**
    ```bash
    npm install
    # atau
    yarn install
    ```

## Konfigurasi Lingkungan

Proyek ini memerlukan beberapa variabel lingkungan untuk dapat berjalan dengan baik. Buat file `.env.local` di root direktori proyek dan salin konten dari `.env.example`:

```bash
cp .env.example .env.local
```

Kemudian, isi nilai variabel di `.env.local`:

```
DATABASE_URL="your_postgresql_database_url"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

## Menjalankan Proyek

Setelah instalasi dan konfigurasi selesai, Anda dapat menjalankan server pengembangan:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

### Skrip Lainnya

*   `npm run db:seed`: Mengisi database dengan data awal.
*   `npm run db:reset`: Menghapus semua data dari database.
*   `npm run db:migrate`: Menjalankan migrasi database.
*   `npm run db:generate`: Menghasilkan file migrasi baru.

## Berkontribusi

Kami menyambut kontribusi dari siapa saja. Jika Anda ingin berkontribusi pada proyek ini, silakan:

1.  **Fork repositori ini.**
2.  **Buat branch baru:** `git checkout -b fitur/nama-fitur-anda`
3.  **Lakukan perubahan dan commit:** `git commit -m "feat: Menambahkan fitur baru"`
4.  **Push ke branch Anda:** `git push origin fitur/nama-fitur-anda`
5.  **Buat Pull Request baru.**

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).
