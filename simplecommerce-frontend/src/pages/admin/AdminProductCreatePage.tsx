import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { createProduct } from "../../api/products"
import { getCategories } from "../../api/categories"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import {
  createProductSchema,
  type CreateProductFormInput,
  type CreateProductFormValues,
} from "../../schemas/productSchemas"
import { routes } from "../../lib/routes"
import type { Category } from "../../types/category"

function flattenCategories(categories: Category[], depth = 0): { id: string; name: string; depth: number }[] {
  return categories.flatMap((category) => [
    { id: category.id, name: category.name, depth },
    ...flattenCategories(category.children, depth + 1),
  ])
}

export function AdminProductCreatePage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormInput, unknown, CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
  })

  const flatCategories = flattenCategories(categories)

  const onSubmit = async (values: CreateProductFormValues) => {
    setServerError(null)
    try {
      const created = await createProduct(values)
      toast.success("Ürün oluşturuldu")
      const createdId = (created as { id?: string })?.id
      navigate(createdId ? routes.adminProductDetail(createdId) : routes.adminProducts)
    } catch (err) {
      setServerError(extractErrorMessage(err, "Ürün oluşturulamadı."))
    }
  }

  return (
    <div className="max-w-xl space-y-stack-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Yeni Ürün</h1>
      <form className="checkout-card space-y-6 p-8" onSubmit={handleSubmit(onSubmit)}>
        {serverError && <ErrorMessage message={serverError} />}
        <Input label="Ürün Adı" error={errors.name?.message} {...register("name")} />
        <Input label="Açıklama" error={errors.description?.message} {...register("description")} />
        <div className="flex flex-col gap-2">
          <label className="font-label-sm text-[10px] uppercase text-on-surface-variant">
            Kategori
          </label>
          <select
            className="border-0 border-b border-outline-variant bg-transparent px-0 py-3 font-body-md focus:border-primary focus:ring-0"
            {...register("categoryId")}
          >
            <option value="">Kategori seçin</option>
            {flatCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {"—".repeat(c.depth)} {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <span className="font-label-sm text-[10px] text-error">{errors.categoryId.message}</span>
          )}
        </div>
        <Input
          label="Başlangıç Fiyatı (TL)"
          type="number"
          step="0.01"
          error={errors.initialPrice?.message}
          {...register("initialPrice")}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Oluşturuluyor..." : "Ürünü Oluştur"}
        </Button>
      </form>
    </div>
  )
}
