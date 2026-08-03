import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import { Button } from "../ui/Button"
import { addressSchema, type AddressFormValues } from "../../schemas/addressSchema"
import { getDistrictsForProvince, turkeyProvinceNames } from "../../data/turkeyProvinces"

export function AddressForm({
  onSubmit,
  onCancel,
  submitting,
}: {
  onSubmit: (values: AddressFormValues) => void
  onCancel: () => void
  submitting?: boolean
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({ resolver: zodResolver(addressSchema) })

  const selectedCity = watch("city")
  const phoneField = register("phone")

  return (
    <form
      className="checkout-card space-y-6 p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Adres Başlığı"
          placeholder="Ev"
          maxLength={50}
          error={errors.title?.message}
          {...register("title")}
        />
        <Input
          label="Ad Soyad"
          placeholder="Ahmet Yılmaz"
          maxLength={150}
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label="Telefon"
          placeholder="05xx xxx xx xx"
          inputMode="numeric"
          maxLength={11}
          error={errors.phone?.message}
          {...phoneField}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11)
            phoneField.onChange(e)
          }}
        />
        <Select
          label="Şehir"
          placeholder="Şehir seçin"
          error={errors.city?.message}
          {...register("city", {
            onChange: () => setValue("district", "", { shouldValidate: true }),
          })}
        >
          {turkeyProvinceNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
        <Select
          label="İlçe"
          placeholder={selectedCity ? "İlçe seçin" : "Önce şehir seçin"}
          disabled={!selectedCity}
          error={errors.district?.message}
          {...register("district")}
        >
          {getDistrictsForProvince(selectedCity).map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </Select>
        <Input
          label="Posta Kodu"
          placeholder="34330"
          inputMode="numeric"
          maxLength={5}
          error={errors.zipCode?.message}
          {...register("zipCode", {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 5)
            },
          })}
        />
        <div className="md:col-span-2">
          <Input
            label="Adres"
            placeholder="Mahalle, sokak, no, daire"
            maxLength={300}
            error={errors.addressLine?.message}
            {...register("addressLine")}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary"
        >
          Vazgeç
        </button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Kaydediliyor..." : "Adresi Kaydet"}
        </Button>
      </div>
    </form>
  )
}
