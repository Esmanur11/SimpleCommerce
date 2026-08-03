import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useCart } from "../../contexts/CartContext"
import { useCustomerAuth } from "../../contexts/CustomerAuthContext"
import { getAddresses, createAddress } from "../../api/addresses"
import { getShippingProviders } from "../../api/shippingProviders"
import { checkoutCart } from "../../api/cart"
import { AddressForm } from "../../components/checkout/AddressForm"
import { Button } from "../../components/ui/Button"
import { Spinner } from "../../components/ui/Spinner"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import { formatCurrency } from "../../lib/formatCurrency"
import { routes } from "../../lib/routes"
import type { Address, CreateAddressRequest } from "../../types/address"
import type { ShippingProvider } from "../../types/shippingProvider"
import type { CheckoutResult } from "../../types/cart"

type Step = 1 | 2 | 3

export function CheckoutPage() {
  const { auth } = useCustomerAuth()
  const { cart, loading: cartLoading, refresh } = useCart()

  const [step, setStep] = useState<Step>(1)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [providers, setProviders] = useState<ShippingProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [result, setResult] = useState<CheckoutResult | null>(null)

  useEffect(() => {
    if (!auth?.customerId) return
    Promise.all([getAddresses(auth.customerId), getShippingProviders()])
      .then(([addressData, providerData]) => {
        setAddresses(addressData)
        setProviders(providerData)
        if (addressData.length > 0) setSelectedAddressId(addressData[0].id)
        if (providerData.length > 0) setSelectedProviderId(providerData[0].id)
      })
      .catch((err) => setError(extractErrorMessage(err, "Bilgiler yüklenemedi.")))
      .finally(() => setLoading(false))
  }, [auth?.customerId])

  const handleCreateAddress = async (values: Omit<CreateAddressRequest, "customerId">) => {
    if (!auth?.customerId) return
    setSavingAddress(true)
    try {
      const created = await createAddress({ ...values, customerId: auth.customerId })
      setAddresses((prev) => [...prev, created])
      setSelectedAddressId(created.id)
      setShowAddressForm(false)
      toast.success("Adres kaydedildi")
    } catch (err) {
      toast.error(extractErrorMessage(err, "Adres kaydedilemedi."))
    } finally {
      setSavingAddress(false)
    }
  }

  const selectedProvider = providers.find((p) => p.id === selectedProviderId)
  const shippingPrice = selectedProvider?.price ?? 0
  const subtotal = cart?.totalPrice ?? 0
  const total = subtotal + shippingPrice

  const handlePlaceOrder = async () => {
    if (!auth?.customerId || !selectedAddressId || !selectedProviderId) return
    setPlacingOrder(true)
    try {
      const res = await checkoutCart(auth.customerId, {
        addressId: selectedAddressId,
        shippingProviderId: selectedProviderId,
      })
      setResult(res)
      await refresh()
    } catch (err) {
      toast.error(extractErrorMessage(err, "Sipariş tamamlanamadı."))
    } finally {
      setPlacingOrder(false)
    }
  }

  if (cartLoading || loading) return <Spinner />

  if (result) {
    return (
      <main className="mx-auto max-w-2xl px-margin-mobile py-section-gap text-center md:px-margin-desktop">
        <span className="material-symbols-outlined mb-stack-md text-6xl text-primary">
          check_circle
        </span>
        <h1 className="mb-stack-md font-headline-lg text-headline-lg text-on-surface">
          Siparişiniz Alındı
        </h1>
        <p className="mb-stack-lg font-body-md text-on-surface-variant">
          Sipariş numaranız: <strong>{result.orderId}</strong> — Toplam{" "}
          {formatCurrency(result.totalPrice)} tutarındaki ödemeniz alınmıştır.
        </p>
        <Link
          to={routes.orders}
          className="inline-block bg-primary px-12 py-4 font-label-sm text-label-sm uppercase tracking-widest text-white transition-colors hover:bg-primary-container"
        >
          Siparişlerimi Görüntüle
        </Link>
      </main>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-margin-mobile py-section-gap text-center md:px-margin-desktop">
        <p className="font-body-md text-on-surface-variant">Sepetiniz boş.</p>
        <Link to={routes.products} className="mt-stack-md inline-block text-primary hover:underline">
          Alışverişe başla
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1440px] px-margin-mobile pb-section-gap pt-12 md:px-margin-desktop">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="mb-12 flex items-center gap-8 overflow-x-auto whitespace-nowrap border-b border-outline-variant/20">
            <button
              type="button"
              className={`pb-4 font-label-sm text-label-sm uppercase transition-all ${step === 1 ? "step-active" : "step-inactive"}`}
              onClick={() => setStep(1)}
            >
              01. Adres
            </button>
            <button
              type="button"
              className={`pb-4 font-label-sm text-label-sm uppercase transition-all ${step === 2 ? "step-active" : "step-inactive"}`}
              onClick={() => selectedAddressId && setStep(2)}
            >
              02. Kargo
            </button>
            <button
              type="button"
              className={`pb-4 font-label-sm text-label-sm uppercase transition-all ${step === 3 ? "step-active" : "step-inactive"}`}
              onClick={() => selectedAddressId && selectedProviderId && setStep(3)}
            >
              03. Ödeme ve Özet
            </button>
          </div>

          {error && <ErrorMessage message={error} />}

          {step === 1 && (
            <section className="space-y-stack-lg">
              {addresses.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`checkout-card relative cursor-pointer p-6 transition-all hover:bg-white ${
                        selectedAddressId === address.id ? "border-primary" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping_address"
                        className="absolute top-4 right-4 h-4 w-4 text-primary focus:ring-primary"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                      />
                      <div className="pr-8">
                        <h4 className="mb-2 font-title-md text-title-md">{address.title}</h4>
                        <p className="font-body-md text-sm leading-relaxed text-on-surface-variant">
                          {address.fullName}
                          <br />
                          {address.addressLine}
                          <br />
                          {address.district}, {address.city} {address.zipCode ?? ""}
                        </p>
                      </div>
                    </label>
                  ))}
                  {!showAddressForm && (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="flex flex-col items-center justify-center border border-dashed border-outline-variant p-6 text-on-surface-variant transition-all hover:bg-white/50"
                    >
                      <span className="material-symbols-outlined mb-2 text-3xl">add</span>
                      <span className="font-label-sm text-label-sm uppercase">Yeni Adres Ekle</span>
                    </button>
                  )}
                </div>
              )}

              {(showAddressForm || addresses.length === 0) && (
                <div className="pt-8">
                  <h3 className="mb-6 font-headline-lg text-headline-lg">Teslimat Adresi</h3>
                  <AddressForm
                    submitting={savingAddress}
                    onSubmit={handleCreateAddress}
                    onCancel={() => setShowAddressForm(false)}
                  />
                </div>
              )}

              <div className="flex justify-end pt-12">
                <Button disabled={!selectedAddressId} onClick={() => setStep(2)}>
                  Kargo Seçimine Geç
                </Button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-stack-lg">
              <h3 className="mb-8 font-headline-lg text-headline-lg">Kargo Metodu</h3>
              {providers.length === 0 ? (
                <p className="font-body-md text-on-surface-variant">
                  Şu anda kullanılabilir kargo firması bulunmuyor.
                </p>
              ) : (
                <div className="space-y-4">
                  {providers.map((provider) => (
                    <label
                      key={provider.id}
                      className="checkout-card flex cursor-pointer items-center p-6 transition-all hover:bg-white"
                    >
                      <input
                        type="radio"
                        name="shipping_method"
                        className="mr-6 h-5 w-5 text-primary focus:ring-primary"
                        checked={selectedProviderId === provider.id}
                        onChange={() => setSelectedProviderId(provider.id)}
                      />
                      <div className="flex-grow">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-title-md text-title-md">{provider.name}</span>
                          <span className="font-body-md text-primary">
                            {provider.price === 0 ? "Ücretsiz" : formatCurrency(provider.price)}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              <div className="flex justify-between pt-12">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-secondary px-8 py-4 font-label-sm text-label-sm uppercase tracking-widest transition-all hover:bg-secondary hover:text-white"
                >
                  Geri Dön
                </button>
                <Button disabled={!selectedProviderId} onClick={() => setStep(3)}>
                  Ödemeye Devam Et
                </Button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-stack-lg">
              <h3 className="mb-8 font-headline-lg text-headline-lg">Ödeme Bilgileri</h3>
              <div className="checkout-card space-y-6 p-8">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-[10px] uppercase text-on-surface-variant">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    className="border-0 border-b border-outline-variant bg-transparent px-0 py-3 font-body-md focus:border-primary focus:ring-0"
                    placeholder="AHMET YILMAZ"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-[10px] uppercase text-on-surface-variant">
                    Kart Numarası
                  </label>
                  <input
                    className="border-0 border-b border-outline-variant bg-transparent px-0 py-3 font-body-md focus:border-primary focus:ring-0"
                    placeholder="0000 0000 0000 0000"
                    type="text"
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-[10px] uppercase text-on-surface-variant">
                      S.K. Tarihi
                    </label>
                    <input
                      className="border-0 border-b border-outline-variant bg-transparent px-0 py-3 font-body-md focus:border-primary focus:ring-0"
                      placeholder="AA / YY"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-[10px] uppercase text-on-surface-variant">
                      CVC
                    </label>
                    <input
                      className="border-0 border-b border-outline-variant bg-transparent px-0 py-3 font-body-md focus:border-primary focus:ring-0"
                      placeholder="000"
                      type="text"
                    />
                  </div>
                </div>
                <p className="font-body-md text-[12px] text-on-surface-variant">
                  Bu demo ortamında ödeme simüle edilmektedir; kart bilgileri kaydedilmez.
                </p>
              </div>
              <div className="flex justify-between pt-12">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="border border-secondary px-8 py-4 font-label-sm text-label-sm uppercase tracking-widest transition-all hover:bg-secondary hover:text-white"
                >
                  Geri Dön
                </button>
                <Button onClick={handlePlaceOrder} disabled={placingOrder}>
                  {placingOrder ? "Sipariş Oluşturuluyor..." : "Siparişi Tamamla"}
                </Button>
              </div>
            </section>
          )}
        </div>

        {/* Order Summary */}
        <aside className="space-y-8 lg:sticky lg:top-32 lg:col-span-5 xl:col-span-4">
          <div className="checkout-card p-8">
            <h3 className="mb-6 border-b border-outline-variant/30 pb-4 font-headline-lg text-headline-lg">
              Sipariş Özeti
            </h3>
            <div className="mb-8 max-h-[300px] space-y-6 overflow-y-auto pr-2">
              {cart.items.map((item) => (
                <div key={item.cartItemId} className="flex gap-4">
                  <div className="h-28 w-20 flex-shrink-0 bg-surface-container-high" />
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h5 className="font-title-md text-sm uppercase tracking-tight">
                        {item.productName}
                      </h5>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        Beden: {item.size} | Renk: {item.color} | Adet: {item.quantity}
                      </p>
                    </div>
                    <span className="font-body-md text-sm">{formatCurrency(item.lineTotal)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-outline-variant/30 pt-6">
              <div className="flex justify-between text-on-surface-variant">
                <span className="font-body-md">Ara Toplam</span>
                <span className="font-body-md">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span className="font-body-md">Kargo</span>
                <span className="font-body-md">
                  {selectedProvider
                    ? shippingPrice === 0
                      ? "Ücretsiz"
                      : formatCurrency(shippingPrice)
                    : "Seçilmedi"}
                </span>
              </div>
              <div className="mt-2 flex items-end justify-between pt-4">
                <span className="font-label-sm text-label-sm uppercase">Toplam</span>
                <span className="font-headline-lg text-2xl">{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex gap-2">
                <input
                  className="flex-grow border-0 border-b border-outline-variant bg-transparent px-0 py-2 font-body-md text-sm focus:border-primary focus:ring-0"
                  placeholder="İndirim Kodu"
                  type="text"
                />
                <button
                  type="button"
                  onClick={() => toast("Bu özellik yakında aktif olacak")}
                  className="border border-outline-variant px-4 font-label-sm text-[10px] uppercase tracking-tighter transition-colors hover:bg-surface-container-high"
                >
                  Uygula
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-2">
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span className="font-label-sm text-xs uppercase tracking-wide">
                Güvenli SSL Ödeme Altyapısı
              </span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              <span className="font-label-sm text-xs uppercase tracking-wide">
                30 Gün İçinde Kolay İade
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
