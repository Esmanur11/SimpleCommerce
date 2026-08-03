import { QuantityStepper } from "../ui/QuantityStepper"
import { ProductImagePlaceholder } from "../product/ProductImagePlaceholder"
import { formatCurrency } from "../../lib/formatCurrency"
import type { CartItemView } from "../../types/cart"

interface CartItemRowProps {
  item: CartItemView
  busy: boolean
  onQuantityChange: (next: number) => void
  onRemove: () => void
}

export function CartItemRow({ item, busy, onQuantityChange, onRemove }: CartItemRowProps) {
  return (
    <div className="flex flex-col gap-gutter border border-outline-variant bg-surface-container-lowest p-stack-md transition-all hover:border-primary/30 md:flex-row">
      <div className="aspect-[3/4] w-full flex-shrink-0 overflow-hidden bg-surface-container md:w-32">
        {item.imageUrl ? (
          <img
            className="h-full w-full object-cover"
            src={item.imageUrl}
            alt={item.productName}
          />
        ) : (
          <ProductImagePlaceholder />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between">
          <h3 className="font-title-md text-title-md uppercase tracking-wider text-on-surface">
            {item.productName}
          </h3>
          <button
            type="button"
            className="text-on-surface-variant transition-colors hover:text-error disabled:opacity-40"
            onClick={onRemove}
            disabled={busy}
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
        <div className="mt-stack-md grid grid-cols-2 items-end gap-stack-md md:grid-cols-4">
          <div>
            <span className="mb-1 block font-label-sm text-label-sm uppercase">Beden</span>
            <span className="font-body-md text-body-md">{item.size}</span>
          </div>
          <div>
            <span className="mb-1 block font-label-sm text-label-sm uppercase">Renk</span>
            <span className="font-body-md text-body-md">{item.color}</span>
          </div>
          <div>
            <span className="mb-1 block font-label-sm text-label-sm uppercase">Adet</span>
            <QuantityStepper
              quantity={item.quantity}
              disabled={busy}
              onIncrease={() => onQuantityChange(item.quantity + 1)}
              onDecrease={() => onQuantityChange(item.quantity - 1)}
            />
          </div>
          <div className="text-right md:text-left">
            <span className="mb-1 block font-label-sm text-label-sm uppercase">Fiyat</span>
            <span className="font-body-md text-body-md font-semibold text-primary">
              {formatCurrency(item.lineTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
