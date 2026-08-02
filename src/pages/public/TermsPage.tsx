export function TermsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Conditions d'utilisation</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
            En utilisant LeRéseau, vous acceptez ces conditions générales d'utilisation de la plateforme LeRéseau, développée par INNOVTICA.
          </p>
        </div>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Accès et création de compte</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Pour accéder à la plateforme, vous devez créer un compte valide et vérifier votre adresse e-mail via un code OTP. Vous êtes responsable des informations fournies et de la confidentialité de votre mot de passe.
          </p>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Contenu et publications</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Les utilisateurs peuvent partager des documents, des offres et des messages. Le contenu doit respecter les règles de bonne conduite, la propriété intellectuelle et la législation applicable. Les contenus illicites ou inappropriés peuvent être retirés par INNOVTICA.
          </p>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Utilisation du service</h2>
          <p className="text-slate-600 dark:text-slate-400">
            LeRéseau propose un espace de partage de documents, de recherche de mentors, et d'accès à des opportunités professionnelles. Les utilisateurs Premium bénéficient d'un accès prioritaire à certains contenus. Les achats de documents sont gérés via des liens sécurisés.
          </p>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Responsabilité et assistance</h2>
          <p className="text-slate-600 dark:text-slate-400">
            INNOVTICA met en œuvre tous les moyens raisonnables pour assurer la disponibilité du service, sans garantir une absence totale d'interruption. En cas de problème, notre équipe de support est disponible via la page <a href="/contact" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Contact</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
