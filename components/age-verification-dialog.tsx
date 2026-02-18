"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const AGE_VERIFICATION_KEY = "imageboard_age_verified";

export function AgeVerificationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    // Check if user has already verified
    const hasVerified = localStorage.getItem(AGE_VERIFICATION_KEY);
    if (!hasVerified) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (isAgreed) {
      localStorage.setItem(AGE_VERIFICATION_KEY, "true");
      setIsOpen(false);
    }
  };

  const handleDecline = () => {
    // Redirect to safe page or show message
    window.location.href = "https://www.google.com";
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md max-h-[90dvh] overflow-y-auto"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <DialogTitle className="text-xl">
              Verifikasi Usia & Persetujuan
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm leading-relaxed">
            Sebelum melanjutkan, Anda harus menyetujui ketentuan berikut:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-3 border border-muted">
            <p className="font-semibold mb-2">
              Dengan masuk ke situs ini, Anda menyatakan bahwa:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                Anda berusia <strong>18 tahun atau lebih</strong>.
              </li>
              <li>
                Anda telah membaca dan menyetujui{" "}
                <Link
                  href="/rules"
                  target="_blank"
                  className="text-accent hover:underline"
                >
                  Peraturan & Ketentuan
                </Link>
                .
              </li>
              <li>
                Anda bertanggung jawab penuh atas segala konten yang Anda
                posting.
              </li>
              <li>
                Anda memahami bahwa konten di situs ini bersifat User Generated
                Content (UGC) dan mungkin mengandung materi dewasa/spoiler.
              </li>
            </ul>
          </div>

          {/* Single Agreement Checkbox */}
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors">
            <Checkbox
              id="agree-all"
              checked={isAgreed}
              onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
              className="mt-0.5"
            />
            <label
              htmlFor="agree-all"
              className="text-sm font-medium leading-relaxed cursor-pointer flex-1"
            >
              Saya menyetujui semua poin di atas dan ingin melanjutkan.
            </label>
          </div>

          {/* Warning */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-400">
            <strong>Peringatan:</strong> Konten dipublikasikan oleh pengguna.
            Operator berhak menghapus konten yang melanggar peraturan atau hukum
            yang berlaku.
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="w-full sm:w-auto"
          >
            Saya Tidak Setuju
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!isAgreed}
            className="w-full sm:w-auto"
          >
            Setuju & Lanjutkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
