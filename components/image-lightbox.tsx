"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState, useRef, useEffect } from "react"

interface ImageLightboxProps {
  src: string
  alt: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageLightbox({ src, alt, open, onOpenChange }: ImageLightboxProps) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const lastTap = useRef(0)
  const touchStart = useRef<{
    x: number
    y: number
    dist: number
    scale: number
    offsetX: number
    offsetY: number
  } | null>(null)

  useEffect(() => {
    if (open) {
      setScale(1)
      setOffset({ x: 0, y: 0 })
      setDragY(0)
    }
  }, [open, src])

  const resetZoom = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const now = Date.now()
    if (e.touches.length === 1) {
      if (now - lastTap.current < 300) {
        scale === 1 ? setScale(2) : resetZoom()
        lastTap.current = 0
      } else {
        lastTap.current = now
      }
    }

    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      touchStart.current = {
        x: 0,
        y: 0,
        dist,
        scale,
        offsetX: offset.x,
        offsetY: offset.y,
      }
    } else if (e.touches.length === 1) {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        dist: 0,
        scale,
        offsetX: offset.x,
        offsetY: offset.y,
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return

    if (e.touches.length === 2 && touchStart.current.dist > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const newScale = Math.max(1, Math.min(5, touchStart.current.scale * (dist / touchStart.current.dist)))
      setScale(newScale)
    } else if (e.touches.length === 1) {
      const touch = e.touches[0]
      const dx = touch.clientX - touchStart.current.x
      const dy = touch.clientY - touchStart.current.y

      if (scale > 1) {
        setOffset({
          x: touchStart.current.offsetX + dx,
          y: touchStart.current.offsetY + dy,
        })
      } else if (dy > 0) {
        setDragY(dy)
        setIsDragging(true)
      }
    }
  }

  const handleTouchEnd = () => {
    if (isDragging) {
      if (dragY > 100) {
        onOpenChange(false)
      } else {
        setDragY(0)
      }
      setIsDragging(false)
    }
    touchStart.current = null
  }

  const handleDoubleClick = () => {
    scale === 1 ? setScale(2) : resetZoom()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden border-0 bg-transparent shadow-none"
      >
        <div
          className="relative w-full h-full flex items-center justify-center bg-black/95 touch-none select-none"
          style={{
            transform: `translateY(${dragY}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className="max-w-full max-h-[95vh] object-contain touch-none"
            style={{
              transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
              transition: scale === 1 && !isDragging ? "transform 0.2s ease-out" : "none",
            }}
            onDoubleClick={handleDoubleClick}
            draggable={false}
          />
          {scale > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full pointer-events-none">
              Zum: {Math.round(scale * 100)}%
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
