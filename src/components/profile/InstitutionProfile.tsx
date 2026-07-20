import { Building2, Check, AlertCircle, Sparkles, Plus, X, Award, ShieldCheck } from "lucide-react"
import { useState } from "react"

export function InstitutionProfile({
  profile,
  flashMessage,
  isPendingPremium,
  isPendingCert,
  setIsPremiumModalOpen,
  getUpgradeButtonContent
}: any) {
  const [isPublishingJob, setIsPublishingJob] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* COLONNE GAUCHE (Main Content) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Présentation de la structure</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
            {profile.about}
          </p>
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">Détails institutionnels</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{profile.institutionDetails}</p>
          </div>
        </div>
      </div>

      {/* COLONNE DROITE (Side Content) */}
      <div className="flex flex-col gap-6">
        {flashMessage && (
          <div className="bg-emerald-100 border border-emerald-200 text-emerald-800 p-4 rounded-xl shadow-sm mb-4 animate-in fade-in slide-in-from-top-2 flex items-start gap-3">
            <Check className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{flashMessage}</p>
          </div>
        )}
        {(isPendingPremium || isPendingCert) && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl shadow-sm mb-4">
            <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Demande en cours de traitement
            </h3>
            <p className="text-xs">
              Votre demande {isPendingPremium && "Premium"} {isPendingPremium && isPendingCert && "et de "} {isPendingCert && "Certification"} est en attente de validation par un administrateur.
            </p>
          </div>
        )}

        {!profile.isPremium && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800/40 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-amber-900 dark:text-amber-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Devenir Certifié & Premium
            </h2>
            <p className="text-sm text-amber-800 dark:text-amber-200/80 mb-4">
              Mettez en avant votre structure, propulsez vos annonces et recrutez les meilleurs talents et étudiants.
            </p>
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg shadow-sm transition-colors text-left"
            >
              {getUpgradeButtonContent()}
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" /> Badges d'engagement
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {profile.isPremium ? (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                <div className="w-10 h-10 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2"><Sparkles className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-slate-700">Institution Premium</span>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center opacity-50 grayscale">
                <div className="w-10 h-10 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2"><Sparkles className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-slate-700">Premium (Bloqué)</span>
              </div>
            )}
            {profile.isPremium ? (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                <div className="w-10 h-10 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2"><ShieldCheck className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-slate-700">Agrément Officiel</span>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center opacity-50 grayscale">
                <div className="w-10 h-10 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2"><ShieldCheck className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-slate-700">Agrément (Bloqué)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
