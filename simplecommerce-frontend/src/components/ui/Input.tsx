import { type InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", containerClassName = "", id, ...props },
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
      <input
        ref={ref}
        id={id}
        className={`border-0 border-b border-outline-variant bg-transparent py-3 px-0 font-body-md focus:border-primary focus:ring-0 ${className}`}
        {...props}
      />
      {error && <span className="font-label-sm text-[10px] text-error">{error}</span>}
    </div>
  )
})
