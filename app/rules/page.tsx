export default function RulesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 text-center border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-accent mb-2">
            Peraturan & Ketentuan
          </h1>
          <p className="text-sm text-muted-foreground">
            Harap dibaca sebelum memposting
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-1 max-w-4xl">
        <div className="space-y-8">
          {/* Global Rules */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-accent border-b pb-2">
              Peraturan Global
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">1.</span>
                <p>
                  Anda harus berusia <strong>18 tahun atau lebih</strong> untuk
                  mengakses dan memposting di imageboard ini.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">2.</span>
                <p>
                  <strong>Dilarang keras</strong> memposting konten ilegal
                  menurut hukum Indonesia, termasuk namun tidak terbatas pada:
                  pornografi anak, terorisme, narkoba, dan ujaran kebencian yang
                  melanggar hukum.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">3.</span>
                <p>
                  Dilarang melakukan <strong>spam, flood, atau raid</strong>.
                  Posting yang berulang-ulang dengan konten sama akan dihapus.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">4.</span>
                <p>
                  Dilarang memposting informasi pribadi (doxxing) orang lain
                  tanpa izin, termasuk alamat, nomor telepon, atau data sensitif
                  lainnya.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">5.</span>
                <p>
                  Hormati privasi pengguna lain. Jangan mencoba mengidentifikasi
                  pengguna anonim atau melakukan tracking.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">6.</span>
                <p>
                  Posting di board yang sesuai. Baca deskripsi board sebelum
                  memposting untuk memastikan topik Anda relevan.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">7.</span>
                <p>
                  Moderator dan admin memiliki keputusan akhir. Keputusan mereka
                  bersifat final dan tidak dapat diganggu gugat.
                </p>
              </div>
            </div>
          </section>

          {/* Board-Specific Guidelines */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-accent border-b pb-2">
              Panduan Posting
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">•</span>
                <p>
                  <strong>Gunakan nama hanya jika diperlukan.</strong>{" "}
                  Imageboard ini menghargai anonimitas. Tripcode tersedia jika
                  Anda perlu membuktikan identitas di thread tertentu.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">•</span>
                <p>
                  <strong>Jangan meminta spoonfeeding.</strong> Lakukan riset
                  dasar sebelum bertanya. Gunakan mesin pencari.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">•</span>
                <p>
                  <strong>Jangan feed the trolls.</strong> Abaikan posting yang
                  jelas-jelas mencari perhatian atau provokasi.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">•</span>
                <p>
                  <strong>Gunakan spoiler untuk konten sensitif.</strong>{" "}
                  Format:{" "}
                  <code className="bg-muted px-1 rounded">
                    [spoiler]teks[/spoiler]
                  </code>
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">•</span>
                <p>
                  <strong>Greentext untuk quote atau cerita.</strong> Awali
                  baris dengan{" "}
                  <code className="bg-muted px-1 rounded">&gt;</code> untuk
                  greentext.
                </p>
              </div>
            </div>
          </section>

          {/* Content Policy */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-accent border-b pb-2">
              Kebijakan Konten
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">•</span>
                <p>
                  <strong>NSFW/NSFL harus diberi warning.</strong> Konten dewasa
                  atau mengganggu harus diberi label yang jelas.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">•</span>
                <p>
                  <strong>Ukuran file maksimal: 5MB.</strong> Format yang
                  didukung: JPG, PNG, GIF, WebP.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-accent min-w-[2rem]">•</span>
                <p>
                  <strong>Dilarang repost berlebihan.</strong> Cek thread yang
                  sudah ada sebelum membuat thread baru dengan topik sama.
                </p>
              </div>
            </div>
          </section>

          {/* Moderation */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-accent border-b pb-2">
              Moderasi & Sanksi
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>Pelanggaran terhadap peraturan dapat mengakibatkan:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Penghapusan post atau thread</li>
                <li>Warning dari moderator</li>
                <li>Ban sementara (beberapa jam hingga beberapa hari)</li>
                <li>Ban permanen untuk pelanggaran berat atau berulang</li>
              </ul>
              <p className="mt-4 text-muted-foreground italic">
                Moderator berhak menghapus konten yang dianggap tidak pantas
                meskipun tidak secara eksplisit melanggar peraturan.
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-4 text-accent">Disclaimer</h2>
            <div className="text-sm leading-relaxed space-y-3 text-muted-foreground">
              <p>
                Semua posting di imageboard ini adalah tanggung jawab pengguna
                yang memposting. Kami tidak bertanggung jawab atas konten yang
                diposting oleh pengguna.
              </p>
              <p>
                Konten yang diposting tidak mencerminkan pandangan atau opini
                dari operator imageboard ini.
              </p>
              <p>
                Dengan menggunakan imageboard ini, Anda menyetujui bahwa Anda
                telah membaca, memahami, dan menyetujui untuk mematuhi semua
                peraturan yang tercantum di halaman ini.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t py-6 bg-muted/10 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Terakhir diperbarui: Februari 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
