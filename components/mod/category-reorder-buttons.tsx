"use client";

import { useTransition } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reorderCategoryUp, reorderCategoryDown } from "@/lib/actions/category.actions";
import { toast } from "sonner";

interface CategoryReorderButtonsProps {
  categoryId: number;
  isFirst: boolean;
  isLast: boolean;
}

export function CategoryReorderButtons({ categoryId, isFirst, isLast }: CategoryReorderButtonsProps) {
  const [isPending, startTransition] = useTransition();

  const handleReorder = (direction: 'up' | 'down') => {
    const promise = new Promise(async (resolve, reject) => {
      startTransition(async () => {
        try {
          const action = direction === 'up' ? reorderCategoryUp : reorderCategoryDown;
          const result = await action(categoryId);
          
          if (!result?.success) {
            reject(new Error(result?.error || "Gagal mengubah urutan kategori."));
            return;
          }
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    toast.promise(promise, {
      loading: 'Memindahkan urutan...',
      success: `Berhasil memindahkan kategori ke ${direction === 'up' ? 'atas' : 'bawah'}.`,
      error: (err) => err instanceof Error ? err.message : "Gagal mengubah urutan kategori.",
    });
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        disabled={isFirst || isPending}
        onClick={() => handleReorder('up')}
      >
        <ChevronUp className="h-4 w-4" />
        <span className="sr-only">Pindah ke atas</span>
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        disabled={isLast || isPending}
        onClick={() => handleReorder('down')}
      >
        <ChevronDown className="h-4 w-4" />
        <span className="sr-only">Pindah ke bawah</span>
      </Button>
    </>
  );
}
