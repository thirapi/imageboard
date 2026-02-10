"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { createThread } from "@/lib/actions/thread.actions";
import { ImageUploader } from "./image-uploader";

interface ThreadFormProps {
  boardId: number;
  boardCode: string;
}

export function ThreadForm({ boardId, boardCode }: ThreadFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("boardId", boardId.toString());
    formData.append("boardCode", boardCode);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const result = await createThread(formData);

      if (result.success && result.threadId) {
        formRef.current?.reset();
        setImageFile(null);
        setResetTrigger((prev) => prev + 1); // Trigger image uploader reset
        setIsOpen(false);
        router.push(`/${boardCode}/thread/${result.threadId}`);
        router.refresh();
      } else {
        setError(result.error || "Gagal membuat thread");
      }
    } catch (error) {
      console.error("Error creating thread:", error);
      setError("Terjadi kesalahan tak terduga");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setImageFile(null);
    setResetTrigger((prev) => prev + 1); // Also reset when closing
    formRef.current?.reset();
  };

  if (!isOpen) {
    return (
      <div className="text-center py-4">
        <button
          onClick={() => setIsOpen(true)}
          className="text-lg font-bold text-accent hover:underline cursor-pointer inline-flex items-center gap-1"
        >
          [ <Plus className="h-5 w-5" /> Mulai Thread Baru ]
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-accent/20 rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-300">
      <div className="bg-accent/5 px-6 py-3 border-b border-accent/10 flex items-center justify-between">
        <span className="font-bold text-sm tracking-wide uppercase text-accent">
          Mode: Posting Thread Baru
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 flex items-center gap-2">
            <X className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="author"
              className="text-xs font-bold uppercase opacity-70"
            >
              Nama
            </Label>
            <Input
              id="author"
              name="author"
              placeholder="Anonim"
              maxLength={100}
              className="bg-muted/30 focus-visible:ring-accent"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="subject"
              className="text-xs font-bold uppercase opacity-70"
            >
              Subjek
            </Label>
            <Input
              id="subject"
              name="subject"
              placeholder="(Opsional)"
              maxLength={200}
              className="bg-muted/30 focus-visible:ring-accent"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="content"
            className="text-xs font-bold uppercase opacity-70"
          >
            Pesan
          </Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Ketik pesan Anda di sini..."
            required
            rows={5}
            className="bg-muted/30 focus-visible:ring-accent resize-y min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-4">
            <ImageUploader
              onImageSelect={setImageFile}
              maxSizeMB={5}
              resetTrigger={resetTrigger}
            />

            <div className="space-y-1.5">
              <Label
                htmlFor="deletionPassword"
                className="text-xs font-bold uppercase opacity-70"
              >
                Sandi Penghapusan
              </Label>
              <Input
                id="deletionPassword"
                name="deletionPassword"
                type="password"
                placeholder="Untuk menghapus nanti"
                maxLength={255}
                className="bg-muted/30 focus-visible:ring-accent h-8 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 font-bold text-base shadow-md group"
            >
              {isSubmitting ? (
                "Mengirim..."
              ) : (
                <>
                  Posting ke /{boardCode}/
                  <Send className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-xs opacity-50 hover:opacity-100"
            >
              Lupakan (Batal)
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
