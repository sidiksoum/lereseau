import { Outlet, Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  LogOut,
  Settings,
  BadgeCheck,
  Newspaper,
  Brain
} from "lucide-react"

export function AdminLayout() {
  const location = useLocation()

  const navItems = [
    { name: 'Vue d\'ensemble', href: '/admin', icon: LayoutDashboard },
    { name: 'CRM Utilisateurs', href: '/admin/crm', icon: Users },
    { name: 'Certifications (KYC)', href: '/admin/certifications', icon: BadgeCheck },
    { name: 'LeRéseau-Match (IA)', href: '/admin/matchmaking', icon: Brain },
    { name: 'Modération', href: '/admin/moderation', icon: ShieldAlert },
    { name: 'Gestion Contenu (CMS)', href: '/admin/cms', icon: Newspaper },
    { name: 'Paramètres Système', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Dark Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 bg-slate-950">
          <Link to="/admin" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <ShieldAlert className="h-6 w-6 text-indigo-400" />
            Admin Panel
          </Link>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 bg-slate-950">
          <Link to="/feed" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            <LogOut className="h-5 w-5" />
            Retourner au site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Mobile (Optionel si purement desktop, mais best practice) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 md:hidden">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldAlert className="h-6 w-6 text-indigo-600" />
            Admin
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
