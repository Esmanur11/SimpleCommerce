import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAdminAuth } from "../../contexts/AdminAuthContext"
import { routes } from "../../lib/routes"

const navItems = [
  { label: "Ürünler", to: routes.adminProducts },
  { label: "Kategoriler", to: routes.adminCategories },
  { label: "Siparişler", to: routes.adminOrders },
]

export function AdminLayout() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate(routes.adminLogin)
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="flex h-20 items-center justify-between border-b border-outline-variant/30 px-margin-mobile md:px-margin-desktop">
        <Link to={routes.adminProducts}>
          <h1 className="text-headline-lg font-headline-lg uppercase tracking-[0.3em] text-on-surface">
            IVOIRE <span className="text-label-sm font-label-sm tracking-normal text-secondary">Admin</span>
          </h1>
        </Link>
        <nav className="hidden items-center space-x-stack-lg md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`font-body-md transition-colors hover:text-primary ${
                location.pathname.startsWith(item.to) ? "font-bold text-primary" : "text-on-surface-variant"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary"
        >
          Çıkış Yap
        </button>
      </header>
      <div className="flex-1 px-margin-mobile py-stack-lg md:px-margin-desktop">
        <Outlet />
      </div>
    </div>
  )
}
