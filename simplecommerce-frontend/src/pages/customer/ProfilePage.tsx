import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useCustomerAuth } from "../../contexts/CustomerAuthContext"
import { getAddresses, updateAddress, deleteAddress } from "../../api/addresses"
import { AddressForm } from "../../components/checkout/AddressForm"
import { Spinner } from "../../components/ui/Spinner"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { EmptyState } from "../../components/ui/EmptyState"
import { extractErrorMessage } from "../../types/apiError"
import { routes } from "../../lib/routes"
import type { Address } from "../../types/address"
import type { AddressFormValues } from "../../schemas/addressSchema"

export function ProfilePage() {
  const { auth, logout } = useCustomerAuth()
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!auth?.customerId) return
    let cancelled = false
    getAddresses(auth.customerId)
      .then((data) => {
        if (!cancelled) setAddresses(data)
      })
      .catch((err) => {
        if (!cancelled) setError(extractErrorMessage(err, "Adresler yüklenemedi."))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [auth?.customerId])

  const handleLogout = () => {
    logout()
    navigate(routes.home)
  }

  const handleUpdateAddress = async (id: string, values: AddressFormValues) => {
    setSavingEdit(true)
    try {
      const updated = await updateAddress(id, values)
      setAddresses((prev) => prev.map((a) => (a.id === id ? updated : a)))
      setEditingId(null)
      toast.success("Adres güncellendi")
    } catch (err) {
      toast.error(extractErrorMessage(err, "Adres güncellenemedi."))
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteAddress(id)
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      setConfirmDeleteId(null)
      toast.success("Adres silindi")
    } catch (err) {
      toast.error(extractErrorMessage(err, "Adres silinemedi."))
    } finally {
      setDeletingId(null)
    }
  }

  const fullName = [auth?.firstName, auth?.lastName].filter(Boolean).join(" ")

  return (
    <main className="mx-auto max-w-screen-xl space-y-section-gap px-margin-mobile pb-section-gap pt-12 md:px-margin-desktop">
      <section>
        <h1 className="font-headline-xl text-headline-xl text-on-surface">Profilim</h1>
        <p className="mt-2 max-w-md font-body-md text-body-md text-on-surface-variant">
          Hesap bilgileriniz ve kayıtlı adresleriniz.
        </p>
      </section>

      <section className="border border-outline-variant bg-surface-container-lowest p-stack-lg">
        <h2 className="mb-stack-md font-headline-lg text-headline-lg text-on-surface">
          Hesap Bilgileri
        </h2>
        <div className="grid grid-cols-1 gap-stack-md md:grid-cols-2">
          <div>
            <span className="mb-1 block font-label-sm text-label-sm uppercase text-on-surface-variant">
              Ad Soyad
            </span>
            <span className="font-body-md text-body-md text-on-surface">
              {fullName || "—"}
            </span>
          </div>
          <div>
            <span className="mb-1 block font-label-sm text-label-sm uppercase text-on-surface-variant">
              E-posta
            </span>
            <span className="font-body-md text-body-md text-on-surface">{auth?.email}</span>
          </div>
        </div>
      </section>

      <section className="space-y-stack-md">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Kayıtlı Adresler</h2>
        </div>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Spinner />
        ) : addresses.length === 0 ? (
          <EmptyState
            icon="location_on"
            title="Kayıtlı Adresiniz Yok"
            description="Siparişleriniz sırasında girdiğiniz adresler burada görünecek."
          />
        ) : (
          <div className="grid grid-cols-1 gap-stack-md md:grid-cols-2">
            {addresses.map((address) =>
              editingId === address.id ? (
                <div key={address.id} className="md:col-span-2">
                  <AddressForm
                    submitting={savingEdit}
                    submitLabel="Adresi Güncelle"
                    submittingLabel="Güncelleniyor..."
                    defaultValues={{
                      title: address.title,
                      fullName: address.fullName,
                      phone: address.phone,
                      city: address.city,
                      district: address.district,
                      addressLine: address.addressLine,
                      zipCode: address.zipCode ?? undefined,
                    }}
                    onSubmit={(values) => handleUpdateAddress(address.id, values)}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div
                  key={address.id}
                  className="border border-outline-variant bg-surface-container-lowest p-stack-md"
                >
                  <span className="mb-2 block font-label-sm text-label-sm uppercase text-secondary">
                    {address.title}
                  </span>
                  <p className="font-body-md text-body-md text-on-surface">{address.fullName}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">{address.phone}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {address.addressLine}, {address.district}/{address.city}
                    {address.zipCode ? ` ${address.zipCode}` : ""}
                  </p>

                  <div className="mt-4 flex items-center gap-4 border-t border-outline-variant/30 pt-4">
                    {confirmDeleteId === address.id ? (
                      <>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Emin misiniz?
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(address.id)}
                          disabled={deletingId === address.id}
                          className="font-label-sm text-label-sm uppercase tracking-widest text-error hover:underline disabled:opacity-50"
                        >
                          {deletingId === address.id ? "Siliniyor..." : "Evet, Sil"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary"
                        >
                          Vazgeç
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditingId(address.id)}
                          className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary"
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(address.id)}
                          className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-error"
                        >
                          Sil
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>

      <section className="flex flex-col items-start gap-stack-md border-t border-outline-variant/30 pt-stack-lg md:flex-row md:items-center md:justify-between">
        <Link
          to={routes.orders}
          className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary"
        >
          Siparişlerim
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="border border-outline-variant px-6 py-3 font-label-sm text-label-sm uppercase tracking-widest text-on-surface transition-colors hover:border-error hover:text-error"
        >
          Çıkış Yap
        </button>
      </section>
    </main>
  )
}
