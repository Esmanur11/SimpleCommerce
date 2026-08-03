import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAdminAuth } from "../../contexts/AdminAuthContext"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import { loginSchema, type LoginFormValues } from "../../schemas/authSchemas"
import { routes } from "../../lib/routes"

export function AdminLoginPage() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      await login(values)
      toast.success("Giriş başarılı")
      navigate(routes.adminProducts, { replace: true })
    } catch (err) {
      setServerError(extractErrorMessage(err, "Giriş yapılamadı. Bilgilerinizi kontrol edin."))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F1E8] px-margin-mobile">
      <div className="w-full max-w-md space-y-stack-lg border border-outline-variant bg-surface-container-lowest p-stack-lg md:p-12">
        <div className="space-y-stack-sm text-center">
          <h2 className="text-headline-xl font-headline-xl uppercase tracking-[0.4em] text-on-surface">
            IVOIRE
          </h2>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            Yönetim Paneli
          </p>
        </div>
        <form className="space-y-stack-md" onSubmit={handleSubmit(onSubmit)}>
          {serverError && <ErrorMessage message={serverError} />}
          <Input
            label="E-Posta Adresi"
            type="email"
            placeholder="admin@ivoire.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Parola"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>
      </div>
    </div>
  )
}
