import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building, MapPin, ArrowRight } from 'lucide-react'
import { getInstitutions, followInstitution } from '../../services/network'
import type { User } from '../../types/api'
import { getDisplayName, getProfileTitle } from './networkHelpers'

export function InstitutionsList() {
  const navigate = useNavigate()
  const [institutions, setInstitutions] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [followingIds, setFollowingIds] = useState<string[]>([])

  useEffect(() => {
    const loadInstitutions = async () => {
      setLoading(true)
      try {
        const results = await getInstitutions()
        setInstitutions(results)
      } catch (error) {
        console.error('Erreur lors du chargement des institutions', error)
      } finally {
        setLoading(false)
      }
    }

    loadInstitutions()
  }, [])

  const handleFollow = async (institutionId: string) => {
    if (followingIds.includes(institutionId)) {
      return
    }
    setFollowingIds((current) => [...current, institutionId])
    try {
      await followInstitution(institutionId)
    } catch (error) {
      console.error('Erreur lors du suivi de l’institution', error)
      setFollowingIds((current) => current.filter((id) => id !== institutionId))
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-72 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    )
  }

  if (institutions.length === 0) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
        Aucune institution n'est disponible pour le moment.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
      {institutions.map((institution) => {
        const name = getDisplayName(institution)
        const title = getProfileTitle(institution)
        const avatarUrl = institution.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=cbd5e1&color=64748b`
        const description = institution.institutionDetails || institution.about || 'Aucune description disponible.'
        const location = institution.location || 'Localisation indisponible'
        const followers = institution.points ? `${institution.points} abonnés` : 'Suivi disponible'
        const isFollowing = followingIds.includes(institution.id)

        return (
          <div key={institution.id} className="group flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div className="sm:w-1/3 bg-slate-100 flex items-center justify-center h-40 sm:h-auto overflow-hidden relative cursor-pointer" onClick={() => navigate(`/profile/${institution.id}`)}>
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent sm:hidden" />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{name}</h3>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{title}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 mb-3 line-clamp-2 md:line-clamp-3">{description}</p>

                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-5">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {location}</span>
                  <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {followers}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleFollow(institution.id)}
                  disabled={isFollowing}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold text-white transition-colors ${isFollowing ? 'bg-emerald-500 hover:bg-emerald-500' : 'bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white'}`}
                >
                  <Building className="w-4 h-4" /> {isFollowing ? 'Suivi' : 'Suivre'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/profile/${institution.id}`)}
                  className="flex flex-1 items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Voir page <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
