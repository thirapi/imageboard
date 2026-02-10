"use client";

interface ImageMetadataDisplayProps {
  metadataString?: string | null;
}

export function ImageMetadataDisplay({
  metadataString,
}: ImageMetadataDisplayProps) {
  if (!metadataString) return null;

  try {
    const metadata = JSON.parse(metadataString);
    const { width, height, format, bytes, originalName } = metadata;
    const sizeInKB = (bytes / 1024).toFixed(1);

    return (
      <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-2 font-mono">
        <span className="truncate max-w-[150px]" title={originalName}>
          {originalName}
        </span>
        <span>
          ({sizeInKB} KB, {width}x{height}, {format.toUpperCase()})
        </span>
      </div>
    );
  } catch (e) {
    return null;
  }
}
