import { cn } from "@/lib/utils";

interface TripcodeDisplayProps {
  author: string;
  className?: string;
  hideTrip?: boolean;
}

export function TripcodeDisplay({ author, className, hideTrip }: TripcodeDisplayProps) {
  if (!author.includes(" !")) {
    return <span className={className}>{author}</span>;
  }

  const [name, trip] = author.split(" !");

  if (hideTrip) {
    return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      <span className="font-bold">{name}</span>
    </span>
    )
  }

  return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      <span className="font-bold">{name}</span>
      <span className="text-[0.85em] font-mono font-normal opacity-90 brightness-90">
        !{trip}
      </span>
    </span>
  );
}
