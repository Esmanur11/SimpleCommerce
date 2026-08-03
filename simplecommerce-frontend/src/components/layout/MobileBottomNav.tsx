import { Link, useLocation } from "react-router-dom"
import { useCustomerAuth } from "../../contexts/CustomerAuthContext"
import { routes } from "../../lib/routes"

export function MobileBottomNav() {
  const location = useLocation()
  const { auth } = useCustomerAuth()

  const items = [
    { icon: "home", label: "Anasayfa", to: routes.home },
    { icon: "search", label: "Ara", to: routes.products },
    { icon: "shopping_bag", label: "Sepet", to: routes.cart },
    { icon: "person", label: "Profil", to: auth ? routes.profile : routes.login },
  ]

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-outline-variant/30 bg-surface px-4 shadow-lg md:hidden">
      {items.map((item) => {
        const isActive = location.pathname === item.to
        return (
          <Link
            key={item.label}
            to={item.to}
            className={`flex flex-col items-center ${isActive ? "font-bold text-primary" : "text-on-surface-variant"}`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="font-label-sm text-[10px] uppercase">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
