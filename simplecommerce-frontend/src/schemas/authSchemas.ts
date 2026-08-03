import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "E-posta gerekli").email("Geçerli bir e-posta girin"),
  password: z.string().min(1, "Parola gerekli"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  firstName: z.string().min(1, "Ad gerekli"),
  lastName: z.string().min(1, "Soyad gerekli"),
  email: z.string().min(1, "E-posta gerekli").email("Geçerli bir e-posta girin"),
  password: z.string().min(6, "Parola en az 6 karakter olmalı"),
  phone: z.string().optional(),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
