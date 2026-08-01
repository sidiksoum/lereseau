import type { ReactNode } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200">
        <img src="logo-lereseau.png" alt="Logo" className='absolute top-20' />
        <div className="flex items-center space-x-2 absolute bottom-10">
          <div className="w-6 h-6 bg-transparent border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-600 dark:text-blue-400">Chargement de la session...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return <Navigate to="/feed" replace />
  }

  return children
}
