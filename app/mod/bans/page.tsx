import Link from "next/link";
import { getBans } from "@/lib/actions/moderation.actions";
import { BanList } from "@/components/ban-list";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShieldX } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BansManagementPage() {
  const bans = await getBans();

  return (
    <div className="min-h-screen pb-20">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/mod">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-2 h-8 px-2 text-muted-foreground"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Kembali
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldX className="h-6 w-6 text-destructive" />
              Manajemen Cekal (Bans)
            </h1>
            <p className="text-sm text-muted-foreground">
              Daftar semua alamat IP yang telah diblokir dari sistem
            </p>
          </div>
        </header>

        <BanList initialBans={bans} />
      </main>
    </div>
  );
}
