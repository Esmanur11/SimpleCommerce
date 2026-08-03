import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useCustomerAuth } from "../../contexts/CustomerAuthContext"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import { loginSchema, type LoginFormValues } from "../../schemas/authSchemas"
import { routes } from "../../lib/routes"

export function LoginPage() {
  const { login } = useCustomerAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? routes.home

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      await login(values)
      toast.success("Giriş başarılı")
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(extractErrorMessage(err, "Giriş yapılamadı. Bilgilerinizi kontrol edin."))
    }
  }

  return (
    <div className="flex justify-center px-margin-mobile py-section-gap md:px-margin-desktop">
      <div className="relative w-full max-w-md space-y-stack-lg overflow-hidden border border-outline-variant bg-surface-container-lowest p-stack-lg md:p-12">
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-surface-container-high opacity-30" />
        <div className="relative z-10 space-y-stack-sm text-center">
          <h2 className="text-headline-xl font-headline-xl uppercase tracking-[0.4em] text-on-surface">
            IVOIRE
          </h2>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            Ayrıcalıklı Bir Dünya
          </p>
        </div>
        <form className="relative z-10 space-y-stack-md" onSubmit={handleSubmit(onSubmit)}>
          {serverError && <ErrorMessage message={serverError} />}
          <Input
            label="E-Posta Adresi"
            type="email"
            placeholder="ornek@ivoire.com"
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
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-surface-container-lowest px-4 tracking-widest text-on-surface-variant">
                veya
              </span>
            </div>
          </div>
          <Link
            to={routes.register}
            className="block w-full border border-secondary py-4 text-center font-label-sm text-label-sm uppercase tracking-widest text-secondary transition-all hover:bg-surface-container"
          >
            Hesap Oluştur
          </Link>
        </form>
      </div>
    </div>
  )
}
