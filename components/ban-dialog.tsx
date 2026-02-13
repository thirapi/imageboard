"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ban } from "lucide-react";
import { banUser } from "@/lib/actions/moderation.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface BanDialogProps {
  ipAddress: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BanDialog({ ipAddress, isOpen, onOpenChange }: BanDialogProps) {
  const [reason, setReason] = useState("Spam/Melanggar Aturan");
  const [duration, setDuration] = useState("24");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleBan() {
    setIsProcessing(true);
    try {
      const durationHours = duration ? Number.parseInt(duration) : undefined;
      const result = await banUser(ipAddress, reason, durationHours);

      if (result.success) {
        toast({
          title: "Berhasil",
          description: `IP ${ipAddress} telah diblokir.`,
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast({
          title: "Gagal",
          description: result.error || "Gagal memblokir IP",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan saat mencoba memblokir IP",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Ban className="h-5 w-5" />
            Blokir Alamat IP
          </DialogTitle>
          <DialogDescription>
            Tindakan ini akan mencegah pengguna dengan IP{" "}
            <strong>{ipAddress}</strong> untuk memposting konten baru.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Alasan Pemblokiran</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Spam berulang"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="duration">Durasi (Jam)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Kosongkan untuk permanen"
            />
            <p className="text-[10px] text-muted-foreground">
              * Biarkan kosong atau isi 0 untuk pemblokiran permanen.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleBan}
            disabled={isProcessing}
          >
            {isProcessing ? "Memproses..." : "Konfirmasi Blokir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
