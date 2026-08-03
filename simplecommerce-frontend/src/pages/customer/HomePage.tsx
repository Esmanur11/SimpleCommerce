import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllActiveProducts } from "../../api/products"
import { getCategories } from "../../api/categories"
import { ProductCard } from "../../components/product/ProductCard"
import { Spinner } from "../../components/ui/Spinner"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import type { ProductListItem } from "../../types/product"
import type { Category } from "../../types/category"
import { routes } from "../../lib/routes"

export function HomePage() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getAllActiveProducts(), getCategories()])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData)
        setCategories(categoriesData)
      })
      .catch((err) => setError(extractErrorMessage(err, "Ürünler yüklenemedi.")))
      .finally(() => setLoading(false))
  }, [])

  const featured = products.slice(0, 4)
  const banners = categories.slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="relative flex h-[600px] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#3E2C23] via-[#7c5236] to-[#A9795A] md:h-[700px]">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col items-center px-margin-mobile text-center">
          <span className="mb-stack-sm font-label-sm text-label-sm uppercase tracking-[0.2em] text-white/90">
            Sonbahar / Kış 2026
          </span>
          <h2 className="mb-stack-lg font-display-lg text-display-lg italic text-white md:text-[80px]">
            Kış Koleksiyonu
          </h2>
          <a
            href="#featured"
            className="rounded-[1px] bg-[#A9795A] px-10 py-4 font-label-sm text-label-sm tracking-widest text-white transition-all duration-300 hover:bg-[#8e654b]"
          >
            KOLEKSİYONU GÖR
          </a>
        </div>
      </section>

      {loading && <Spinner />}
      {error && (
        <div className="px-margin-mobile py-stack-lg md:px-margin-desktop">
          <ErrorMessage message={error} />
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Featured */}
          <section className="mx-auto max-w-[1440px] px-margin-mobile py-section-gap md:px-margin-desktop" id="featured">
            <div className="mb-stack-lg flex items-end justify-between border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Öne Çıkanlar</h3>
              <Link
                className="font-label-sm text-label-sm text-secondary transition-colors hover:text-primary"
                to={routes.products}
              >
                TÜMÜNÜ İNCELE
              </Link>
            </div>
            {featured.length === 0 ? (
              <p className="font-body-md text-on-surface-variant">Henüz ürün bulunmuyor.</p>
            ) : (
              <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.imageUrl}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Category banners */}
          {banners.length > 0 && (
            <section className="bg-surface-container-low px-margin-desktop py-section-gap">
              <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-stack-lg md:grid-cols-2">
                {banners[0] && (
                  <Link
                    to={`${routes.products}?category=${banners[0].id}`}
                    className="group relative flex h-[600px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#986a4c] to-[#3E2C23]"
                  >
                    <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40" />
                    <div className="relative z-10 flex flex-col items-center text-white">
                      <h3 className="mb-4 font-headline-xl text-headline-xl">{banners[0].name}</h3>
                      <span className="border border-white px-8 py-3 font-label-sm text-label-sm uppercase transition-all group-hover:bg-white group-hover:text-on-surface">
                        KEŞFET
                      </span>
                    </div>
                  </Link>
                )}
                <div className="flex flex-col gap-stack-lg">
                  {[banners[1], banners[2]].filter(Boolean).map((category) => (
                    <Link
                      key={category!.id}
                      to={`${routes.products}?category=${category!.id}`}
                      className="group relative flex h-[284px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#7c5236] to-[#51443d]"
                    >
                      <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/30" />
                      <div className="relative z-10 flex flex-col items-center text-white">
                        <h3 className="mb-2 font-headline-lg text-headline-lg">{category!.name}</h3>
                        <span className="border border-white/50 px-6 py-2 font-label-sm text-label-sm uppercase transition-all group-hover:bg-white group-hover:text-on-surface">
                          GÖZ AT
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Newsletter */}
      <section className="bg-surface px-margin-desktop py-section-gap text-center">
        <div className="mx-auto max-w-2xl space-y-stack-md">
          <h3 className="font-headline-lg text-headline-lg text-primary">Haber Bültenimiz</h3>
          <p className="px-12 font-body-md text-on-surface-variant">
            Yeni koleksiyonlar, özel etkinlikler ve editoryal içeriklerden ilk siz haberdar olun.
          </p>
          <form
            className="flex flex-col gap-4 pt-stack-md sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <input
              className="flex-1 border-b border-outline-variant bg-transparent px-0 py-3 font-body-md text-sm uppercase tracking-widest placeholder:text-outline/50 focus:border-primary focus:ring-0"
              placeholder="E-POSTA ADRESİNİZ"
              type="email"
            />
            <button
              className="border border-primary px-10 py-3 font-label-sm text-label-sm tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-white"
              type="submit"
            >
              KAYDOL
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
