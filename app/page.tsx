import Link from "next/link";
import {
  getBoardList,
  getLatestPosts,
  getRecentImages,
} from "@/lib/actions/home.actions";
import { footerLinks, footerText } from "@/constants/footer";
import { FormattedText } from "@/components/formatted-text";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "62chan",
  description:
    "62chan adalah imageboard Indonesia tempat diskusi bebas tentang berbagai topik mulai dari popkultur, hobi, teknologi, hingga gaya hidup. Berbagi ide dan gambar secara anonim.",
};

export const dynamic = "force-dynamic";

// Group boards by category based on fscchan structure
function groupBoards(boards: any[]) {
  const popkultur = ["wibu", "gim", "sass", "oc", "cb", "med", "rj"];
  const kekinian = [
    "pol",
    "mipa",
    "pew",
    "omni",
    "jas",
    "wang",
    "kul",
    "oto",
    "ac",
    "tre",
  ];
  const bebas = ["b", "dio", "mis", "sjrh", "tlg"];

  return {
    popkultur: boards.filter((b) => popkultur.includes(b.code)),
    kekinian: boards.filter((b) => kekinian.includes(b.code)),
    bebas: boards.filter((b) => bebas.includes(b.code)),
  };
}

export default async function HomePage() {
  const boards = await getBoardList();
  const latestPosts = await getLatestPosts(10);
  const recentImages = await getRecentImages(24);

  const groupedBoards = groupBoards(boards);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Header */}
      <header className="py-8 text-center border-b">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground mb-1">62チャンネル</p>
          <h1 className="text-3xl sm:text-4xl font-bold">
            62<span className="text-accent">chan</span>
          </h1>

          {/* <p className="text-sm text-muted-foreground">
            Autismo Sans Frontières
          </p> */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1 max-w-6xl">
        {/* Board List - 4chan style with columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          {/* Popkultur */}
          {groupedBoards.popkultur.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 text-accent border-b pb-1">
                Popkultur
              </h2>
              <div className="space-y-1 text-sm">
                {groupedBoards.popkultur.map((board) => (
                  <div key={board.id} className="leading-relaxed">
                    <Link
                      href={`/${board.code}`}
                      className="hover:underline hover:text-accent"
                    >
                      <span className="text-accent font-bold">
                        /{board.code}/
                      </span>
                      {" - "}
                      <span className="text-foreground">{board.name}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Kekinian */}
          {groupedBoards.kekinian.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 text-accent border-b pb-1">
                Kekinian
              </h2>
              <div className="space-y-1 text-sm">
                {groupedBoards.kekinian.map((board) => (
                  <div key={board.id} className="leading-relaxed">
                    <Link
                      href={`/${board.code}`}
                      className="hover:underline hover:text-accent"
                    >
                      <span className="text-accent font-bold">
                        /{board.code}/
                      </span>
                      {" - "}
                      <span className="text-foreground">{board.name}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bebas */}
          {groupedBoards.bebas.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3 text-accent border-b pb-1">
                Bebas
              </h2>
              <div className="space-y-1 text-sm">
                {groupedBoards.bebas.map((board) => (
                  <div key={board.id} className="leading-relaxed">
                    <Link
                      href={`/${board.code}`}
                      className="hover:underline hover:text-accent"
                    >
                      <span className="text-accent font-bold">
                        /{board.code}/
                      </span>
                      {" - "}
                      <span className="text-foreground">{board.name}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Activity Section */}
        {(latestPosts.length > 0 || recentImages.length > 0) && (
          <div className="border-t mt-12 pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Latest Posts */}
              {latestPosts.length > 0 && (
                <section className="lg:col-span-5">
                  <h2 className="text-lg font-bold mb-3 text-accent border-b pb-1">
                    Postingan Terbaru
                  </h2>
                  <div className="space-y-2">
                    {latestPosts.map((post) => (
                      <Link
                        key={`${post.type}-${post.id}`}
                        href={`/${post.boardCode}/thread/${post.threadId}`}
                        className="block text-sm hover:bg-accent/5 p-2 rounded transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate text-xs">
                              {post.title || (
                                <span className="text-muted-foreground italic">
                                  {post.type === "thread" ? "Utas" : "Balasan"}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              <FormattedText content={post.excerpt} preview />
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-accent font-bold whitespace-nowrap">
                            /{post.boardCode}/
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Recent Images */}
              {recentImages.length > 0 && (
                <section className="lg:col-span-7">
                  <h2 className="text-lg font-bold mb-3 text-accent border-b pb-1">
                    Gambar Terbaru
                  </h2>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {recentImages.map((image) => (
                      <Link
                        key={`${image.id}-${image.imageUrl}`}
                        href={`/${image.boardCode}/thread/${image.threadId}`}
                        className="group"
                      >
                        <div className="aspect-square overflow-hidden rounded border border-muted/50 hover:border-accent transition-all">
                          <img
                            src={image.imageUrl || "/placeholder.svg"}
                            alt="Recent"
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
                            loading="lazy"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-muted/10 mt-12">
        <div className="container mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-3 text-xs font-mono">
            <Link href="/" className="text-accent hover:underline">
              Home
            </Link>
            {/* <span className="text-muted-foreground">•</span>
            <Link href="/mod" className="text-accent hover:underline">
              Moderasi
            </Link> */}
            <span className="text-muted-foreground">•</span>
            <Link href="/rules" className="text-accent hover:underline">
              Peraturan
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">{footerText}</p>
        </div>
      </footer>
    </div>
  );
}
