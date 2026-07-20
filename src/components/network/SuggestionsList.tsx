import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, MapPin, Briefcase } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getUsers, sendConnectionRequest, getOutgoingRequests } from '../../services/network'
import type { User } from '../../types/api'
import { getDisplayName, getProfileMeta, getProfileTitle, getConnectionRequestType } from './networkHelpers'

export function SuggestionsList() {
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [requestingIds, setRequestingIds] = useState<string[]>([])
  const [sentRequestIds, setSentRequestIds] = useState<string[]>([])

  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true)
      try {
        // Charger les utilisateurs suggérés
        const users = await getUsers()
        const filtered = users.filter((candidate) => candidate.id !== currentUser?.id)
        setSuggestions(filtered)

        // Charger les demandes de connexion sortantes pour marquer "Demande envoyée"
        const outgoingRequests = await getOutgoingRequests()
        console.log('📤 Demandes sortantes:', outgoingRequests)
        const sentIds = outgoingRequests.map((req) => req.addresseeId)
        console.log('📤 IDs des demandes envoyées:', sentIds)
        setSentRequestIds(sentIds)
      } catch (error) {
        console.error('Erreur lors du chargement des suggestions de réseau', error)
      } finally {
        setLoading(false)
      }
    }

    if (currentUser?.id) {
      loadSuggestions()
    }
  }, [currentUser?.id])

  const handleConnect = async (suggestion: User) => {
    if (requestingIds.includes(suggestion.id) || sentRequestIds.includes(suggestion.id)) {
      return
    }

    const requestType = getConnectionRequestType(suggestion)
    setRequestingIds((current) => [...current, suggestion.id])
    try {
      await sendConnectionRequest(suggestion.id, requestType)
      setSentRequestIds((current) => [...current, suggestion.id])
    } catch (error) {
      console.error('Erreur lors de l’envoi de la demande de connexion', error)
    } finally {
      setRequestingIds((current) => current.filter((id) => id !== suggestion.id))
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-72 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
        Aucune suggestion pour le moment. Revenez plus tard pour découvrir de nouveaux profils.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {suggestions.map((suggestion) => {
        const name = getDisplayName(suggestion)
        const title = getProfileTitle(suggestion)
        const meta = getProfileMeta(suggestion)
        const isRequested = sentRequestIds.includes(suggestion.id)
        const isLoading = requestingIds.includes(suggestion.id)
        const avatarUrl = suggestion.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=cbd5e1&color=64748b`

        return (
          <div
            key={suggestion.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/profile/${suggestion.id}`)}
            className="group flex flex-col items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-hidden cursor-pointer"
          >
            <div
              className={`absolute top-0 left-0 w-full h-16 border-b border-slate-100 z-0 ${suggestion.coverUrl ? 'bg-cover bg-center' : 'bg-linear-to-r from-blue-50 to-indigo-50'}`}
              style={suggestion.coverUrl ? { backgroundImage: `url(${suggestion.coverUrl})` } : {}}
            />

            <div className="h-20 w-20 rounded-full bg-slate-100 overflow-hidden mb-4 border-4 border-white shadow-sm ring-1 ring-slate-100 relative z-10 transition-transform duration-300 group-hover:scale-105">
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors text-center relative z-10">{name}</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 text-center line-clamp-1 relative z-10">{title}</p>
            <p className="text-[10px] text-slate-400 font-semibold mb-4 text-center uppercase tracking-wider relative z-10">{meta}</p>

            <div className="w-full flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 py-2 rounded-lg relative z-10">
              <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {suggestion.location || 'Localisation indisponible'}</div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-slate-400" /> {suggestion.workDomain || suggestion.institutionDetails || 'Aucune info'}</div>
            </div>

            <div className="w-full relative z-10">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  handleConnect(suggestion)
                }}
                disabled={isRequested || isLoading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${isRequested ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'} ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
              >
                <UserPlus className="h-4 w-4" /> {isRequested ? 'Demande envoyée' : isLoading ? 'Envoi...' : 'Se connecter'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
