import { Link, useLocation } from "react-router-dom"
import { Home, Users, BookMarked, Briefcase, GraduationCap, Settings, MessageSquare } from "lucide-react"
import { cn } from "../../lib/utils"
import { useTranslation } from "react-i18next"

export function Sidebar() {
  const location = useLocation()
  const { t } = useTranslation()

  const navigation = [
    { name: t('nav.home'), href: '/feed', icon: Home },
    { name: t('nav.network'), href: '/network', icon: Users },
    { name: t('nav.docs'), href: '/library', icon: BookMarked },
    { name: t('nav.opportunities'), href: '/opportunities', icon: Briefcase },
    { name: t('nav.mentors'), href: '/mentors', icon: GraduationCap },
    { name: t('nav.forum'), href: '/forum', icon: MessageSquare },
  ]

  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex flex-1 flex-col gap-1">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href) && (item.href !== '/feed' || location.pathname === '/feed')
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white dark:hover:text-slate-200"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
              {item.name}
            </Link>
          )
        })}
      </div>
      <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-4">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            location.pathname.startsWith('/settings')
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white dark:hover:text-slate-200"
          )}
        >
          <Settings className={cn("h-5 w-5", location.pathname.startsWith('/settings') ? "text-blue-700 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
          {t('nav.settings')}
        </Link>
      </div>
    </div>
  )
}

export function MobileNav() {
  const location = useLocation()
  const { t } = useTranslation()
  
  // Menu épuré pour mobile type réseau social natif
  const mobileNav = [
    { name: t('nav.home'), href: '/feed', icon: Home },
    { name: t('nav.network'), href: '/network', icon: Users },
    { name: t('nav.docs'), href: '/library', icon: BookMarked },
    { name: t('nav.opportunities'), href: '/opportunities', icon: Briefcase },
    { name: t('nav.mentors'), href: '/mentors', icon: GraduationCap },
  ]

  return (
    <div className="flex h-14 w-full items-center justify-around px-1 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      {mobileNav.map((item) => {
        // Handle exact match for parent routes to not highlight falsely
        const isActive = location.pathname.startsWith(item.href) && (item.href !== '/feed' || location.pathname === '/feed')
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full transition-colors relative active:scale-95 pt-1",
              isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-1 bg-blue-600 dark:bg-blue-500 rounded-b-full"></div>}
            <item.icon className={cn("h-5 w-5 transition-all mb-1 mt-1", isActive ? "stroke-[2.5]" : "stroke-[1.5]")} />
            <span className="text-[10px] font-medium leading-none line-clamp-1 px-1 text-center">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
