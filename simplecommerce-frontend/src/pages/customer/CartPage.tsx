import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useCart } from "../../contexts/CartContext"
import { getActiveProducts } from "../../api/products"
import { ProductCard } from "../../components/product/ProductCard"
import { CartItemRow } from "../../components/cart/CartItemRow"
import { Button } from "../../components/ui/Button"
import { Spinner } from "../../components/ui/Spinner"
import { EmptyState } from "../../components/ui/EmptyState"
import { MobileBottomNav } from "../../components/layout/MobileBottomNav"
import { formatCurrency } from "../../lib/formatCurrency"
import { extractErrorMessage } from "../../types/apiError"
import { routes } from "../../lib/routes"
import type { ProductListItem } from "../../types/product"

export function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart()
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState<ProductListItem[]>([])
  const [busyItemId, setBusyItemId] = useState<string | null>(null)

  useEffect(() => {
    getActiveProducts()
      .then((data) => setSuggestions(data.slice(0, 4)))
      .catch(() => {})
  }, [])

  const handleQuantityChange = async (cartItemId: string, next: number) => {
    if (next < 1) return
    setBusyItemId(cartItemId)
    try {
      await updateItem(cartItemId, next)
    } catch (err) {
      toast.error(extractErrorMessage(err, "Miktar güncellenemedi."))
    } finally {
      setBusyItemId(null)
    }
  }

  const handleRemove = async (cartItemId: string) => {
    setBusyItemId(cartItemId)
    try {
      await removeItem(cartItemId)
    } catch (err) {
      toast.error(extractErrorMessage(err, "Ürün kaldırılamadı."))
    } finally {
      setBusyItemId(null)
    }
  }

  if (loading && !cart) return <Spinner />

  const items = cart?.items ?? []

  return (
    <main className="mx-auto max-w-[1440px] px-margin-mobile pb-24 pt-12 md:px-margin-desktop md:pb-section-gap">
      <div className="mb-stack-lg border-b border-outline-variant/30 pb-stack-md">
        <h1 className="font-headline-lg text-headline-lg uppercase tracking-widest text-on-surface">
          Seçimleriniz
        </h1>
        <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
          Sepetinizde {items.length} ürün
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="shopping_bag"
          title="Sepetiniz Boş"
          description="Sepetinizde henüz ürün bulunmuyor. Koleksiyonu keşfederek başlayın."
          actionLabel="Alışverişe Başla"
          actionHref={routes.products}
        />
      ) : (
        <div className="grid grid-cols-1 gap-stack-lg lg:grid-cols-12">
          <div className="space-y-stack-md lg:col-span-8">
            {items.map((item) => (
              <CartItemRow
                key={item.cartItemId}
                item={item}
                busy={busyItemId === item.cartItemId}
                onQuantityChange={(next) => handleQuantityChange(item.cartItemId, next)}
                onRemove={() => handleRemove(item.cartItemId)}
              />
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-stack-md border border-outline-variant bg-[#FFFDF9] p-stack-lg">
              <h2 className="mb-stack-md font-headline-lg text-[24px] uppercase tracking-wider text-on-surface">
                Özet
              </h2>
              <div className="space-y-stack-sm">
                <div className="flex justify-between">
                  <span className="font-body-md text-on-surface-variant">Ara Toplam</span>
                  <span className="font-body-md text-on-surface">
                    {formatCurrency(cart?.totalPrice ?? 0)}
                  </span>
                </div>
                <p className="font-body-md text-[13px] text-on-surface-variant">
                  Kargo ücreti ödeme adımında, seçtiğiniz kargo firmasına göre hesaplanır.
                </p>
              </div>
              <div className="space-y-3 pt-stack-md">
                <Button className="w-full" onClick={() => navigate(routes.checkout)}>
                  Ödemeye Geç
                </Button>
                <p className="text-center font-body-md text-[11px] text-on-surface-variant">
                  Devam ederek Kullanım Koşulları ve Gizlilik Politikası'nı kabul etmiş olursunuz.
                </p>
              </div>
              <div className="flex justify-center gap-4 pt-stack-md text-secondary opacity-50 grayscale">
                <span className="material-symbols-outlined">credit_card</span>
                <span className="material-symbols-outlined">payments</span>
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div className="mt-stack-lg bg-surface-container-low/50 p-4">
                <h4 className="mb-2 font-label-sm text-label-sm uppercase">İndirim Kodu</h4>
                <div className="flex border-b border-outline">
                  <input
                    className="flex-1 border-none bg-transparent px-0 py-2 text-sm uppercase focus:ring-0"
                    placeholder="Kodunuzu girin"
                    type="text"
                  />
                  <button
                    type="button"
                    className="font-label-sm text-label-sm uppercase text-primary hover:opacity-70"
                    onClick={() => toast("Bu özellik yakında aktif olacak")}
                  >
                    Uygula
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <section className="mt-section-gap">
          <h2 className="mb-stack-lg text-center font-headline-lg text-headline-lg uppercase tracking-widest text-on-surface">
            Bunlar da İlginizi Çekebilir
          </h2>
          <div className="grid grid-cols-2 gap-gutter md:grid-cols-4">
            {suggestions.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
        </section>
      )}

      <MobileBottomNav />
    </main>
  )
}
