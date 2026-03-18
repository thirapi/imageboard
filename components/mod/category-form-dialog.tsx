"use client";

import { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, updateCategory } from "@/lib/actions/category.actions";
import { BoardCategoryEntity } from "@/lib/entities/board.entity";
import { Save } from "lucide-react";

interface CategoryFormDialogProps {
  initialCategory?: BoardCategoryEntity;
  mode: "create" | "edit";
  children: React.ReactNode;
}

export function CategoryFormDialog({ initialCategory, mode, children }: CategoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = mode === "create" ? await createCategory(formData) : await updateCategory(formData);

    if (result.success) {
      setOpen(false);
      setLoading(false);
    } else {
      setError(result.error || `Gagal ${mode === "create" ? "membuat" : "memperbarui"} kategori`);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          {initialCategory && <input type="hidden" name="id" value={initialCategory.id} />}
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "Kategori Baru" : "Edit Kategori"}</DialogTitle>
            <DialogDescription>
              {mode === "create" ? "Tambahkan kategori baru untuk mengelompokkan board." : "Klik simpan perubahan jika sudah selesai memperbarui."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                name="name"
                defaultValue={initialCategory?.name}
                placeholder="Masukkan nama kategori"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
