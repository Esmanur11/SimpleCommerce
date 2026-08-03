import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useCustomerAuth } from "../contexts/CustomerAuthContext"
import { routes } from "../lib/routes"

export function RequireCustomerAuth() {
  const { auth } = useCustomerAuth()
  const location = useLocation()

  if (!auth) {
    return <Navigate to={routes.login} state={{ from: location }} replace />
  }

  return <Outlet />
}
