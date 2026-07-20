import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ArrowLeft, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { forgotPassword, verifyResetOtp, resetPassword } from '../../services/auth'

type RecoveryStep = 'IDENTIFY' | 'VERIFY_CODE' | 'RESET_PASSWORD' | 'SUCCESS'

export function ForgotPasswordPage() {
  const [step, setStep] = useState<RecoveryStep>('IDENTIFY')
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await forgotPassword(identifier)
      setSuccess('Un code de vérification a été envoyé à votre email.')
      setStep('VERIFY_CODE')
    } catch (err: any) {
      setError(err?.detail || err?.message || 'Impossible de trouver ce compte.')
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
      const result = await verifyResetOtp(identifier, otpCode)
      if (result.reset_token) {
        setResetToken(result.reset_token)
        setSuccess('Code vérifié!')
        setStep('RESET_PASSWORD')
      }
    } catch (err: any) {
      setError(err?.detail || 'Code invalide. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setIsSubmitting(true)

    try {
      await resetPassword(resetToken, newPassword)
      setStep('SUCCESS')
    } catch (err: any) {
      setError(err?.detail || 'Impossible de réinitialiser le mot de passe.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    
    setError(null)
    setIsSubmitting(true)

    try {
      await forgotPassword(identifier)
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

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 sm:border border-slate-200 dark:border-slate-800 sm:shadow-lg rounded-2xl p-6 sm:p-8">
        
        {step === 'IDENTIFY' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Trouvez votre compte</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Veuillez entrer votre adresse e-mail pour rechercher votre compte.
            </p>
            <form onSubmit={handleIdentify} className="space-y-6">
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
                <Input 
                  type="email" 
                  placeholder="Adresse e-mail" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="py-3"
                  required 
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" type="button" className="w-full py-5 text-slate-600 dark:text-slate-300">
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {isSubmitting ? 'Envoi...' : 'Rechercher'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 'VERIFY_CODE' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <button onClick={() => { setStep('IDENTIFY'); setError(null); }} className="mb-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Entrez le code de sécurité</h2>
            <div className="flex gap-3 mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
               <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
               <p className="text-sm text-slate-700 dark:text-slate-300">
                 Veuillez vérifier vos e-mails pour voir si un message contenant votre code s'y trouve. Votre code compte 6 chiffres.
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
                    id={`code-${i}`}
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
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" type="button" onClick={() => { setStep('IDENTIFY'); setError(null); }} className="flex-1 py-5 text-slate-600 dark:text-slate-300">
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {isSubmitting ? 'Vérification...' : 'Continuer'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 'RESET_PASSWORD' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Choisissez un nouveau mot de passe</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Créez un nouveau mot de passe d'au moins 8 caractères.
            </p>
            
            <form onSubmit={handleReset} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <Input 
                  type="password" 
                  placeholder="Nouveau mot de passe" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                  className="py-3" 
                />
                <Input 
                  type="password" 
                  placeholder="Confirmation du mot de passe" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  className="py-3" 
                />
              </div>
              <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                 <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                 <p className="text-xs text-slate-600 dark:text-slate-400">
                   Déconnectez-moi des autres appareils. Choisissez cette option si quelqu'un d'autre a utilisé votre compte.
                 </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" type="button" onClick={() => { setStep('IDENTIFY'); setError(null); }} className="flex-1 py-5 text-slate-600 dark:text-slate-300">
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {isSubmitting ? 'Réinitialisation...' : 'Réinitialiser'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
               <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Mot de passe réinitialisé !</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
              Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec vos nouveaux identifiants.
            </p>
            <Link to="/login">
               <Button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                 Retour à la connexion
               </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
