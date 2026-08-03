import { Outlet, useNavigate } from "react-router-dom"
import { Footer } from "./Footer"
import { routes } from "../../lib/routes"

export function CheckoutLayout() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col">
      <nav className="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-outline-variant/30 bg-surface px-6 md:px-margin-desktop">
        <button
          type="button"
          onClick={() => navigate(routes.cart)}
          className="flex items-center text-on-surface-variant transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="ml-2 hidden font-label-sm text-label-sm uppercase md:block">
            Sepete Dön
          </span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-headline-xl font-headline-xl uppercase tracking-[0.3em] text-on-surface select-none">
          IVOIRE
        </div>
        <span className="material-symbols-outlined text-[24px]">lock</span>
      </nav>
      <div className="flex-1 pt-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
