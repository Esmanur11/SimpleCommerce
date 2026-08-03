import { z } from "zod"
import { getDistrictsForProvince, turkeyProvinceNames } from "../data/turkeyProvinces"

const phoneRegex = /^0?\d{10}$/
const zipCodeRegex = /^\d{5}$/

export const addressSchema = z
  .object({
    title: z
      .string()
      .min(1, "Adres başlığı gerekli")
      .max(50, "Adres başlığı en fazla 50 karakter olabilir"),
    fullName: z
      .string()
      .min(1, "Ad soyad gerekli")
      .max(150, "Ad soyad en fazla 150 karakter olabilir"),
    phone: z
      .string()
      .min(1, "Telefon gerekli")
      .regex(phoneRegex, "Geçerli bir telefon numarası girin (10-11 haneli, sadece rakam)"),
    city: z
      .string()
      .min(1, "Şehir gerekli")
      .refine((value) => turkeyProvinceNames.includes(value), "Geçersiz şehir seçimi"),
    district: z.string().min(1, "İlçe gerekli").max(100, "İlçe en fazla 100 karakter olabilir"),
    addressLine: z
      .string()
      .min(1, "Adres gerekli")
      .max(300, "Adres en fazla 300 karakter olabilir"),
    zipCode: z
      .string()
      .optional()
      .refine((value) => !value || zipCodeRegex.test(value), "Posta kodu 5 haneli olmalıdır"),
  })
  .superRefine((data, ctx) => {
    const validDistricts = getDistrictsForProvince(data.city)
    if (data.district && !validDistricts.includes(data.district)) {
      ctx.addIssue({
        code: "custom",
        message: "Seçilen ilçe, seçilen şehre ait değil",
        path: ["district"],
      })
    }
  })

export type AddressFormValues = z.infer<typeof addressSchema>
