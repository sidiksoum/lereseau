import { useEffect, useState } from 'react'
import { Check, X, ShieldCheck, UserPlus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getIncomingRequests, acceptConnectionRequest, declineConnectionRequest } from '../../services/network'
import type { IncomingRequest } from '../../types/api'

export function RequestsList() {
  const { user: currentUser } = useAuth()
  const [requests, setRequests] = useState<IncomingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string[]>([])

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true)
      try {
        const incomingRequests = await getIncomingRequests()
        console.log('📨 Demandes reçues:', incomingRequests)
        setRequests(incomingRequests)
      } catch (error) {
        console.error('Erreur lors du chargement des demandes reçues', error)
      } finally {
        setLoading(false)
      }
    }

    if (currentUser?.id) {
      loadRequests()
    }
  }, [currentUser?.id])

  const handleAction = async (requestId: string, accept: boolean) => {
    setProcessing((current) => [...current, requestId])
    try {
      if (accept) {
        await acceptConnectionRequest(requestId)
      } else {
        await declineConnectionRequest(requestId)
      }
      setRequests((current) => current.filter((request) => request.id !== requestId))
    } catch (error) {
      console.error('Erreur lors du traitement de la demande', error)
    } finally {
      setProcessing((current) => current.filter((id) => id !== requestId))
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-72 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <UserPlus className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aucune demande en attente</h3>
        <p className="text-slate-500 text-sm mt-1">Vous êtes à jour dans vos requêtes réseau.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {requests.map((request) => {
        const requester = request.requesterDetails
        const name = [requester.firstName, requester.lastName].filter(Boolean).join(' ') || requester.email || 'Membre'
        const role = requester.jobTitle || requester.studyDomain || requester.roleType || 'Profil'
        const company = requester.institutionDetails || requester.workDomain || requester.location || 'LeRéseau'
        const isProcessing = processing.includes(request.id)

        return (
          <div key={request.id} className="group flex flex-col bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
            {request.type?.toUpperCase().includes('MENTOR') && (
              <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm flex items-center gap-1 z-10">
                <ShieldCheck className="h-3 w-3" /> Demande Mentorat
              </div>
            )}

            <div className="flex items-start gap-3 mb-4 mt-2">
              <div className="h-14 w-14 rounded-full overflow-hidden shrink-0 border-2 border-slate-100 dark:border-slate-800">
                <img src={requester.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=cbd5e1&color=64748b`} alt={name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{name}</h3>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-1">{role}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{company}</p>
              </div>
            </div>

            <div className="flex gap-2 w-full mt-auto pt-4">
              <button
                type="button"
                onClick={() => handleAction(request.id, true)}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors disabled:opacity-60 disabled:cursor-wait"
              >
                <Check className="h-4 w-4" /> {isProcessing ? 'Traitement...' : 'Accepter'}
              </button>
              <button
                type="button"
                onClick={() => handleAction(request.id, false)}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-60 disabled:cursor-wait"
              >
                <X className="h-4 w-4" /> Refuser
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
