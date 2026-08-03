import { type ButtonHTMLAttributes, forwardRef } from "react"

type Variant = "primary" | "secondary" | "outline-white"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "border border-secondary text-secondary hover:bg-secondary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
  "outline-white":
    "border border-white text-white hover:bg-white hover:text-on-surface disabled:opacity-50",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className = "", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`py-4 px-6 font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
})
