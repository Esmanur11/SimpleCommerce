export function AccordionItem({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="group border-b border-outline-variant/50">
      <button
        type="button"
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={onToggle}
      >
        <span className="font-label-sm text-label-sm uppercase">{title}</span>
        <span
          className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{ maxHeight: isOpen ? "200px" : "0" }}
      >
        <div className="pb-5 font-body-md text-[14px] text-on-surface-variant">{children}</div>
      </div>
    </div>
  )
}
