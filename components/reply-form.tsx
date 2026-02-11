"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, X, Send, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createReply } from "@/lib/actions/reply.actions";
import { getCaptcha } from "@/lib/actions/thread.actions";
import { ImageUploader } from "./image-uploader";
import { useEffect } from "react";

interface ReplyFormProps {
  threadId: number;
  boardCode: string;
}

export function ReplyForm({ threadId, boardCode }: ReplyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const refreshCaptcha = async () => {
    const data = await getCaptcha();
    setCaptchaQuestion(data.question);
  };

  useEffect(() => {
    refreshCaptcha();
  }, [resetTrigger]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("threadId", threadId.toString());
    formData.append("boardCode", boardCode);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const result = await createReply(formData);

      if (result.success) {
        formRef.current?.reset();
        setImageFile(null);
        setError(null);
        setResetTrigger((prev) => prev + 1); // Trigger image uploader reset
        router.refresh();
      } else {
        setError(result.error || "Gagal mengirim balasan");
        refreshCaptcha(); // Refresh captcha on error
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      setError("Terjadi kesalahan tak terduga");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label
              htmlFor="reply-author"
              className="text-[10px] font-bold uppercase opacity-60"
            >
              Nama
            </Label>
            <Input
              id="reply-author"
              name="author"
              placeholder="Anonim"
              maxLength={100}
              className="h-8 text-sm bg-muted/20"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label
              htmlFor="reply-deletionPassword"
              className="text-[10px] font-bold uppercase opacity-60"
            >
              Sandi Penghapusan
            </Label>
            <Input
              id="reply-deletionPassword"
              name="deletionPassword"
              type="password"
              placeholder="(Opsional)"
              maxLength={255}
              className="h-8 text-sm bg-muted/20"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="reply-content"
            className="text-[10px] font-bold uppercase opacity-60"
          >
            Balasan
          </Label>
          <Textarea
            id="reply-content"
            name="content"
            placeholder="Ketik balasan Anda..."
            required
            rows={5}
            className="text-sm bg-muted/20 focus-visible:ring-accent resize-y"
          />
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="reply-captcha"
            className="text-[10px] font-bold uppercase opacity-60"
          >
            Verifikasi: {captchaQuestion}
          </Label>
          <Input
            id="reply-captcha"
            name="captcha"
            placeholder="Jawaban..."
            required
            className="h-8 text-sm bg-muted/20 w-32"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="w-full sm:w-auto">
            <ImageUploader
              onImageSelect={setImageFile}
              maxSizeMB={5}
              resetTrigger={resetTrigger}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-48 h-10 font-bold group"
          >
            {isSubmitting ? (
              "Mengirim..."
            ) : (
              <>
                Kirim Balasan
                <Send className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground italic opacity-50 text-center">
          Tip: Gunakan {`>>NomorPost`} untuk membalas post tertentu.
        </p>
      </form>
    </div>
  );
}
