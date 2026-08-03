export function ProductImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-container-low text-on-surface-variant ${className}`}
    >
      <span className="material-symbols-outlined text-4xl opacity-60">image_not_supported</span>
      <span className="font-label-sm text-[10px] uppercase tracking-widest opacity-60">
        Görsel Yok
      </span>
    </div>
  )
}
