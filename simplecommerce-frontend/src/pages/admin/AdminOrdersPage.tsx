import { useEffect, useState } from "react"
import { getAllOrders } from "../../api/orders"
import { Spinner } from "../../components/ui/Spinner"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import { formatCurrency } from "../../lib/formatCurrency"
import { formatDate } from "../../lib/formatDate"
import type { OrderSummary } from "../../types/order"

const PAGE_SIZE = 20

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getAllOrders(page, PAGE_SIZE)
      .then((data) => {
        setOrders(data)
        setHasNextPage(data.length === PAGE_SIZE)
      })
      .catch((err) => setError(extractErrorMessage(err, "Siparişler yüklenemedi.")))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="space-y-stack-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Siparişler</h1>

      {loading && <Spinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="overflow-x-auto border border-outline-variant bg-surface-container-lowest">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Sipariş No
                </th>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Müşteri
                </th>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Tarih
                </th>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Durum
                </th>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Kargo
                </th>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Toplam
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="border-b border-outline-variant/50 last:border-0">
                  <td className="px-stack-md py-stack-sm font-body-md text-on-surface">
                    #{order.orderId}
                  </td>
                  <td className="px-stack-md py-stack-sm font-body-md text-on-surface">
                    {order.customerName}
                  </td>
                  <td className="px-stack-md py-stack-sm font-body-md text-on-surface-variant">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-stack-md py-stack-sm font-body-md text-on-surface-variant">
                    {order.status}
                  </td>
                  <td className="px-stack-md py-stack-sm font-body-md text-on-surface-variant">
                    {order.shippingProviderName} · {order.shippingCity}/{order.shippingDistrict}
                  </td>
                  <td className="px-stack-md py-stack-sm font-body-md text-on-surface">
                    {formatCurrency(order.totalPrice)}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-stack-md py-stack-lg text-center font-body-md text-on-surface-variant">
                    Henüz sipariş bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {(page > 1 || hasNextPage) && (
            <div className="flex items-center justify-between border-t border-outline-variant px-stack-md py-stack-sm">
              <button
                type="button"
                className="font-label-sm text-label-sm uppercase text-on-surface-variant transition-colors hover:text-primary disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Önceki
              </button>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Sayfa {page}</span>
              <button
                type="button"
                className="font-label-sm text-label-sm uppercase text-on-surface-variant transition-colors hover:text-primary disabled:opacity-40"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNextPage}
              >
                Sonraki
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
