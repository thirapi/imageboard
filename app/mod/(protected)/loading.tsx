export default function Loading() {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse p-4">
      <div className="h-8 w-1/3 bg-muted rounded-md" />
      <div className="h-32 w-full bg-muted rounded-md" />
      <div className="h-32 w-full bg-muted rounded-md" />
      <div className="h-32 w-full bg-muted rounded-md" />
    </div>
  );
}
