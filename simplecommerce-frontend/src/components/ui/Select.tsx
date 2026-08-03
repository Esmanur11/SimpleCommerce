import { type SelectHTMLAttributes, forwardRef } from "react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  containerClassName?: string
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className = "", containerClassName = "", id, placeholder, children, ...props },
  ref,
) {
  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className="font-label-sm text-[10px] uppercase text-on-surface-variant"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`border-0 border-b border-outline-variant bg-transparent py-3 px-0 font-body-md focus:border-primary focus:ring-0 disabled:opacity-50 ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      {error && <span className="font-label-sm text-[10px] text-error">{error}</span>}
    </div>
  )
})
