import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Briefcase, MessageSquare } from 'lucide-react'
import { getAcceptedMentors } from '../../services/network'
import type { User } from '../../types/api'
import { getDisplayName, getProfileTitle } from './networkHelpers'

export function MentorsList() {
  const navigate = useNavigate()
  const [mentors, setMentors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMentors = async () => {
      setLoading(true)

      try {
        const connections = await getAcceptedMentors()
        console.log('🎓 Mentors acceptés:', connections)
        // Extraire les détails des mentors
        const users = connections.map((connection) => connection.targetUser).filter(Boolean)
        setMentors(users)
      } catch (error) {
        console.error('Erreur lors du chargement des mentors', error)
      } finally {
        setLoading(false)
      }
    }

    loadMentors()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-72 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    )
  }

  if (mentors.length === 0) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
        Aucun mentor n'a encore rejoint votre réseau. Parcourez les suggestions pour en trouver.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {mentors.map((mentor) => {
        const name = getDisplayName(mentor)
        const title = getProfileTitle(mentor)
        const avatarUrl = mentor.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=cbd5e1&color=64748b`

        return (
          <div
            key={mentor.id}
            className="group flex flex-col items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 relative overflow-hidden cursor-pointer"
            onClick={() => navigate(`/profile/${mentor.id}`)}
          >
            <div
              className={`absolute top-0 left-0 w-full h-16 border-b border-slate-100 z-0 ${mentor.coverUrl ? 'bg-cover bg-center' : 'bg-linear-to-r from-purple-50 to-pink-50'}`}
              style={mentor.coverUrl ? { backgroundImage: `url(${mentor.coverUrl})` } : {}}
            />

            <div className="h-20 w-20 rounded-full bg-slate-100 overflow-hidden mb-4 border-4 border-white shadow-sm ring-1 ring-slate-100 relative z-10 transition-transform duration-300 group-hover:scale-105">
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors text-center relative z-10">{name}</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 text-center line-clamp-1 relative z-10">{title}</p>
            <p className="text-[10px] text-slate-400 font-semibold mb-4 text-center uppercase tracking-wider relative z-10">{mentor.location || 'Localisation indisponible'}</p>

            <div className="w-full flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 py-2 rounded-lg relative z-10">
              <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {mentor.location || 'Non défini'}</div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-slate-400" /> {mentor.workDomain || mentor.institutionDetails || 'Aucune expérience'}</div>
            </div>

            <div className="w-full relative z-10">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 dark:text-slate-300 hover:bg-purple-600 hover:text-white transition-colors font-semibold text-sm border border-slate-200 hover:border-purple-600 group/btn">
                <MessageSquare className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover/btn:text-purple-200" /> Consulter
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
