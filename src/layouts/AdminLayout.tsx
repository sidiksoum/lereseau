import { useState, useEffect } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  LogOut,
  Settings,
  BadgeCheck,
  Newspaper,
  Brain,
  Menu,
  X,
  LayoutGrid,
  ChevronRight
} from "lucide-react"

export function AdminLayout() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu automatically on navigation change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const navItems = [
    { name: "Vue d'ensemble", href: '/admin', icon: LayoutDashboard, desc: 'Analytics & KPIs' },
    { name: 'CRM Utilisateurs', href: '/admin/crm', icon: Users, desc: 'Gestion des membres' },
    { name: 'Certifications (KYC)', href: '/admin/certifications', icon: BadgeCheck, desc: 'Mentors & Institutions' },
    { name: 'LeRéseau-Match (IA)', href: '/admin/matchmaking', icon: Brain, desc: 'Matching intelligent' },
    { name: 'Modération', href: '/admin/moderation', icon: ShieldAlert, desc: 'Signalements & Abus' },
    { name: 'Gestion Contenu (CMS)', href: '/admin/cms', icon: Newspaper, desc: 'Actualités & Médias' },
    { name: 'Paramètres Système', href: '/admin/settings', icon: Settings, desc: 'Configuration' },
  ]

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      {/* Desktop Dark Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-col hidden md:flex shrink-0 border-r border-slate-800">
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
          <Link to="/admin" className="flex items-center gap-2.5 text-white font-bold text-xl tracking-tight">
            <ShieldAlert className="h-6 w-6 text-indigo-400" />
            <span>Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <Link to="/feed" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            <LogOut className="h-5 w-5" />
            <span>Retourner au site</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="h-16 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 md:hidden z-30 shadow-md">
        <Link to="/admin" className="flex items-center gap-2 font-bold text-lg text-white">
          <ShieldAlert className="h-6 w-6 text-indigo-400" />
          <span>Admin Panel</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-semibold border border-slate-700 bg-slate-800/50"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <>
              <X className="h-5 w-5 text-indigo-400" />
              <span>Fermer</span>
            </>
          ) : (
            <>
              <LayoutGrid className="h-5 w-5 text-indigo-400" />
              <span>Menu</span>
            </>
          )}
        </button>
      </header>

      {/* Mobile Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer / Grid overlay */}
      <div
        className={`fixed top-16 right-0 left-0 bottom-0 bg-slate-900 z-40 md:hidden overflow-y-auto transition-all duration-300 transform flex flex-col p-4 sm:p-6 border-t border-slate-800 ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Navigation Admin</h3>
          <p className="text-sm text-slate-300">Sélectionnez une rubrique pour y accéder directement :</p>
        </div>

        {/* Grid of menu cards for smartphone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className={`p-2.5 rounded-lg shrink-0 ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm truncate">{item.name}</span>
                    <ChevronRight className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-600'}`} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{item.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-800">
          <Link
            to="/feed"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 text-slate-300 font-medium text-sm hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Quitter l'administration</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
