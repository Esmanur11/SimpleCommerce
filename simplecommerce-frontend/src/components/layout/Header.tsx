import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import { useCustomerAuth } from "../../contexts/CustomerAuthContext"
import { routes } from "../../lib/routes"
import { getCategories } from "../../api/categories"
import type { Category } from "../../types/category"

const NAV_CATEGORY_NAMES = ["Kadın", "Erkek", "Aksesuar"] as const

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const location = useLocation()
  const { itemCount } = useCart()
  const { auth } = useCustomerAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const navLinkTo = (name: string) => {
    const category = categories.find((c) => c.name === name)
    return category ? `${routes.products}?category=${category.id}` : routes.products
  }

  const isWishlist = location.pathname === routes.wishlist
  const isAccount = location.pathname === routes.profile

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/90 backdrop-blur-md px-margin-mobile transition-all duration-300 ease-in-out md:px-margin-desktop ${
        scrolled ? "h-16 bg-surface/95 editorial-shadow" : "h-20"
      }`}
    >
      <nav className="mx-auto flex h-full w-full max-w-full items-center justify-between">
        <div className="hidden items-center space-x-stack-lg md:flex">
          {NAV_CATEGORY_NAMES.map((name) => (
            <Link
              key={name}
              className="font-body-md text-on-surface-variant transition-colors duration-300 hover:text-primary"
              to={navLinkTo(name)}
            >
              {name}
            </Link>
          ))}
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to={routes.home}>
            <h1 className="text-headline-xl font-headline-xl uppercase tracking-[0.3em] text-on-surface">
              IVOIRE
            </h1>
          </Link>
        </div>
        <div className="flex items-center space-x-stack-md text-primary">
          <Link
            className="p-2 transition-colors hover:text-primary-container"
            to={routes.products}
            state={{ focusSearch: true }}
            title="Ara"
          >
            <span className="material-symbols-outlined">search</span>
          </Link>
          <Link
            className={`p-2 transition-colors hover:text-primary-container ${isWishlist ? "border-b border-primary font-bold" : ""}`}
            to={routes.wishlist}
            title="Favorilerim"
          >
            <span
              className="material-symbols-outlined"
              style={isWishlist ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              favorite
            </span>
          </Link>
          <Link
            className="relative p-2 transition-colors hover:text-primary-container"
            to={routes.cart}
            title="Sepet"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary">
                {itemCount}
              </span>
            )}
          </Link>
          <Link
            className={`hidden p-2 transition-colors hover:text-primary-container md:block ${isAccount ? "border-b border-primary font-bold" : ""}`}
            to={auth ? routes.profile : routes.login}
            title="Hesabım"
          >
            <span className="material-symbols-outlined">person</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}
