import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { useAuth } from "../../contexts/AuthContext"

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login({ email, password })
      navigate('/feed', { replace: true })
    } catch (err: any) {
      setError(err?.message || err?.detail || 'Impossible de se connecter. Vérifiez vos identifiants.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">De retour sur LeRéseau</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Connectez-vous pour retrouver votre réseau</p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="etudiant@ecole.ci" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mot de passe</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-blue-600 focus:ring-blue-600" />
            Se souvenir de moi
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">Mot de passe oublié ?</Link>
        </div>
        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Ou continuer avec</span>
        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <button className="flex items-center justify-center w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </button>
        <button className="flex items-center justify-center w-full py-2.5 bg-[#1877F2] hover:bg-[#1864F2] text-white shadow-sm rounded-lg transition-colors border-transparent border dark:border-slate-800">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </button>
        <button className="flex items-center justify-center w-full py-2.5 bg-[#0A66C2] hover:bg-[#0A56C2] text-white shadow-sm rounded-lg transition-colors border-transparent border dark:border-slate-800">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Nouveau sur LeRéseau ?{' '}
        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          Créer un compte
        </Link>
      </div>
    </div>
  )
}
