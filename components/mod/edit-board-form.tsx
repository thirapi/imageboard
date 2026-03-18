"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateBoard, deleteBoard } from "@/lib/actions/board.actions";
import { BoardEntity } from "@/lib/entities/board.entity";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function EditBoardForm({ initialBoard }: { initialBoard: BoardEntity }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateBoard(formData);

    if (result.success) {
      router.push("/mod/boards");
    } else {
      setError(result.error || "Gagal memperbarui board");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteBoard(initialBoard.id);
    if (result.success) {
      router.push("/mod/boards");
    } else {
      setError(result.error || "Gagal menghapus board");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/mod/boards">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-accent">
            Edit /{initialBoard.code}/
          </h1>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Hapus Board
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda sangat yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Menghapus board{" "}
                <strong>/{initialBoard.code}/</strong> akan menghapus secara permanen
                semua thread dan balasan di dalamnya dari database kita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Menghapus..." : "Ya, Hapus Semuanya"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={initialBoard.id} />
        <Card className="border-accent/10">
          <CardHeader>
            <CardTitle>Rincian Board</CardTitle>
            <CardDescription>
              Perbarui identitas board. Berhati-hatilah saat mengubah kode slug karena akan memengaruhi URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Kode Slug</Label>
              <Input
                id="code"
                name="code"
                defaultValue={initialBoard.code}
                required
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Board</Label>
              <Input
                id="name"
                name="name"
                defaultValue={initialBoard.name}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={initialBoard.description || ""}
                placeholder="Berikan gambaran isi board ini..."
                className="resize-none"
                rows={4}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t pt-6 bg-muted/20">
            <Link href="/mod/boards">
              <Button variant="ghost" type="button" disabled={loading}>
                Batal
              </Button>
            </Link>
            <Button type="submit" className="flex items-center gap-2" disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
