import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import {
  addVariant,
  getProductDetail,
  updateProductPrice,
  updateVariantStock,
} from "../../api/products"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Spinner } from "../../components/ui/Spinner"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import { formatCurrency } from "../../lib/formatCurrency"
import {
  createVariantSchema,
  type CreateVariantFormInput,
  type CreateVariantFormValues,
} from "../../schemas/productSchemas"
import type { ProductDetail } from "../../types/product"

function VariantStockRow({
  variantId,
  size,
  color,
  stockQuantity,
  onUpdated,
}: {
  variantId: string
  size: string
  color: string
  stockQuantity: number
  onUpdated: (variantId: string, newStock: number) => void
}) {
  const [value, setValue] = useState(stockQuantity)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateVariantStock(variantId, { newStockQuantity: value })
      onUpdated(variantId, value)
      toast.success("Stok güncellendi")
    } catch (err) {
      toast.error(extractErrorMessage(err, "Stok güncellenemedi."))
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr className="border-b border-outline-variant/50 last:border-0">
      <td className="px-stack-md py-stack-sm font-body-md text-on-surface">{size}</td>
      <td className="px-stack-md py-stack-sm font-body-md text-on-surface">{color}</td>
      <td className="px-stack-md py-stack-sm">
        <input
          type="number"
          min={0}
          className="w-24 border-0 border-b border-outline-variant bg-transparent px-0 py-1 font-body-md focus:border-primary focus:ring-0"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </td>
      <td className="px-stack-md py-stack-sm text-right">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || value === stockQuantity}
          className="font-label-sm text-label-sm uppercase text-primary hover:underline disabled:opacity-40"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </td>
    </tr>
  )
}

export function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [priceValue, setPriceValue] = useState<number>(0)
  const [priceSaving, setPriceSaving] = useState(false)

  const load = () => {
    if (!id) return
    setLoading(true)
    getProductDetail(id)
      .then((data) => {
        setProduct(data)
        setPriceValue(data.price)
      })
      .catch((err) => setError(extractErrorMessage(err, "Ürün yüklenemedi.")))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateVariantFormInput, unknown, CreateVariantFormValues>({
    resolver: zodResolver(createVariantSchema),
  })

  const onAddVariant = async (values: CreateVariantFormValues) => {
    if (!id) return
    try {
      await addVariant(id, values)
      toast.success("Varyant eklendi")
      reset()
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, "Varyant eklenemedi."))
    }
  }

  const handlePriceSave = async () => {
    if (!id) return
    setPriceSaving(true)
    try {
      await updateProductPrice(id, { newAmount: priceValue })
      toast.success("Fiyat güncellendi")
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, "Fiyat güncellenemedi."))
    } finally {
      setPriceSaving(false)
    }
  }

  if (loading) return <Spinner />
  if (error || !product)
    return <ErrorMessage message={error ?? "Ürün bulunamadı."} />

  return (
    <div className="max-w-3xl space-y-stack-lg">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">{product.name}</h1>
        <p className="mt-1 font-body-md text-on-surface-variant">{product.description}</p>
      </div>

      <div className="checkout-card flex items-end gap-4 p-6">
        <div className="flex-1">
          <label className="font-label-sm text-[10px] uppercase text-on-surface-variant">
            Fiyat (TL)
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-3 font-body-md focus:border-primary focus:ring-0"
            value={priceValue}
            onChange={(e) => setPriceValue(Number(e.target.value))}
          />
        </div>
        <Button onClick={handlePriceSave} disabled={priceSaving || priceValue === product.price}>
          {priceSaving ? "Kaydediliyor..." : "Fiyatı Güncelle"}
        </Button>
      </div>

      <div>
        <h2 className="mb-stack-md font-title-md text-title-md text-on-surface">
          Varyantlar (Güncel Fiyat: {formatCurrency(product.price)})
        </h2>
        <div className="overflow-x-auto border border-outline-variant bg-surface-container-lowest">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Beden
                </th>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Renk
                </th>
                <th className="px-stack-md py-stack-sm font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Stok
                </th>
                <th className="px-stack-md py-stack-sm" />
              </tr>
            </thead>
            <tbody>
              {product.variants.map((variant) => (
                <VariantStockRow
                  key={variant.variantId}
                  variantId={variant.variantId}
                  size={variant.size}
                  color={variant.color}
                  stockQuantity={variant.stockQuantity}
                  onUpdated={(variantId, newStock) =>
                    setProduct((prev) =>
                      prev
                        ? {
                            ...prev,
                            variants: prev.variants.map((v) =>
                              v.variantId === variantId ? { ...v, stockQuantity: newStock } : v,
                            ),
                          }
                        : prev,
                    )
                  }
                />
              ))}
              {product.variants.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-stack-md py-stack-lg text-center font-body-md text-on-surface-variant">
                    Henüz varyant eklenmedi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-stack-md font-title-md text-title-md text-on-surface">Yeni Varyant Ekle</h2>
        <form className="checkout-card grid grid-cols-1 gap-4 p-6 md:grid-cols-4" onSubmit={handleSubmit(onAddVariant)}>
          <Input label="Beden" placeholder="M" error={errors.size?.message} {...register("size")} />
          <Input label="Renk" placeholder="Siyah" error={errors.color?.message} {...register("color")} />
          <Input
            label="Stok"
            type="number"
            min={0}
            error={errors.stockQuantity?.message}
            {...register("stockQuantity")}
          />
          <div className="flex items-end">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              Ekle
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
