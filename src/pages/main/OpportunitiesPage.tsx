import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Briefcase, MapPin, Calendar, Heart, Search, Filter, Sparkles, Zap, ShieldCheck } from "lucide-react"
import { getOpportunities } from "../../services/opportunities"
import type { Opportunity } from "../../types/api"

export function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const data = await getOpportunities()
        setOpportunities(data)
      } catch (err) {
        setError('Erreur lors du chargement des opportunités')
        console.error('Error fetching opportunities:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [])

  const getOppImageUrl = (opp: Opportunity) => {
    if (opp.imageUrl || opp.bannerUrl) return opp.imageUrl || opp.bannerUrl;
    if (opp.attachments && opp.attachments.length > 0) {
      for (const a of opp.attachments) {
        if (typeof a === 'string') {
          if (a.includes('url=')) return a.split('url=')[1].split(';')[0].replace('}', '').trim();
          if (a.startsWith('http')) return a;
        } else if (a && typeof a === 'object' && a.url) {
          return a.url;
        }
      }
    }
    return '';
  };

  const filteredOpps = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Bourses & Opportunités</h1>
          <p className="text-blue-100 mb-6 text-lg">Découvrez des opportunités exclusives adaptées à votre profil académique et professionnel.</p>
          <div className="flex gap-4">
            <button className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm">Explorer les bourses</button>
            <button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-lg font-medium transition-colors backdrop-blur-sm">Offres de stage</button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      {/* Top Banner IA Match */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="bg-white/20 p-4 rounded-full shrink-0 relative z-10">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Alerte Premium ciblée par LeRéseau-Match
          </div>
          <h2 className="text-xl font-bold mb-1">Bourse Complète Data Science 2024</h2>
          <p className="text-emerald-50 text-sm">Détectée pour vous en fonction de vos intérêts (Intelligence Artificielle).</p>
        </div>
        <div className="relative z-10 shrink-0 mt-4 md:mt-0 w-full md:w-auto">
          <button
            onClick={() => navigate('/opportunities/premium')}
            className="w-full bg-white text-emerald-700 hover:bg-emerald-50 border-0 font-bold px-6 py-3 rounded-lg text-sm shadow-sm transition-colors">
            Postuler en Priorité
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recommandé pour vous</h2>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une offre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-64"
            />
          </div>
          <button className="flex items-center justify-center p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors shrink-0">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
              <div className="p-6">
                <div className="h-12 w-12 rounded-lg bg-slate-200 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <Briefcase className="h-12 w-12 text-slate-200 mb-3" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Erreur de chargement</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{error}</p>
          </div>
        ) : filteredOpps.length > 0 ? filteredOpps.map((opp) => {
          const bannerImgUrl = getOppImageUrl(opp);
          return (
          <div key={opp.id} onClick={() => navigate('/opportunities/' + opp.id)} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col cursor-pointer">
            {bannerImgUrl ? (
              <div className="h-40 overflow-hidden bg-slate-100 relative">
                <img
                  src={bannerImgUrl}
                  alt={`Visuel de ${opp.title}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                  }}
                />
                <div className="fallback-icon hidden absolute inset-0 flex items-center justify-center bg-blue-50 dark:bg-slate-900">
                  <Briefcase className="h-10 w-10 text-blue-600" />
                </div>
              </div>
            ) : (
              <div className="h-40 w-full bg-blue-50 dark:bg-slate-900 flex items-center justify-center">
                <Briefcase className="h-10 w-10 text-blue-600" />
              </div>
            )}
            <div className="p-6 flex-1 relative">
              <button className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-50 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <div className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full mb-3 border border-green-100">
                {opp.type}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">{opp.title}</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">{opp.organization} • <span className="text-blue-600 dark:text-blue-400">{opp.fundingSource}</span></p>

              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {opp.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> {opp.location}</div>}
                {opp.deadline && <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> Deadline: {new Date(opp.deadline).toLocaleDateString('fr-FR')}</div>}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2 py-1 rounded">Cible: {opp.targetAudience}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">{opp.amount}</span>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">Postuler &rarr;</button>
            </div>
          </div>
        )}) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <Briefcase className="h-12 w-12 text-slate-200 mb-3" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucune opportunité trouvée</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">Essayez avec d'autres mots-clés de recherche.</p>
          </div>
        )}
      </div>
    </div>
  )
}
