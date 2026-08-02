import { Outlet } from "react-router-dom"
import { Navbar } from "../components/layout/Navbar"
import { FooterLinks } from "../components/layout/Footer"

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950 transition-colors">
      <Navbar isAuthenticated={false} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
