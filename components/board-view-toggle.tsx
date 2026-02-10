"use client";

import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function BoardViewToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "list";

  const setView = (newView: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newView === "list") {
      params.delete("view");
    } else {
      params.set("view", newView);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
      <Button
        variant={view === "list" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2"
        onClick={() => setView("list")}
      >
        <List className="h-4 w-4 mr-1" />
        Daftar
      </Button>
      <Button
        variant={view === "catalog" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2"
        onClick={() => setView("catalog")}
      >
        <Grid className="h-4 w-4 mr-1" />
        Katalog
      </Button>
    </div>
  );
}
