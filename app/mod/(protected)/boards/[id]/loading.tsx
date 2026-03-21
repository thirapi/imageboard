export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse p-4">
      <div className="h-10 w-48 bg-muted rounded" />
      <div className="space-y-4">
        <div className="h-12 w-full bg-muted rounded" />
        <div className="h-12 w-full bg-muted rounded" />
        <div className="h-40 w-full bg-muted rounded" />
        <div className="h-12 w-32 bg-muted rounded" />
      </div>
    </div>
  );
}
