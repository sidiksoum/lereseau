export function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">À propos de LeRéseau</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
            LeRéseau est un produit développé et exploité par INNOVTICA, une startup spécialisée dans la conception de solutions numériques pour le secteur de l'éducation.
          </p>
        </div>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Notre mission</h2>
          <p className="text-slate-600 dark:text-slate-400">
            INNOVTICA conçoit des applications web et mobiles pour faciliter l'apprentissage, la collaboration et la réussite académique. LeRéseau connecte étudiants, mentors et établissements autour de ressources pédagogiques et d'opportunités.
          </p>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Ce que nous proposons</h2>
          <ul className="list-inside list-disc space-y-2 text-slate-600 dark:text-slate-400">
            <li>Bibliothèque de documents pédagogiques validés.</li>
            <li>Réseau de mentors professionnels et académiques.</li>
            <li>Matchmaking intelligent pour bourses, stages et opportunités.</li>
            <li>Gestion des comptes avec authentification OTP et notifications de sécurité.</li>
          </ul>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">INNOVTICA</h2>
          <p className="text-slate-600 dark:text-slate-400">
            INNOVTICA est l'éditeur de LeRéseau. Notre ambition est de créer des solutions numériques fiables et accessibles pour les acteurs de l'éducation, en mettant l'accent sur la qualité, la sécurité et l'expérience utilisateur.
          </p>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Nos produits</h2>
          <p className="text-slate-600 dark:text-slate-400">
            LeRéseau fait partie d'un écosystème de solutions pensées pour les étudiants, les professionnels et les établissements éducatifs. Chaque produit vise à renforcer la réussite académique et la collaboration au sein de la communauté.
          </p>
        </section>
      </div>
    </div>
  )
}
