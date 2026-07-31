import { Link } from "react-router-dom"
import { Bell, MessageSquare, Search, MoreVertical, Moon, Sun, ArrowLeft } from "lucide-react"
import { Button } from "../ui/Button"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../contexts/ThemeProvider"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"

export function Navbar({ isAuthenticated = false }) {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const {
    user,
    unreadNotificationsCount,
    unreadMessagesCount,
    clearUnreadNotifications,
    clearUnreadMessages
  } = useAuth()
  const profileName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email : 'Utilisateur'
  const profileAvatar = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=cbd5e1&color=64748b`

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('dark') // if 'system', just toggle manually to dark
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors">
      <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 relative">

        {/* --- MOBILE SEARCH BAR (Toggled State) --- */}
        {isSearchOpen && isAuthenticated && (
          <div className="absolute inset-0 z-10 flex items-center bg-white dark:bg-slate-900 px-3 sm:px-6 animate-in slide-in-from-right-2 fade-in duration-200">
            <button onClick={() => setIsSearchOpen(false)} className="h-10 w-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 flex items-center h-10 ml-2 bg-slate-100 dark:bg-slate-800 rounded-full px-4">
              <input autoFocus type="text" placeholder={t('nav.search')} className="w-full bg-transparent border-none outline-none text-[15px] text-slate-900 dark:text-slate-100 placeholder:text-slate-500" />
            </div>
          </div>
        )}

        <Link to="/feed" className={`flex items-center hover:opacity-90 transition-opacity flex-shrink-0 ${isSearchOpen ? 'opacity-0 pointer-events-none' : ''}`}>
          <img
            src="/logo-mobile.png"
            alt="LeRéseau"
            className="hidden md:block h-8 md:h-10 w-auto object-contain drop-shadow-sm dark:brightness-110"
          />
          <img
            src="/logo-mobile.png"
            alt="LR"
            className="block md:hidden h-10 w-10 object-contain rounded-xl shadow-sm"
          />
        </Link>

        {/* Barre de recherche style Facebook/LinkedIn (Desktop seulement) */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-full flex-1 max-w-md mx-6">
            <Search className="w-5 h-5 text-slate-500 dark:text-slate-400 mr-2 shrink-0" />
            <input type="text" placeholder={t('nav.search')} className="bg-transparent border-none outline-none text-[15px] w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-500 dark:text-slate-400 dark:placeholder:text-slate-400" />
          </div>
        )}

        {isAuthenticated ? (
          <div className={`flex items-center gap-2 sm:gap-3 flex-shrink-0 ${isSearchOpen ? 'opacity-0 pointer-events-none' : ''}`}>
            {/* Quick Theme Toggle */}
            <button onClick={toggleTheme} title="Changer le thème" className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0">
              {theme === 'dark' ? <Sun className="h-[22px] w-[22px]" /> : <Moon className="h-[22px] w-[22px]" />}
            </button>

            <button onClick={() => setIsSearchOpen(true)} title="Recherche" className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Search className="h-[22px] w-[22px]" />
            </button>
            <Link
              to="/notifications"
              onClick={clearUnreadNotifications}
              title="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Bell className="h-[22px] w-[22px]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </Link>
            <Link
              to="/chat"
              onClick={clearUnreadMessages}
              title="Messages"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
            >
              <MessageSquare className="h-[22px] w-[22px]" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </Link>
            <Link to="/profile" title="Mon Profil" className="ml-1 h-10 w-10 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ring-2 ring-transparent hover:ring-blue-500 dark:hover:ring-blue-400 transition-all block shrink-0">
              <img src={profileAvatar} className="w-full h-full object-cover" alt="Me" />
            </Link>
            <Link to="/settings" title="Paramètres" className="md:hidden flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors ml-1 shrink-0 p-1">
              <MoreVertical className="h-6 w-6" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t('nav.login')}
            </Link>
            <Link to="/register">
              <Button size="sm" className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 font-bold dark:bg-blue-500 dark:hover:bg-blue-600">{t('nav.register')}</Button>
              <Button size="sm" className="sm:hidden text-xs py-1.5 px-3 h-auto active:scale-95 transition-transform bg-blue-600 font-bold dark:bg-blue-500">{t('nav.register_short')}</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
