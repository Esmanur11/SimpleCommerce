import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { addCartItem, getCart, removeCartItem, updateCartItem } from "../api/cart"
import type { CartView } from "../types/cart"
import { useCustomerAuth } from "./CustomerAuthContext"

interface CartContextValue {
  cart: CartView | null
  loading: boolean
  itemCount: number
  refresh: () => Promise<void>
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (cartItemId: string, quantity: number) => Promise<void>
  removeItem: (cartItemId: string) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { auth } = useCustomerAuth()
  const [cart, setCart] = useState<CartView | null>(null)
  const [loading, setLoading] = useState(false)
  const latestCustomerIdRef = useRef(auth?.customerId)
  latestCustomerIdRef.current = auth?.customerId

  const refresh = useCallback(async () => {
    const customerId = auth?.customerId
    if (!customerId) {
      setCart(null)
      return
    }
    setLoading(true)
    try {
      const data = await getCart(customerId)
      if (latestCustomerIdRef.current === customerId) setCart(data)
    } finally {
      if (latestCustomerIdRef.current === customerId) setLoading(false)
    }
  }, [auth?.customerId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addItem = async (variantId: string, quantity: number) => {
    if (!auth?.customerId) throw new Error("Giriş yapmalısınız")
    await addCartItem({ customerId: auth.customerId, variantId, quantity })
    await refresh()
  }

  const updateItem = async (cartItemId: string, quantity: number) => {
    await updateCartItem(cartItemId, { quantity })
    await refresh()
  }

  const removeItem = async (cartItemId: string) => {
    await removeCartItem(cartItemId)
    await refresh()
  }

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  const value = useMemo(
    () => ({ cart, loading, itemCount, refresh, addItem, updateItem, removeItem }),
    [cart, loading, itemCount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
