import { Link } from "react-router-dom"

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-section-gap text-center">
      <span
        className="material-symbols-outlined mb-stack-lg text-6xl text-outline-variant"
        style={{ fontVariationSettings: "'wght' 100" }}
      >
        {icon}
      </span>
      <h2 className="font-headline-lg text-headline-lg mb-stack-md text-on-surface">{title}</h2>
      <p className="mb-stack-lg font-body-md text-on-surface-variant">{description}</p>
      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="inline-block bg-primary px-12 py-4 font-label-sm text-label-sm uppercase tracking-widest text-white transition-colors duration-300 hover:bg-on-secondary-container"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
