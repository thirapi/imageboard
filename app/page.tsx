import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getBoardList,
  getLatestPosts,
  getRecentImages,
} from "@/lib/actions/home.actions";

export default async function HomePage() {
  const boards = await getBoardList();
  const latestPosts = await getLatestPosts(10);
  const recentImages = await getRecentImages(12);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-balance">Imageboard</h1>
          <p className="text-sm text-muted-foreground">
            Anonymous discussion board
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Boards</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {boards?.map((board) => (
              <Link key={board.id} href={`/${board.code}`}>
                <Card className="hover:border-accent transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-accent font-mono">
                        /{board.code}/
                      </span>
                      <span>{board.name}</span>
                    </CardTitle>
                    <CardDescription className="text-balance">
                      {board.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        {(latestPosts.length > 0 || recentImages.length > 0) && (
          <div className="border-t pt-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Latest Posts */}
              {latestPosts.length > 0 && (
                <section className="lg:col-span-5">
                  <h2 className="text-lg font-semibold mb-3">Latest Posts</h2>

                  <div className="space-y-2">
                    {latestPosts.map((post) => (
                      <Link
                        key={`${post.type}-${post.id}`}
                        href={`/${post.boardCode}/thread/${post.threadId}`}
                        className="block"
                      >
                        <div className="border rounded-md p-3 hover:border-accent transition-colors max-w-xl">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">
                                {post.title || (
                                  <span className="text-muted-foreground">
                                    Reply
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {post.excerpt}
                              </p>
                            </div>

                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              /{post.boardCode}/
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Recent Images */}
              {recentImages.length > 0 && (
                <section className="lg:col-span-7">
                  <h2 className="text-lg font-semibold mb-3">Recent Images</h2>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {recentImages.map((image) => (
                      <Link
                        key={`${image.id}-${image.imageUrl}`}
                        href={`/${image.boardCode}/thread/${image.threadId}`}
                      >
                        <div className="aspect-square overflow-hidden rounded-md border hover:border-accent transition-colors">
                          <img
                            src={image.imageUrl || "/placeholder.svg"}
                            alt="Recent upload"
                            className="w-full h-full object-cover"
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
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Please read the rules before posting</p>
          <p className="mt-2">
            All posts are anonymous unless a name is provided
          </p>
        </div>
      </footer>
    </div>
  );
}
