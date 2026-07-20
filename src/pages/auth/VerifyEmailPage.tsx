import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { verifyEmail, resendOtp } from "../../services/auth"

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!otpCode || otpCode.length < 4) {
      setError('Veuillez entrer le code à 6 chiffres.')
      return
    }

    setIsSubmitting(true)

    try {
      await verifyEmail(email, otpCode)
      setSuccess('Email vérifié avec succès!')
      setTimeout(() => {
        navigate('/login?verified=true')
      }, 1500)
    } catch (err: any) {
      setError(err?.detail || 'Code invalide. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    
    setError(null)
    setIsSubmitting(true)

    try {
      await resendOtp(email)
      setSuccess('Nouveau code envoyé!')
      setResendCooldown(60)
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err: any) {
      setError(err?.detail || 'Impossible de renvoyer le code.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Vérification de l'email</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Entrez le code à 6 chiffres envoyé à<br />
          <span className="font-semibold text-blue-600 dark:text-blue-400">{email}</span>
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleVerify}>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
        
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            {success}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Code de vérification</label>
          <Input 
            value={otpCode} 
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
            type="text" 
            placeholder="000000" 
            maxLength={6}
            className="text-center text-2xl tracking-[0.5em] font-mono"
            required 
          />
        </div>

        <Button className="w-full mt-6" type="submit" disabled={isSubmitting || otpCode.length < 6}>
          {isSubmitting ? 'Vérification...' : 'Vérifier mon email'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Vous n'avez pas reçu le code ?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isSubmitting}
            className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer le code'}
          </button>
        </p>
      </div>

      <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          Retour à l'inscription
        </Link>
      </div>
    </div>
  )
}