type BadgeVariant = "new" | "limited" | "soldout" | "delivered" | "transit" | "cancelled"

const variantClasses: Record<BadgeVariant, string> = {
  new: "bg-secondary text-white",
  limited: "bg-secondary text-white",
  soldout: "bg-on-surface/80 text-white",
  delivered: "bg-surface-container-highest text-secondary",
  transit: "bg-primary-container/20 text-primary",
  cancelled: "bg-error-container text-on-error-container",
}

export function Badge({
  variant,
  children,
  className = "",
}: {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`px-2 py-0.5 font-label-sm text-[10px] uppercase tracking-wider ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
