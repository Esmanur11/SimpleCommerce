import { Link } from "react-router-dom"
import { formatCurrency } from "../../lib/formatCurrency"
import { routes } from "../../lib/routes"
import { ProductImagePlaceholder } from "./ProductImagePlaceholder"

interface ProductCardProps {
  id: string
  name: string
  price: number
  imageUrl?: string | null
  soldOut?: boolean
  badgeText?: string
  favoriteVariant?: "plain" | "filled-badge" | "none"
  onToggleFavorite?: () => void
  footerSlot?: React.ReactNode
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  soldOut,
  badgeText,
  favoriteVariant = "plain",
  onToggleFavorite,
  footerSlot,
}: ProductCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.()
  }

  return (
    <div className="group relative">
      <Link to={routes.productDetail(id)}>
        <div
          className={`relative mb-stack-sm aspect-[2/3] overflow-hidden bg-surface-container-low ${soldOut ? "grayscale-[0.2]" : ""}`}
        >
          {imageUrl ? (
            <img
              className="h-full w-full object-cover duration-700 group-hover:scale-105"
              src={imageUrl}
              alt={name}
            />
          ) : (
            <ProductImagePlaceholder />
          )}
          {badgeText && !soldOut && (
            <span className="absolute top-4 left-4 bg-secondary px-3 py-1 font-label-sm text-[10px] uppercase tracking-widest text-white">
              {badgeText}
            </span>
          )}
          {soldOut && (
            <span className="absolute inset-0 flex items-center justify-center bg-surface/40">
              <span className="bg-on-surface/80 px-6 py-2 font-label-sm text-[11px] uppercase tracking-widest text-white">
                Tükendi
              </span>
            </span>
          )}
          {favoriteVariant === "plain" && onToggleFavorite && (
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="material-symbols-outlined absolute top-4 right-4 text-on-surface-variant transition-colors group-hover:text-primary"
            >
              favorite
            </button>
          )}
          {favoriteVariant === "filled-badge" && onToggleFavorite && (
            <button
              type="button"
              title="Favorilerden Çıkar"
              onClick={handleFavoriteClick}
              className="absolute top-4 right-4 z-10 bg-surface/50 p-2 text-primary backdrop-blur-sm transition-transform duration-300 hover:scale-110"
            >
              <span className="material-symbols-outlined filled-heart">favorite</span>
            </button>
          )}
        </div>
        <div className="space-y-1 px-1">
          <h4
            className={`font-title-md text-title-md truncate transition-colors ${soldOut ? "text-on-surface-variant" : "text-on-surface group-hover:text-primary"}`}
          >
            {name}
          </h4>
          <p className="font-body-md text-on-surface-variant">{formatCurrency(price)}</p>
        </div>
      </Link>
      {footerSlot}
    </div>
  )
}
