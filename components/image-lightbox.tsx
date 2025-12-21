"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ImageLightboxProps {
  src: string
  alt: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageLightbox({ src, alt, open, onOpenChange }: ImageLightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center bg-black/95">
          <img src={src || "/placeholder.svg"} alt={alt} className="max-w-full max-h-[90vh] object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
