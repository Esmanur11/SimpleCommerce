import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { createCategory, getCategories } from "../../api/categories"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Spinner } from "../../components/ui/Spinner"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import {
  createCategorySchema,
  type CreateCategoryFormValues,
} from "../../schemas/categorySchema"
import type { Category } from "../../types/category"

function flattenCategories(categories: Category[], depth = 0): { id: string; name: string; depth: number }[] {
  return categories.flatMap((category) => [
    { id: category.id, name: category.name, depth },
    ...flattenCategories(category.children, depth + 1),
  ])
}

export function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getCategories()
      .then(setCategories)
      .catch((err) => setError(extractErrorMessage(err, "Kategoriler yüklenemedi.")))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryFormValues>({ resolver: zodResolver(createCategorySchema) })

  const flatCategories = flattenCategories(categories)

  const onSubmit = async (values: CreateCategoryFormValues) => {
    try {
      await createCategory({
        name: values.name,
        parentCategoryId: values.parentCategoryId || null,
      })
      toast.success("Kategori oluşturuldu")
      reset()
      load()
    } catch (err) {
      toast.error(extractErrorMessage(err, "Kategori oluşturulamadı."))
    }
  }

  return (
    <div className="max-w-3xl space-y-stack-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Kategori Yönetimi</h1>

      <div>
        <h2 className="mb-stack-md font-title-md text-title-md text-on-surface">Yeni Kategori</h2>
        <form className="checkout-card grid grid-cols-1 gap-4 p-6 md:grid-cols-3" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Kategori Adı" error={errors.name?.message} {...register("name")} />
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-[10px] uppercase text-on-surface-variant">
              Üst Kategori (isteğe bağlı)
            </label>
            <select
              className="border-0 border-b border-outline-variant bg-transparent px-0 py-3 font-body-md focus:border-primary focus:ring-0"
              {...register("parentCategoryId")}
            >
              <option value="">Yok (kök kategori)</option>
              {flatCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {"—".repeat(c.depth)} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              Oluştur
            </Button>
          </div>
        </form>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div>
          <h2 className="mb-stack-md font-title-md text-title-md text-on-surface">Kategoriler</h2>
          <div className="border border-outline-variant bg-surface-container-lowest">
            {flatCategories.length === 0 ? (
              <p className="p-stack-md font-body-md text-on-surface-variant">
                Henüz kategori bulunmuyor.
              </p>
            ) : (
              <ul>
                {flatCategories.map((c) => (
                  <li
                    key={c.id}
                    className="border-b border-outline-variant/50 px-stack-md py-stack-sm font-body-md text-on-surface last:border-0"
                    style={{ paddingLeft: 16 + c.depth * 20 }}
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
