import { Outlet } from "react-router-dom"
import { Navbar } from "../components/layout/Navbar"

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950 transition-colors">
      <Navbar isAuthenticated={false} />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-950 transition-colors">
        © {new Date().getFullYear()} LeRéseau. L'excellence académique.
      </footer>
    </div>
  )
}
