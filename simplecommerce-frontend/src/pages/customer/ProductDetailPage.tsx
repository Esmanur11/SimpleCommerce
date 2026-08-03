import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { getProductDetail } from "../../api/products"
import { addFavorite, getFavorites, removeFavorite } from "../../api/favorites"
import { useCart } from "../../contexts/CartContext"
import { useCustomerAuth } from "../../contexts/CustomerAuthContext"
import { AccordionItem } from "../../components/ui/Accordion"
import { ProductImagePlaceholder } from "../../components/product/ProductImagePlaceholder"
import { Button } from "../../components/ui/Button"
import { Spinner } from "../../components/ui/Spinner"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import { formatCurrency } from "../../lib/formatCurrency"
import { routes } from "../../lib/routes"
import type { ProductDetail } from "../../types/product"

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { auth } = useCustomerAuth()
  const { addItem } = useCart()

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [openAccordion, setOpenAccordion] = useState<"care" | "shipping" | null>(null)
  const [adding, setAdding] = useState(false)

  const [favoriteId, setFavoriteId] = useState<string | null>(null)
  const [favoriteBusy, setFavoriteBusy] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getProductDetail(id)
      .then((data) => {
        setProduct(data)
        const firstInStock = data.variants.find((v) => v.stockQuantity > 0) ?? data.variants[0]
        setSelectedSize(firstInStock?.size ?? null)
        setSelectedColor(firstInStock?.color ?? null)
      })
      .catch((err) => setError(extractErrorMessage(err, "Ürün bulunamadı.")))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!auth?.customerId || !id) return
    getFavorites(auth.customerId)
      .then((favorites) => {
        const match = favorites.find((f) => f.productId === id)
        setFavoriteId(match?.favoriteId ?? null)
      })
      .catch(() => {})
  }, [auth?.customerId, id])

  const sizes = useMemo(
    () => Array.from(new Set(product?.variants.map((v) => v.size) ?? [])),
    [product],
  )
  const colors = useMemo(
    () => Array.from(new Set(product?.variants.map((v) => v.color) ?? [])),
    [product],
  )

  const stockForSize = (size: string) =>
    product?.variants
      .filter((v) => v.size === size)
      .reduce((sum, v) => sum + v.stockQuantity, 0) ?? 0

  const stockForColor = (color: string) =>
    product?.variants
      .filter((v) => v.color === color)
      .reduce((sum, v) => sum + v.stockQuantity, 0) ?? 0

  const selectedVariant = product?.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  )

  const handleAddToBag = async () => {
    if (!auth) {
      toast.error("Sepete eklemek için giriş yapmalısınız")
      navigate(routes.login, { state: { from: { pathname: `/urunler/${id}` } } })
      return
    }
    if (!selectedVariant || selectedVariant.stockQuantity <= 0) return
    setAdding(true)
    try {
      await addItem(selectedVariant.variantId, 1)
      toast.success("Ürün sepete eklendi")
    } catch (err) {
      toast.error(extractErrorMessage(err, "Sepete eklenemedi."))
    } finally {
      setAdding(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!auth) {
      toast.error("Favorilere eklemek için giriş yapmalısınız")
      navigate(routes.login)
      return
    }
    if (!id) return
    setFavoriteBusy(true)
    try {
      if (favoriteId) {
        await removeFavorite(favoriteId)
        setFavoriteId(null)
      } else {
        await addFavorite({ customerId: auth.customerId, productId: id })
        const favorites = await getFavorites(auth.customerId)
        setFavoriteId(favorites.find((f) => f.productId === id)?.favoriteId ?? null)
      }
    } catch (err) {
      toast.error(extractErrorMessage(err, "İşlem gerçekleştirilemedi."))
    } finally {
      setFavoriteBusy(false)
    }
  }

  if (loading) return <Spinner />
  if (error || !product) return <div className="px-margin-desktop py-section-gap"><ErrorMessage message={error ?? "Ürün bulunamadı."} /></div>

  return (
    <main className="mx-auto max-w-[1440px] px-margin-mobile pb-section-gap pt-12 md:px-margin-desktop">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="aspect-[2/3] overflow-hidden bg-surface-container">
            {product.imageUrl ? (
              <img
                className="h-full w-full object-cover"
                src={product.imageUrl}
                alt={product.name}
              />
            ) : (
              <ProductImagePlaceholder />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-stack-lg lg:col-span-5">
          <header className="flex flex-col gap-2">
            {product.categoryName && (
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                {product.categoryName}
              </p>
            )}
            <h2 className="font-headline-lg text-headline-lg text-on-surface">{product.name}</h2>
            <p className="font-title-md text-title-md text-on-surface-variant">
              {formatCurrency(product.price)}
            </p>
          </header>

          <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
            {product.description}
          </p>

          {colors.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="font-label-sm text-label-sm uppercase text-on-surface">
                Renk: <span className="font-normal text-on-surface-variant">{selectedColor}</span>
              </span>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => {
                  const outOfStock = stockForColor(color) <= 0
                  return (
                    <button
                      key={color}
                      type="button"
                      disabled={outOfStock}
                      onClick={() => setSelectedColor(color)}
                      className={`border py-3 font-body-md text-body-md transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                        selectedColor === color
                          ? "border-primary bg-surface-container font-semibold"
                          : "border-outline-variant bg-surface hover:border-primary"
                      }`}
                    >
                      {color}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="font-label-sm text-label-sm uppercase text-on-surface">Beden</span>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => {
                  const outOfStock = stockForSize(size) <= 0
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(size)}
                      className={`border py-3 font-body-md text-body-md transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                        selectedSize === size
                          ? "border-primary bg-surface-container font-semibold"
                          : "border-outline-variant bg-surface hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-4">
            <Button
              className="flex-1"
              onClick={handleAddToBag}
              disabled={adding || !selectedVariant || selectedVariant.stockQuantity <= 0}
            >
              {!selectedVariant || selectedVariant.stockQuantity <= 0
                ? "Stokta Yok"
                : adding
                  ? "Ekleniyor..."
                  : "Sepete Ekle"}
            </Button>
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={favoriteBusy}
              className="flex h-14 w-14 items-center justify-center border border-[#3E2C23] transition-colors hover:bg-surface-container"
            >
              <span
                className="material-symbols-outlined text-on-surface"
                style={favoriteId ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                favorite
              </span>
            </button>
          </div>

          <div className="mt-8 border-t border-outline-variant/50">
            <AccordionItem
              title="İçerik ve Bakım"
              isOpen={openAccordion === "care"}
              onToggle={() => setOpenAccordion(openAccordion === "care" ? null : "care")}
            >
              Ürün özellikleri ve bakım talimatları için lütfen ürün etiketini inceleyin. Kuru
              temizlemeyi öneririz.
            </AccordionItem>
            <AccordionItem
              title="Kargo ve İade"
              isOpen={openAccordion === "shipping"}
              onToggle={() => setOpenAccordion(openAccordion === "shipping" ? null : "shipping")}
            >
              Siparişleriniz seçtiğiniz kargo yöntemine göre teslim edilir. İadeler teslimattan
              itibaren 14 gün içinde, orijinal etiketleriyle kabul edilir.
            </AccordionItem>
          </div>
        </div>
      </div>
    </main>
  )
}
