export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-section-gap ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
    </div>
  )
}
