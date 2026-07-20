import { useState } from "react"
import { ShieldCheck, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { useAuth } from "../../contexts/AuthContext"

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { login, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const user = await login({ email, password })
      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
        await logout()
        setError('Accès administrateur refusé.')
        setLoading(false)
        return
      }
      // Replace history to prevent going back to login page
      window.history.replaceState(null, '', '/admin/dashboard')
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError('Identifiants admin invalides.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-center text-white">
          <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Portail Administrateur</h1>
          <p className="text-indigo-200 text-sm mt-2">Accès restreint au système LeRéseau</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Identifiant Administrateur</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@lereseau.ci" required className="bg-slate-50" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mot de passe sécurisé</label>
              <div className="relative">
                 <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required className="bg-slate-50 pl-10" />
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <Button 
               type="submit" 
               className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700"
               disabled={loading}
            >
              {loading ? "Vérification..." : "Connexion au Dashboard"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              &larr; Retour à l'accueil public
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
