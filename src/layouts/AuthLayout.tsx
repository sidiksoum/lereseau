import { Outlet, Link } from "react-router-dom"
import { BookOpen } from "lucide-react"

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Colonne Gauche - Branding */}
      <div className="relative hidden w-1/2 overflow-hidden bg-blue-900 lg:block">
        <div className="absolute inset-0 bg-[url('https://www.francaisaletranger.fr/wp-content/uploads/2021/04/Sans-titre38.jpg')] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-overlay animate-[pulse_10s_ease-in-out_infinite]" style={{ transform: 'scale(1.05)' }} />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">LeRéseau</span>
          </Link>
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Connectez-vous avec l'élite académique.
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              Rejoignez des milliers d'étudiants et de professionnels pour échanger, apprendre et réussir.
            </p>
          </div>
        </div>
      </div>

      {/* Colonne Droite - Formulaire */}
      <div className="flex flex-1 flex-col justify-center bg-white dark:bg-slate-950 px-4 sm:px-6 lg:px-20 xl:px-24 transition-colors">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
