import { Briefcase, Calendar, GraduationCap, Check, AlertCircle, Sparkles, Zap, Award } from "lucide-react"

export function StudentProfile({
  profile,
  flashMessage,
  isPendingPremium,
  isPendingCert,
  setIsPremiumModalOpen,
  getUpgradeButtonContent
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* COLONNE GAUCHE (Main Content) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">À Propos</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
            {profile.about}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-500" /> Expériences & Projets
          </h2>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {profile.experiences.map((exp: any) => (
              <div key={exp.id} className="relative flex items-start gap-4 mb-4 z-10">
                <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 border-4 border-white flex items-center justify-center shadow-sm">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 flex-1 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{exp.title}</h3>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">{exp.company}</p>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mb-3"><Calendar className="w-3 h-3" /> {exp.startDate} - {exp.endDate}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
            {profile.experiences.length === 0 && <p className="text-slate-500 dark:text-slate-400 italic ml-14">Pas encore ajouté.</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-500" /> Formations
          </h2>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {profile.education.map((edu: any) => (
              <div key={edu.id} className="relative flex items-start gap-4 mb-4 z-10">
                <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-50 border-4 border-white flex items-center justify-center shadow-sm">
                  <GraduationCap className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 flex-1 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{edu.school}</h3>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">{edu.degree}</p>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mb-2"><Calendar className="w-3 h-3" /> {edu.startDate} - {edu.endDate}</p>
                  {edu.description && <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{edu.description}</p>}
                </div>
              </div>
            ))}
            {profile.education.length === 0 && <p className="text-slate-500 dark:text-slate-400 italic ml-14">Pas encore ajouté.</p>}
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
              <Sparkles className="w-5 h-5 text-amber-500" /> Passer à Premium
            </h2>
            <p className="text-sm text-amber-800 dark:text-amber-200/80 mb-4">
              Débloquez l'algorithme LeRéseau-Match, téléchargez des documents illimités, accédez à de meilleures recommandations d'opportunités et de bourses, Trouvez des mentors adaptés à votre profil pour vous orienter et restez alerter en temps réel.
            </p>
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-lg shadow-sm transition-colors text-left"
            >
              {getUpgradeButtonContent()}
            </button>
          </div>
        )}

        {profile.isPremium && (
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl border border-indigo-500/30 p-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10">
              <Zap className="h-32 w-32 text-indigo-300" />
            </div>
            <div className="relative z-10 text-center sm:text-left">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" /> Radar LeRéseau-Match
              </h2>
              <p className="text-indigo-200 text-xs mb-4">Votre abonnement Premium scrute activement la plateforme. Vous recevrez une alerte PUSH instantanée dès l'apparition d'une opportunité correspondante.</p>
              <div className="flex flex-col gap-2 text-xs font-bold w-full">
                <span className="bg-indigo-800/50 text-indigo-300 px-3 py-2 rounded-md border border-indigo-500/30 text-center sm:text-left truncate">Expertise: {profile.studyDomain}</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-md border border-emerald-500/30 flex items-center justify-center sm:justify-start gap-1"><Check className="h-3 w-3 shrink-0" /> Veille SMS (Active)</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-500" /> Compétences
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((tech: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm font-semibold">
                {tech}
              </span>
            ))}
            {profile.skills.length === 0 && <span className="text-sm text-slate-500 italic">Aucune compétence renseignée.</span>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" /> Badges d'engagement
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {profile.isPremium ? (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                <div className="w-10 h-10 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2"><Sparkles className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-slate-700">Membre Premium</span>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center opacity-50 grayscale">
                <div className="w-10 h-10 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2"><Sparkles className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-slate-700">Premium (Bloqué)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
