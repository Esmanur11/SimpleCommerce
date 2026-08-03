import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllActiveProducts } from "../../api/products"
import { Spinner } from "../../components/ui/Spinner"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import { formatCurrency } from "../../lib/formatCurrency"
import { routes } from "../../lib/routes"
import type { ProductListItem } from "../../types/product"

export function AdminProductListPage() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAllActiveProducts()
      .then(setProducts)
      .catch((err) => setError(extractErrorMessage(err, "Ürünler yüklenemedi.")))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-stack-lg">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Ürün Yönetimi</h1>
        <Link
          to={routes.adminProductNew}
          className="bg-primary px-6 py-3 font-label-sm text-label-sm uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container"
        >
          Yeni Ürün
        </Link>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="overflow-x-auto border border-outline-variant bg-surface-container-lowest">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Ürün
                </th>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Kategori
                </th>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Fiyat
                </th>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Stok
                </th>
                <th className="px-stack-md py-stack-sm" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-outline-variant/50 last:border-0">
                  <td className="px-stack-md py-stack-sm font-body-md text-on-surface">
                    {product.name}
                  </td>
                  <td className="px-stack-md py-stack-sm font-body-md text-on-surface-variant">
                    {product.categoryName ?? "—"}
                  </td>
                  <td className="px-stack-md py-stack-sm font-body-md text-on-surface">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-stack-md py-stack-sm font-body-md text-on-surface">
                    {product.stockQuantity}
                  </td>
                  <td className="px-stack-md py-stack-sm text-right">
                    <Link
                      to={routes.adminProductDetail(product.id)}
                      className="font-label-sm text-label-sm uppercase text-primary hover:underline"
                    >
                      Yönet
                    </Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-stack-md py-stack-lg text-center font-body-md text-on-surface-variant">
                    Henüz ürün bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
