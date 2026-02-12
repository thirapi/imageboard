"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { deletePost } from "../lib/actions/post.actions";
import { useToast } from "@/hooks/use-toast";

interface DeletePostButtonProps {
  postId: number;
  postType: "thread" | "reply";
  boardCode: string;
}

export function DeletePostButton({
  postId,
  postType,
  boardCode,
}: DeletePostButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    try {
      const result = await deletePost(postId, postType, password);

      if (result.success) {
        setIsOpen(false);
        toast({
          title: "Berhasil dihapus",
          description: "Postingan Anda telah dihapus.",
        });
        if (postType === "thread") {
          router.push(`/${boardCode}`);
        } else {
          router.refresh();
        }
      } else {
        toast({
          title: "Gagal menghapus",
          description: result.error || "Sandi penghapusan salah.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan tak terduga",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <Trash className="h-4 w-4 mr-2" />
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Postingan</DialogTitle>
          <DialogDescription>
            Masukkan sandi penghapusan yang Anda tentukan saat membuat postingan
            ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Sandi Penghapusan</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Masukkan sandi Anda"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Menghapus..." : "Hapus Sekarang"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
