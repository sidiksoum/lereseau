import { Link } from "react-router-dom"

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Politique de confidentialité</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
            LeRéseau et INNOVTICA s'engagent à protéger les données personnelles de nos utilisateurs. Cette page explique comment nous collectons, utilisons et sécurisons les informations que vous nous confiez.
          </p>
        </div>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Données collectées</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Nous collectons les informations nécessaires à la création et à la gestion de votre compte : nom, adresse e-mail, rôle, établissement et informations de profil. Nous enregistrons également les données liées à l'utilisation de la plateforme pour améliorer votre expérience.
          </p>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Utilisation des données</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Les informations sont utilisées pour vérifier les comptes, envoyer des notifications de sécurité, gérer les publications, recommander des contenus et proposer des mentors pertinents. Les codes OTP sont envoyés uniquement pour l'authentification et la réinitialisation des mots de passe.
          </p>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Partage et sécurité</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Nous ne partageons pas vos données personnelles avec des tiers à des fins commerciales sans votre consentement. Les données sont protégées avec des mesures de sécurité adaptées, et nous utilisons des services tiers uniquement pour l'envoi d'e-mails transactionnels et l'hébergement des documents.
          </p>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Vos droits</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Vous pouvez accéder à vos données, les modifier ou demander leur suppression. Pour toute question ou demande liée à la confidentialité, contactez-nous via la page <Link to="/contact" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Contact</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
