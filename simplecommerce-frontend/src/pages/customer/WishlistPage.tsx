import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { getFavorites, removeFavorite } from "../../api/favorites"
import { useCustomerAuth } from "../../contexts/CustomerAuthContext"
import { ProductCard } from "../../components/product/ProductCard"
import { Spinner } from "../../components/ui/Spinner"
import { EmptyState } from "../../components/ui/EmptyState"
import { extractErrorMessage } from "../../types/apiError"
import { routes } from "../../lib/routes"
import type { FavoriteView } from "../../types/favorite"

export function WishlistPage() {
  const { auth } = useCustomerAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState<FavoriteView[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    if (!auth?.customerId) return
    getFavorites(auth.customerId)
      .then(setFavorites)
      .catch((err) => toast.error(extractErrorMessage(err, "Favoriler yüklenemedi.")))
      .finally(() => setLoading(false))
  }, [auth?.customerId])

  const handleRemove = async (favoriteId: string) => {
    setBusyId(favoriteId)
    try {
      await removeFavorite(favoriteId)
      setFavorites((prev) => prev.filter((f) => f.favoriteId !== favoriteId))
    } catch (err) {
      toast.error(extractErrorMessage(err, "Favorilerden kaldırılamadı."))
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <Spinner />

  return (
    <main className="px-margin-mobile pb-section-gap pt-12 md:px-margin-desktop">
      <div className="mx-auto mb-stack-lg flex max-w-7xl flex-col items-end justify-between gap-4 border-b border-outline-variant pb-8 md:flex-row">
        <div>
          <nav className="mb-4 flex gap-2 font-label-sm text-label-sm uppercase text-on-surface-variant">
            <Link className="hover:text-primary" to={routes.home}>
              Anasayfa
            </Link>
            <span>/</span>
            <span className="text-on-surface">Favorilerim</span>
          </nav>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-xl md:text-headline-xl">
            Favorilerim
          </h1>
          <p className="mt-4 max-w-lg font-body-md text-on-surface-variant">
            Arzu listenizdeki seçkin parçalar. Sizin için ayırdığımız koleksiyonu inceleyin.
          </p>
        </div>
        <div className="font-label-sm text-label-sm italic text-on-surface-variant">
          {favorites.length} PARÇA
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        {favorites.length === 0 ? (
          <EmptyState
            icon="favorite_border"
            title="Listeniz Şu An Boş"
            description="Favorilerinizde henüz ürün bulunmuyor. Yeni koleksiyonumuzu keşfederek size en uygun parçaları seçebilirsiniz."
            actionLabel="Keşfetmeye Başla"
            actionHref={routes.products}
          />
        ) : (
          <div className="grid grid-cols-1 gap-x-gutter gap-y-stack-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((favorite) => (
              <ProductCard
                key={favorite.favoriteId}
                id={favorite.productId}
                name={favorite.productName}
                price={favorite.price}
                favoriteVariant="filled-badge"
                onToggleFavorite={() => handleRemove(favorite.favoriteId)}
                footerSlot={
                  <button
                    type="button"
                    disabled={busyId === favorite.favoriteId}
                    onClick={() => navigate(routes.productDetail(favorite.productId))}
                    className="mt-stack-md w-full border border-secondary py-3 font-label-sm uppercase text-on-surface-variant transition-all duration-500 hover:bg-secondary hover:text-white"
                  >
                    Sepete Ekle
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
