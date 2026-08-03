export function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  disabled,
}: {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex w-fit items-center gap-stack-sm border border-outline-variant px-2 py-1">
      <button
        type="button"
        className="hover:text-primary disabled:opacity-40"
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
      >
        <span className="material-symbols-outlined text-[16px]">remove</span>
      </button>
      <span className="font-body-md text-body-md px-2">{quantity}</span>
      <button
        type="button"
        className="hover:text-primary disabled:opacity-40"
        onClick={onIncrease}
        disabled={disabled}
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
      </button>
    </div>
  )
}
