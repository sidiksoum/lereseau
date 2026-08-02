import { Link } from "react-router-dom"

export function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contact</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
          Pour toute question concernant votre compte, l'utilisation de la plateforme ou le partenariat, écrivez-nous à l'équipe support de LeRéseau.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Support utilisateur</h2>
            <p className="text-slate-600 dark:text-slate-400">support@lereseau.site</p>
            <p className="text-slate-600 dark:text-slate-400">Horaires : du lundi au vendredi, 9h - 18h</p>
          </div>
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Partenariats</h2>
            <p className="text-slate-600 dark:text-slate-400">innovtica.intello211@gmail.com</p>
            <p className="text-slate-600 dark:text-slate-400">Pour les établissements, partenariats et intégrations.</p>
          </div>
        </div>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Nous écrire</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Vous pouvez nous contacter pour : assistance technique, demande de partenariat, signalement de contenu, besoin d'informations sur la sécurité ou les conditions d'utilisation.
          </p>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Si vous avez besoin d'aide pour reprendre le contrôle de votre compte ou pour comprendre nos conditions, notre équipe répond rapidement.
          </p>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Retour à l'accueil : <Link to="/" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">LeRéseau</Link>
          </p>
        </section>
      </div>
    </div>
  )
}
