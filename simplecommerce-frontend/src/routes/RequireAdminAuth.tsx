import { Navigate, Outlet } from "react-router-dom"
import { useAdminAuth } from "../contexts/AdminAuthContext"
import { routes } from "../lib/routes"

export function RequireAdminAuth() {
  const { auth } = useAdminAuth()

  if (!auth) {
    return <Navigate to={routes.adminLogin} replace />
  }

  return <Outlet />
}
