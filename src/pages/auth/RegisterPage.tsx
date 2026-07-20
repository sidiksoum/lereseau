import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import { registerUser, verifyEmail, resendOtp } from "../../services/auth"

type RegisterStep = 'FORM' | 'VERIFY_OTP' | 'SUCCESS'

export function RegisterPage() {
  const [step, setStep] = useState<RegisterStep>('FORM')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [roleType, setRoleType] = useState<'student' | 'professional' | 'institution'>('student')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await registerUser({ email, firstName, lastName, phone, roleType, password })
      
      setSuccess(result.detail || 'Compte créé. Un code a été envoyé.')
      setStep('VERIFY_OTP')
    } catch (err: any) {
      setError(err?.detail || err?.message || 'Impossible de créer le compte. Vérifiez vos informations.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = code.join('')
    if (otpCode.length !== 6) {
      setError('Veuillez entrer le code à 6 chiffres.')
      return
    }
    
    setError(null)
    setIsSubmitting(true)

    try {
      await verifyEmail(email, otpCode)
      setStep('SUCCESS')
    } catch (err: any) {
      setError(err?.detail || 'Code invalide. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      await resendOtp(email)
      setSuccess('Nouveau code envoyé !')
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

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`register-code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`register-code-${index - 1}`)
      prevInput?.focus()
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Faire partie de l'élite académique engagée</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Créez votre profil académique ou professionnel</p>
      </div>

      {step === 'FORM' && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <form className="space-y-4" onSubmit={handleRegister}>
            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prénom</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="Jean" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Kouassi" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="etudiant@ecole.ci" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Téléphone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+225 0123456789" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type de compte</label>
              <select value={roleType} onChange={(e) => setRoleType(e.target.value as any)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option value="student">Étudiant</option>
                <option value="professional">Professionnel</option>
                <option value="institution">Institution</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mot de passe</label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirmer</label>
                <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" required />
              </div>
            </div>

            <Button className="w-full mt-6" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création en cours...' : 'Rejoindre gratuitement'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Ou s'inscrire avec</span>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button type="button" className="flex items-center justify-center w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
            <button type="button" className="flex items-center justify-center w-full py-2.5 bg-[#1877F2] hover:bg-[#1864F2] text-white shadow-sm rounded-lg transition-colors border-transparent border dark:border-slate-800">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </button>
            <button type="button" className="flex items-center justify-center w-full py-2.5 bg-[#0A66C2] hover:bg-[#0A56C2] text-white shadow-sm rounded-lg transition-colors border-transparent border dark:border-slate-800">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Déjà membre ?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              Se connecter
            </Link>
          </div>
        </div>
      )}

      {step === 'VERIFY_OTP' && (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <button onClick={() => { setStep('FORM'); setError(null); setSuccess(null); }} className="mb-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-3 mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
             <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
             <p className="text-sm text-slate-700 dark:text-slate-300">
               Nous avons envoyé un code de vérification à <strong>{email}</strong>.
             </p>
          </div>
          
          <form onSubmit={handleVerify} className="space-y-6">
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
            <div className="flex justify-between gap-2">
              {code.map((digit, i) => (
                <input 
                  key={i}
                  id={`register-code-${i}`}
                  type="text" 
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-slate-900 dark:text-white"
                  required
                />
              ))}
            </div>
            <div className="flex justify-between items-center text-sm pt-2">
              <button 
                type="button" 
                onClick={handleResend}
                disabled={resendCooldown > 0 || isSubmitting}
                className="text-blue-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Vous n\'avez pas reçu le code ?'}
              </button>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold">
              {isSubmitting ? 'Vérification...' : 'Valider mon compte'}
            </Button>
          </form>
        </div>
      )}

      {step === 'SUCCESS' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 text-center py-6">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
             <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Compte vérifié !</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            Votre adresse e-mail a été confirmée avec succès. Vous pouvez maintenant vous connecter à votre compte.
          </p>
          <Link to="/login">
             <Button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold">
               Aller à la connexion
             </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
