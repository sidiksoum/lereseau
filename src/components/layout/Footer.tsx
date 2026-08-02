import { Link } from "react-router-dom"

export function FooterLinks() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-950 transition-colors">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Politique de confidentialité</Link>
          <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Conditions d'utilisation</Link>
          <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
          <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">À propos</Link>
        </div>
        <p className="max-w-2xl text-xs leading-6 text-slate-500 dark:text-slate-400">
          LeRéseau est un produit développé et exploité par INNOVTICA, une startup spécialisée dans la conception de solutions numériques pour le secteur de l'éducation.
        </p>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} LeRéseau / INNOVTICA</p>
      </div>
    </footer>
  )
}
