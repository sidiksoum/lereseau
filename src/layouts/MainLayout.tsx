import { Link, Outlet, useLocation } from "react-router-dom"
import { Navbar } from "../components/layout/Navbar"
import { Sidebar, MobileNav } from "../components/layout/Sidebar"
import { Briefcase, ArrowRight, MessageSquare } from "lucide-react"
import { FooterLinks } from "../components/layout/Footer"
import { ChatbotWidget } from "../components/ui/ChatbotWidget"

export function MainLayout() {
  const location = useLocation()

  // Affiche la sidebar droite seulement sur la page feed
  const isFeedPage = location.pathname === '/feed'

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar isAuthenticated={true} />

      {/* Increased padding-bottom on mobile to account for the fixed bottom navigation */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-start gap-6 px-4 py-4 sm:px-6 lg:px-8 pb-24 md:pb-6">

        {/* Sidebar Gauche Desktop */}
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-64 shrink-0 md:block">
          <Sidebar />
        </aside>

        {/* Contenu Central */}
        <main className="flex-1 w-full min-w-0 overflow-x-hidden md:overflow-visible">
          <Outlet />
        </main>

        {/* Sidebar Droite - Widgets */}
        {isFeedPage && (
          <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-80 shrink-0 lg:block overflow-y-auto pb-4 hide-scrollbar space-y-4">

            {/* Widget 1: Match IA */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">LeRéseau-Match IA</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Complétez votre profil pour découvrir des bourses et mentors adaptés.
              </p>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
                <div className="h-full w-1/3 rounded-full bg-amber-500" />
              </div>
              <p className="mt-2 text-xs text-slate-400">Profil complété à 30%</p>
            </div>

            {/* Widget 2: Bourses à la Une */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">Bourses à la Une</h3>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Bourse d'Excellence Master", org: "Fondation X", amount: "5000 €", match: "98%" },
                  { title: "Soutien Étudiants Data", org: "Tech For Good", amount: "2500 €", match: "92%" }
                ].map((bourse, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-8 w-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{bourse.title}</h4>
                        <p className="text-xs text-slate-500 mb-1">{bourse.org}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">{bourse.amount}</span>
                          <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">Match {bourse.match}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 flex items-center justify-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">
                Voir toutes les offres <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Widget 3: Mentors Recommandés */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">Mentors Recommandés</h3>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Dr. Jean Dupont", role: "Chercheur en IA", company: "CNRS", avatar: "11" },
                  { name: "Sophie Martin", role: "Lead Data Scientist", company: "TechCare", avatar: "5" }
                ].map((mentor, i) => (
                  <div key={i} className="group cursor-pointer flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=cbd5e1&color=64748b`} alt={mentor.name} className="h-10 w-10 rounded-full object-cover border border-slate-200 group-hover:border-blue-400 transition-colors shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{mentor.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{mentor.role}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">@ {mentor.company}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 flex items-center justify-center text-sm text-slate-700 font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Trouver un mentor
              </button>
            </div>

          </aside>
        )}
      </div>

      {/* Barre de navigation mobile style LinkedIn */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe">
        <MobileNav />
      </nav>

      {/* Bouton Forum Flottant (mobile) au dessus du chatbot */}
      <Link
        to="/forum"
        className="md:hidden fixed bottom-40 right-4 z-[45] h-14 w-14 bg-white border border-slate-200 text-slate-700 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-50 transition-transform active:scale-95"
      >
        <MessageSquare className="h-6 w-6 text-blue-600" />
      </Link>

      {/* Assistant IA Flottant visible sur toutes les pages de MainLayout */}
      <ChatbotWidget />
      <FooterLinks />
    </div>
  )
}
