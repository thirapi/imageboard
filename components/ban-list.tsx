"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, ShieldCheck } from "lucide-react";
import { unbanUser, updateBan } from "@/lib/actions/moderation.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Ban {
  id: number;
  ipAddress: string;
  reason: string | null;
  expiresAt: Date | null;
  createdAt: Date;
}

interface BanListProps {
  initialBans: Ban[];
}

export function BanList({ initialBans }: BanListProps) {
  const [bans, setBans] = useState(initialBans);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editBan, setEditBan] = useState<Ban | null>(null);
  const [banToDelete, setBanToDelete] = useState<Ban | null>(null);
  const [editReason, setEditReason] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  async function handleUnban() {
    if (!banToDelete) return;

    setIsProcessing(true);
    try {
      const result = await unbanUser(banToDelete.ipAddress);
      if (result.success) {
        toast({ title: "Berhasil", description: "Cekal telah dihapus." });
        setBanToDelete(null);
        router.refresh();
      } else {
        toast({
          title: "Gagal",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan sistem.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleUpdateBan() {
    if (!editBan) return;

    setIsProcessing(true);
    try {
      const durationHours = editDuration ? Number.parseInt(editDuration) : null;
      const result = await updateBan(editBan.id, editReason, durationHours);
      if (result.success) {
        toast({ title: "Berhasil", description: "Data cekal diperbarui." });
        setEditBan(null);
        router.refresh();
      } else {
        toast({
          title: "Gagal",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan sistem.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  const openEditDialog = (ban: Ban) => {
    setEditBan(ban);
    setEditReason(ban.reason || "");
    setEditDuration(""); // Reset duration input
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Alamat IP</TableHead>
            <TableHead>Alasan</TableHead>
            <TableHead>Berakhir Pada</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialBans.map((ban) => {
            const isExpired =
              ban.expiresAt && new Date(ban.expiresAt) < new Date();
            return (
              <TableRow key={ban.id} className={isExpired ? "opacity-50" : ""}>
                <TableCell className="font-mono font-bold">
                  {ban.ipAddress}
                  {isExpired && (
                    <Badge variant="outline" className="ml-2 text-[10px]">
                      Expired
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {ban.reason || "-"}
                </TableCell>
                <TableCell>
                  {ban.expiresAt ? (
                    <span className="text-xs">
                      {new Date(ban.expiresAt).toLocaleString()}
                    </span>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="bg-red-600/10 text-red-600 border-red-600/20"
                    >
                      Permanen
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(ban.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(ban)}
                    disabled={isProcessing}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setBanToDelete(ban)}
                    disabled={isProcessing}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {initialBans.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground italic"
              >
                Cekal list kosong.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog
        open={!!editBan}
        onOpenChange={(open) => !open && setEditBan(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Cekal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Alamat IP</Label>
              <Input
                value={editBan?.ipAddress}
                disabled
                className="font-mono"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-reason">Alasan</Label>
              <Input
                id="edit-reason"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-duration">Tambah/Atur Durasi (Jam)</Label>
              <Input
                id="edit-duration"
                type="number"
                value={editDuration}
                onChange={(e) => setEditDuration(e.target.value)}
                placeholder="Biarkan kosong untuk tetap permanen/tidak berubah"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBan(null)}>
              Batal
            </Button>
            <Button onClick={handleUpdateBan} disabled={isProcessing}>
              Terapkan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!banToDelete}
        onOpenChange={(open) => !open && setBanToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Cekal IP?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus IP{" "}
              <strong className="font-mono">{banToDelete?.ipAddress}</strong>{" "}
              dari daftar cekal. Pengguna tersebut akan dapat memposting
              kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                handleUnban();
              }}
              disabled={isProcessing}
            >
              {isProcessing ? "Memproses..." : "Hapus Cekal"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
