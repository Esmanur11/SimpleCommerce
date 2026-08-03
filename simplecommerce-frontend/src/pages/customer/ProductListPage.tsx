import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useSearchParams } from "react-router-dom"
import { getAllActiveProducts } from "../../api/products"
import { getCategories } from "../../api/categories"
import { ProductCard } from "../../components/product/ProductCard"
import { Spinner } from "../../components/ui/Spinner"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import { formatCurrency } from "../../lib/formatCurrency"
import type { ProductListItem } from "../../types/product"
import type { Category } from "../../types/category"

const PAGE_SIZE = 8

type SortOption = "recommended" | "price-asc" | "price-desc"

function flattenCategories(categories: Category[], depth = 0): { id: string; name: string; depth: number }[] {
  return categories.flatMap((category) => [
    { id: category.id, name: category.name, depth },
    ...flattenCategories(category.children, depth + 1),
  ])
}

function collectDescendantIds(category: Category): string[] {
  return [category.id, ...category.children.flatMap(collectDescendantIds)]
}

function expandCategorySelection(categories: Category[], selectedIds: Set<string>): Set<string> {
  const expanded = new Set<string>()

  function walk(category: Category) {
    if (selectedIds.has(category.id)) {
      for (const id of collectDescendantIds(category)) expanded.add(id)
    } else {
      category.children.forEach(walk)
    }
  }

  categories.forEach(walk)
  return expanded
}

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set())
  const [maxPrice, setMaxPrice] = useState(1000)
  const [sort, setSort] = useState<SortOption>("recommended")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    Promise.all([getAllActiveProducts(), getCategories()])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData)
        setCategories(categoriesData)
        const highest = Math.max(1000, ...productsData.map((p) => Math.ceil(p.price / 100) * 100))
        setMaxPrice(highest)
      })
      .catch((err) => setError(extractErrorMessage(err, "Ürünler yüklenemedi.")))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setSelectedCategoryIds(new Set([categoryParam]))
    }
  }, [searchParams])

  useEffect(() => {
    if ((location.state as { focusSearch?: boolean } | null)?.focusSearch) {
      searchInputRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const flatCategories = useMemo(() => flattenCategories(categories), [categories])
  const [priceCeiling, setPriceCeiling] = useState<number | null>(null)
  const effectiveCeiling = priceCeiling ?? maxPrice

  const toggleCategory = (id: string) => {
    setPage(1)
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearAll = () => {
    setSelectedCategoryIds(new Set())
    setPriceCeiling(null)
    setSearch("")
    setPage(1)
    setSearchParams({})
  }

  const expandedCategoryIds = useMemo(
    () => expandCategorySelection(categories, selectedCategoryIds),
    [categories, selectedCategoryIds],
  )

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.price <= effectiveCeiling)
    if (expandedCategoryIds.size > 0) {
      result = result.filter((p) => p.categoryId && expandedCategoryIds.has(p.categoryId))
    }
    const query = search.trim().toLowerCase()
    if (query) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query),
      )
    }
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price)
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price)
    return result
  }, [products, expandedCategoryIds, effectiveCeiling, search, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <main className="mx-auto max-w-[1440px] px-margin-mobile pb-section-gap pt-12 md:px-margin-desktop">
      <div className="mb-stack-lg flex flex-col justify-between border-b border-outline-variant/20 pb-stack-md md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 font-headline-xl text-headline-xl text-on-surface">Yeni Gelenler</h1>
          <p className="font-body-md text-on-surface-variant">
            Seçkin siluetler ve editoryal parçaları keşfedin.
          </p>
        </div>
        <div className="mt-stack-md flex items-center space-x-4 md:mt-0">
          <span className="font-label-sm uppercase tracking-widest text-on-surface-variant">
            Sırala:
          </span>
          <select
            className="cursor-pointer border-none bg-transparent text-label-sm font-label-sm uppercase tracking-widest text-primary focus:ring-0"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="recommended">Önerilen</option>
            <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
          </select>
        </div>
      </div>

      <div className="mb-stack-lg flex max-w-md items-center gap-2 border-b border-outline-variant/50 pb-2 focus-within:border-primary">
        <span className="material-symbols-outlined text-on-surface-variant">search</span>
        <input
          ref={searchInputRef}
          type="text"
          className="w-full border-none bg-transparent p-0 font-body-md placeholder:text-on-surface-variant/50 focus:ring-0"
          placeholder="Ürün adı veya açıklamada ara..."
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="material-symbols-outlined text-on-surface-variant transition-colors hover:text-primary"
            title="Temizle"
          >
            close
          </button>
        )}
      </div>

      {loading && <Spinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="flex flex-col gap-gutter lg:flex-row">
          <aside className="w-full flex-shrink-0 lg:w-64">
            <div className="sticky top-28 space-y-stack-lg">
              {flatCategories.length > 0 && (
                <div>
                  <h3 className="mb-stack-md font-label-sm text-label-sm uppercase tracking-widest text-on-surface">
                    Kategoriler
                  </h3>
                  <div className="space-y-2">
                    {flatCategories.map((category) => (
                      <label
                        key={category.id}
                        className="group flex cursor-pointer items-center space-x-3"
                        style={{ paddingLeft: category.depth * 12 }}
                      >
                        <input
                          type="checkbox"
                          className="filter-checkbox"
                          checked={selectedCategoryIds.has(category.id)}
                          onChange={() => toggleCategory(category.id)}
                        />
                        <span className="font-body-md text-on-surface-variant transition-colors group-hover:text-on-surface">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="mb-stack-md font-label-sm text-label-sm uppercase tracking-widest text-on-surface">
                  Fiyat Aralığı
                </h3>
                <input
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-outline-variant accent-primary"
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={effectiveCeiling}
                  onChange={(e) => {
                    setPage(1)
                    setPriceCeiling(Number(e.target.value))
                  }}
                />
                <div className="mt-2 flex justify-between font-label-sm text-on-surface-variant">
                  <span>{formatCurrency(0)}</span>
                  <span>{formatCurrency(effectiveCeiling)}</span>
                </div>
              </div>
              <button
                className="w-full border border-secondary py-3 font-label-sm text-label-sm uppercase tracking-widest text-secondary transition-colors hover:bg-secondary hover:text-white"
                onClick={clearAll}
                type="button"
              >
                Tümünü Temizle
              </button>
            </div>
          </aside>

          <div className="flex-grow">
            {pageItems.length === 0 ? (
              <p className="font-body-md text-on-surface-variant">
                Kriterlerinize uygun ürün bulunamadı.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-x-gutter gap-y-stack-lg sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {pageItems.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    soldOut={product.stockQuantity <= 0}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-section-gap flex items-center justify-between border-t border-outline-variant/30 pt-stack-lg">
                <button
                  className="flex items-center space-x-2 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant transition-colors hover:text-primary disabled:opacity-40"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  <span>Önceki</span>
                </button>
                <div className="flex space-x-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`font-label-sm text-label-sm transition-colors ${
                        p === page
                          ? "text-primary underline underline-offset-4"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                      onClick={() => setPage(p)}
                      type="button"
                    >
                      {String(p).padStart(2, "0")}
                    </button>
                  ))}
                </div>
                <button
                  className="flex items-center space-x-2 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant transition-colors hover:text-primary disabled:opacity-40"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  type="button"
                >
                  <span>Sonraki</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
