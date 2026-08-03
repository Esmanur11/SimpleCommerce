import { useEffect, useState } from "react"
import { getCustomerOrders } from "../../api/orders"
import { useCustomerAuth } from "../../contexts/CustomerAuthContext"
import { Badge } from "../../components/ui/Badge"
import { Spinner } from "../../components/ui/Spinner"
import { EmptyState } from "../../components/ui/EmptyState"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import { formatCurrency } from "../../lib/formatCurrency"
import { formatDate } from "../../lib/formatDate"
import { routes } from "../../lib/routes"
import type { OrderSummary } from "../../types/order"

function statusInfo(status: string): { label: string; variant: "delivered" | "transit" | "cancelled" } {
  const s = status.toLowerCase()
  if (s.includes("cancel") || s.includes("iptal")) return { label: "İptal Edildi", variant: "cancelled" }
  if (s.includes("complet") || s.includes("deliver") || s.includes("teslim"))
    return { label: "Tamamlandı", variant: "delivered" }
  return { label: status, variant: "transit" }
}

const PAGE_SIZE = 10

export function OrderHistoryPage() {
  const { auth } = useCustomerAuth()
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (!auth?.customerId) return
    setLoading(true)
    getCustomerOrders(auth.customerId, page, PAGE_SIZE)
      .then((data) => {
        setOrders(data)
        setHasNextPage(data.length === PAGE_SIZE)
      })
      .catch((err) => setError(extractErrorMessage(err, "Siparişler yüklenemedi.")))
      .finally(() => setLoading(false))
  }, [auth?.customerId, page])

  if (loading) return <Spinner />

  return (
    <main className="mx-auto max-w-screen-xl space-y-section-gap px-margin-mobile pb-section-gap pt-12 md:px-margin-desktop">
      <section className="flex flex-col items-baseline justify-between gap-stack-md md:flex-row">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Siparişlerim</h1>
          <p className="mt-2 max-w-md font-body-md text-body-md text-on-surface-variant">
            Geçmiş siparişlerinizi buradan takip edebilirsiniz.
          </p>
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      <div className="space-y-stack-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Son Siparişler</h2>
          <span className="font-label-sm text-label-sm uppercase text-secondary">
            Sayfa {page}
          </span>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon="receipt_long"
            title="Henüz Siparişiniz Yok"
            description="Verdiğiniz siparişler burada görünecek."
            actionLabel="Alışverişe Başla"
            actionHref={routes.products}
          />
        ) : (
          <div className="flex flex-col gap-stack-md">
            {orders.map((order) => {
              const status = statusInfo(order.status)
              const isExpanded = expandedId === order.orderId
              return (
                <div
                  key={order.orderId}
                  className="flex flex-col gap-stack-md border border-outline-variant bg-surface-container-lowest p-stack-md transition-colors duration-500 hover:border-primary md:p-stack-lg"
                >
                  <div className="flex flex-col items-start justify-between gap-stack-md md:flex-row md:items-center">
                    <div className="flex flex-col gap-1">
                      <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                        {formatDate(order.createdAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        <h3 className="font-title-md text-title-md text-on-surface">
                          #{order.orderId}
                        </h3>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-start gap-stack-sm md:w-auto md:items-end">
                      <span className="font-body-md text-body-md text-on-surface">
                        {formatCurrency(order.totalPrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : order.orderId)}
                        className="border border-secondary px-6 py-2 font-label-sm text-label-sm uppercase text-on-secondary-container transition-all duration-300 hover:bg-secondary hover:text-on-secondary"
                      >
                        {isExpanded ? "Gizle" : "Detayları Gör"}
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="grid grid-cols-1 gap-stack-md border-t border-outline-variant/30 pt-stack-md md:grid-cols-3">
                      <div>
                        <span className="mb-1 block font-label-sm text-label-sm uppercase text-on-surface-variant">
                          Kargo Firması
                        </span>
                        <span className="font-body-md text-body-md">
                          {order.shippingProviderName}
                        </span>
                      </div>
                      <div>
                        <span className="mb-1 block font-label-sm text-label-sm uppercase text-on-surface-variant">
                          Teslimat Şehri
                        </span>
                        <span className="font-body-md text-body-md">{order.shippingCity}</span>
                      </div>
                      <div>
                        <span className="mb-1 block font-label-sm text-label-sm uppercase text-on-surface-variant">
                          İlçe
                        </span>
                        <span className="font-body-md text-body-md">{order.shippingDistrict}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {(page > 1 || hasNextPage) && (
          <div className="flex items-center justify-between border-t border-outline-variant/30 pt-stack-md">
            <button
              type="button"
              className="font-label-sm text-label-sm uppercase text-on-surface-variant transition-colors hover:text-primary disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Önceki
            </button>
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
    </main>
  )
}
