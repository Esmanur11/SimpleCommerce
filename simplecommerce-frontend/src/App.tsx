import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { CustomerAuthProvider } from "./contexts/CustomerAuthContext"
import { AdminAuthProvider } from "./contexts/AdminAuthContext"
import { CartProvider } from "./contexts/CartContext"
import { CustomerLayout } from "./components/layout/CustomerLayout"
import { CheckoutLayout } from "./components/layout/CheckoutLayout"
import { AdminLayout } from "./components/layout/AdminLayout"
import { RequireCustomerAuth } from "./routes/RequireCustomerAuth"
import { RequireAdminAuth } from "./routes/RequireAdminAuth"
import { routes } from "./lib/routes"

import { HomePage } from "./pages/customer/HomePage"
import { ProductListPage } from "./pages/customer/ProductListPage"
import { ProductDetailPage } from "./pages/customer/ProductDetailPage"
import { CartPage } from "./pages/customer/CartPage"
import { CheckoutPage } from "./pages/customer/CheckoutPage"
import { WishlistPage } from "./pages/customer/WishlistPage"
import { OrderHistoryPage } from "./pages/customer/OrderHistoryPage"
import { ProfilePage } from "./pages/customer/ProfilePage"
import { LoginPage } from "./pages/customer/LoginPage"
import { RegisterPage } from "./pages/customer/RegisterPage"

import { AdminLoginPage } from "./pages/admin/AdminLoginPage"
import { AdminProductListPage } from "./pages/admin/AdminProductListPage"
import { AdminProductDetailPage } from "./pages/admin/AdminProductDetailPage"
import { AdminProductCreatePage } from "./pages/admin/AdminProductCreatePage"
import { AdminCategoryPage } from "./pages/admin/AdminCategoryPage"
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage"

function App() {
  return (
    <BrowserRouter>
      <CustomerAuthProvider>
        <CartProvider>
          <AdminAuthProvider>
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: "#FFFDF9",
                  color: "#1d1b16",
                  border: "1px solid #E4D9C7",
                  borderRadius: "2px",
                },
              }}
            />
            <Routes>
              <Route element={<CustomerLayout />}>
                <Route path={routes.home} element={<HomePage />} />
                <Route path={routes.products} element={<ProductListPage />} />
                <Route path="/urunler/:id" element={<ProductDetailPage />} />
                <Route path={routes.login} element={<LoginPage />} />
                <Route path={routes.register} element={<RegisterPage />} />
                <Route element={<RequireCustomerAuth />}>
                  <Route path={routes.cart} element={<CartPage />} />
                  <Route path={routes.wishlist} element={<WishlistPage />} />
                  <Route path={routes.orders} element={<OrderHistoryPage />} />
                  <Route path={routes.profile} element={<ProfilePage />} />
                </Route>
              </Route>

              <Route element={<RequireCustomerAuth />}>
                <Route element={<CheckoutLayout />}>
                  <Route path={routes.checkout} element={<CheckoutPage />} />
                </Route>
              </Route>

              <Route path={routes.adminLogin} element={<AdminLoginPage />} />
              <Route element={<RequireAdminAuth />}>
                <Route element={<AdminLayout />}>
                  <Route path={routes.adminProducts} element={<AdminProductListPage />} />
                  <Route path={routes.adminProductNew} element={<AdminProductCreatePage />} />
                  <Route path="/admin/urunler/:id" element={<AdminProductDetailPage />} />
                  <Route path={routes.adminCategories} element={<AdminCategoryPage />} />
                  <Route path={routes.adminOrders} element={<AdminOrdersPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to={routes.home} replace />} />
            </Routes>
          </AdminAuthProvider>
        </CartProvider>
      </CustomerAuthProvider>
    </BrowserRouter>
  )
}

export default App
