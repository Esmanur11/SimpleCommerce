import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useCustomerAuth } from "../../contexts/CustomerAuthContext"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { ErrorMessage } from "../../components/ui/ErrorMessage"
import { extractErrorMessage } from "../../types/apiError"
import { registerSchema, type RegisterFormValues } from "../../schemas/authSchemas"
import { routes } from "../../lib/routes"

export function RegisterPage() {
  const { register: registerCustomer } = useCustomerAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null)
    try {
      await registerCustomer(values)
      toast.success("Hesabınız oluşturuldu")
      navigate(routes.home, { replace: true })
    } catch (err) {
      setServerError(extractErrorMessage(err, "Kayıt oluşturulamadı."))
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
            Hesap Oluştur
          </p>
        </div>
        <form className="relative z-10 space-y-stack-md" onSubmit={handleSubmit(onSubmit)}>
          {serverError && <ErrorMessage message={serverError} />}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ad"
              placeholder="Ahmet"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              label="Soyad"
              placeholder="Yılmaz"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>
          <Input
            label="E-Posta Adresi"
            type="email"
            placeholder="ornek@ivoire.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Telefon (isteğe bağlı)"
            type="tel"
            placeholder="05xx xxx xx xx"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Parola"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
          </Button>
          <p className="text-center font-body-md text-on-surface-variant">
            Zaten hesabınız var mı?{" "}
            <Link to={routes.login} className="text-primary hover:underline">
              Giriş Yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
