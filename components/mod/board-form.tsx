"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, AlertCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Trash2 } from "lucide-react";
import { createBoard, updateBoard, deleteBoard } from "@/lib/actions/board.actions";
import { BoardEntity, BoardCategoryEntity } from "@/lib/entities/board.entity";

interface BoardFormProps {
  initialBoard?: BoardEntity;
  categories: BoardCategoryEntity[];
  mode: "create" | "edit";
}

export function BoardForm({ initialBoard, categories, mode }: BoardFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = mode === "create" ? await createBoard(formData) : await updateBoard(formData);

    if (result.success) {
      router.push("/mod/boards");
    } else {
      setError(result.error || `Gagal ${mode === "create" ? "membuat" : "memperbarui"} board`);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialBoard) return;
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
      <div className="flex items-center gap-4">
        <Link href="/mod/boards">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "create" ? "Board Baru" : `Edit /${initialBoard?.code}/`}
        </h1>
        
        {mode === "edit" && initialBoard && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="ml-auto flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Board /{initialBoard.code}/?</AlertDialogTitle>
                <AlertDialogDescription>
                    Tindakan ini permanen. Semua thread dan post akan dihapus.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {initialBoard && <input type="hidden" name="id" value={initialBoard.id} />}
        <Card>
          <CardHeader>
            <CardTitle>Rincian Board</CardTitle>
            <CardDescription>
              {mode === "create"
                ? "Tentukan identitas unik untuk board baru ini."
                : "Perbarui identitas board. Berhati-hatilah saat mengubah kode slug."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Kode Slug (e.g. "b", "tech", "art")</Label>
              <Input
                id="code"
                name="code"
                defaultValue={initialBoard?.code}
                placeholder="Hanya huruf kecil dan angka"
                required
                maxLength={10}
              />
              <p className="text-[10px] text-muted-foreground">
                Maksimal 10 karakter. Hanya huruf kecil (a-z) dan angka (0-9).
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Board</Label>
              <Input
                id="name"
                name="name"
                defaultValue={initialBoard?.name}
                placeholder="Nama Lengkap Board"
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Kategori</Label>
              <Select name="categoryId" defaultValue={initialBoard?.categoryId?.toString() || "none"}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : null}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={initialBoard?.description || ""}
                placeholder="Berikan gambaran isi board ini..."
                className="resize-none"
                rows={4}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
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
              {loading ? "Menyimpan..." : mode === "create" ? "Simpan Board" : "Simpan Perubahan"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
