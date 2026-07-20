import { useState, useEffect } from "react"
import { Trophy, MessageCircle, Search, Filter, Sparkles, Star, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { getPremiumMentors } from "../../services/user"
import type { User } from "../../types/api"

export function MentorshipPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mentors, setMentors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { user: currentUser } = useAuth()

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true)
        const data = await getPremiumMentors()
        setMentors(data)
      } catch (err: any) {
        if (err?.response?.status === 403) {
          setError("L'accès à cette liste est strictement réservé aux utilisateurs Premium.")
        } else {
          setError("Seuls les utilisateurs Premium et les mentors certifiés peuvent accéder à cette page.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchMentors()
    }
  }, [currentUser])

  const filteredMentors = mentors.filter(mentor => {
    const fullName = `${mentor.firstName ?? ''} ${mentor.lastName ?? ''}`.toLowerCase()
    const role = (mentor.jobTitle || '').toLowerCase()
    const tags = Array.isArray(mentor.skills) ? mentor.skills : typeof mentor.skills === 'string' ? [mentor.skills] : []
    const query = searchQuery.toLowerCase()
    return fullName.includes(query) || role.includes(query) || tags.some((tag: string) => tag.toLowerCase().includes(query))
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium border border-blue-500/30 mb-4">
            <Trophy className="h-4 w-4" /> Programme Mentorat 2026
          </div>
          <h1 className="text-3xl font-bold mb-3">Trouvez votre Mentor IDÉAL</h1>
          <p className="text-slate-300 mb-6">Accélérez votre carrière en étant accompagné par des anciens qui ont réussi dans votre domaine.</p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors">Devenir Mentor</button>
        </div>
      </div>

      {/* Suggestion LeRéseau-Match (Premium IA) */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-4 md:p-6 shadow-xl border border-indigo-500/30 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
          <Sparkles className="w-16 h-16" />
        </div>
        <div className="flex items-center gap-4 flex-1 relative z-10 w-full">
          <div className="relative shrink-0">
            <img src="https://ui-avatars.com/api/?name=Dr+Touré&background=4f46e5&color=fff" alt="Avatar" className="w-16 h-16 rounded-full border-2 border-indigo-400" />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-full border-2 border-slate-900">
              <Star className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3" /> Recommandé par l'IA • Correspondance 98%
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">Dr. Amadou Touré</h3>
            <p className="text-sm text-indigo-200 font-medium">Data Scientist @ Microsoft Africa</p>
          </div>
        </div>
        <div className="w-full md:w-auto flex shrink-0 relative z-10 gap-2">
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 border-0 shadow-sm text-white px-4 py-2 font-bold rounded-lg text-sm transition-colors">
            Contacter
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Mentors disponibles</h2>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, rôle, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-72"
            />
          </div>
          <button className="flex items-center justify-center p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-500">Chargement des mentors...</p>
          </div>
        ) : error ? (
          <div className="col-span-full bg-slate-900 rounded-2xl p-8 text-center text-white border border-slate-800 flex flex-col items-center shadow-lg">
            <Lock className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Accès Restreint</h3>
            <p className="text-slate-300 max-w-md">{error}</p>
            {!currentUser?.isPremium && currentUser?.role !== 'ADMIN' && currentUser?.role !== 'SUPER_ADMIN' && (
              <button onClick={() => navigate('/settings')} className="mt-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Devenir Premium
              </button>
            )}
          </div>
        ) : filteredMentors.length > 0 ? filteredMentors.map((mentor) => {
          const fullName = `${mentor.firstName ?? ''} ${mentor.lastName ?? ''}`.trim() || 'Mentor Anonyme'
          const role = mentor.jobTitle || 'Professionnel'
          const quote = mentor.about || "Je vous accompagne dans vos projets d'orientation et de développement de carrière."
          const tags = Array.isArray(mentor.skills) ? mentor.skills : typeof mentor.skills === 'string' ? [mentor.skills] : []

          return (
            <div key={mentor.id} className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative">
              {mentor.isPremium && (
                <div className="absolute top-4 right-4 z-10 px-2.5 py-1 bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 text-[10px] font-bold rounded-md shadow-sm border border-yellow-300 flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Premium
                </div>
              )}
              <div className="h-24 bg-gradient-to-r from-blue-100 to-indigo-50 relative">
                {mentor.coverUrl && <img src={mentor.coverUrl} alt="Cover" className="w-full h-full object-cover" />}
                <div className="absolute -bottom-10 inset-x-0 mx-auto w-24 h-24 rounded-full bg-white p-1 shadow-sm">
                  <img src={mentor.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=cbd5e1&color=64748b`} alt={fullName} className="w-full h-full rounded-full object-cover" />
                </div>
              </div>
              <div className="pt-12 pb-6 px-6 text-center flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{fullName}</h3>
                <p className="text-sm text-blue-600 font-medium mb-4 line-clamp-1">{role}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {tags.slice(0, 3).map((tag: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium">#{tag}</span>
                  ))}
                  {tags.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium">+{tags.length - 3}</span>
                  )}
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 italic line-clamp-3">"{quote}"</p>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50">
                <button onClick={() => navigate(`/profile/${mentor.id}`)} className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                  Voir Profil
                </button>
                <button onClick={() => navigate(`/chat?userId=${mentor.id}`)} className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors">
                  <MessageCircle className="h-4 w-4" /> Solliciter
                </button>
              </div>
            </div>
          )
        }) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <Trophy className="h-12 w-12 text-slate-200 mb-3" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucun mentor trouvé</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">Essayez avec d'autres mots-clés de recherche.</p>
          </div>
        )}
      </div>
    </div>
  )
}
