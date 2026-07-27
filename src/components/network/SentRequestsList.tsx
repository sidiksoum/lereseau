import { useEffect, useState } from 'react'
import { X, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getOutgoingRequests, declineConnectionRequest } from '../../services/network'
import type { OutgoingRequest } from '../../types/api'

export function SentRequestsList() {
  const { user: currentUser } = useAuth()
  const [requests, setRequests] = useState<OutgoingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string[]>([])

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true)
      try {
        const outgoingRequests = await getOutgoingRequests()
        console.log('📤 Demandes envoyées:', outgoingRequests)
        setRequests(outgoingRequests.filter((request) => request.status?.toLowerCase() === 'pending'))
      } catch (error) {
        console.error('Erreur lors du chargement des demandes envoyées', error)
      } finally {
        setLoading(false)
      }
    }

    if (currentUser?.id) {
      loadRequests()
    }
  }, [currentUser?.id])

  const handleCancelRequest = async (requestId: string) => {
    setProcessing((current) => [...current, requestId])
    try {
      await declineConnectionRequest(requestId)
      setRequests((current) => current.filter((request) => request.id !== requestId))
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la demande', error)
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
        <ShieldCheck className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aucune demande envoyée</h3>
        <p className="text-slate-500 text-sm mt-1">Vous n'avez envoyé aucune demande de connexion pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {requests.map((request) => {
        const addressee = request.addresseeDetails
        const name = [addressee.firstName, addressee.lastName].filter(Boolean).join(' ') || addressee.email || 'Membre'
        const role = addressee.jobTitle || addressee.studyDomain || addressee.roleType || 'Profil'
        const company = addressee.institutionDetails || addressee.workDomain || addressee.location || 'LeRéseau'
        const isProcessing = processing.includes(request.id)

        return (
          <div key={request.id} className="group flex flex-col bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            {request.type?.toUpperCase().includes('MENTOR') && (
              <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm flex items-center gap-1 z-10">
                <ShieldCheck className="h-3 w-3" /> Demande Mentorat
              </div>
            )}

            <div className="flex items-start gap-3 mb-4 mt-2">
              <div className="h-14 w-14 rounded-full overflow-hidden shrink-0 border-2 border-slate-100 dark:border-slate-800">
                <img src={addressee.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=cbd5e1&color=64748b`} alt={name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{name}</h3>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-1">{role}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{company}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-4 mt-auto">
              <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-2">
                Demande {request.type?.toLowerCase() === 'friend' ? 'd\'ami' : request.type?.toLowerCase() === 'mentorship' ? 'de mentorat' : 'de connexion'} envoyée
              </p>
            </div>

            <div className="w-full mt-auto">
              <button
                type="button"
                onClick={() => handleCancelRequest(request.id)}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-60 disabled:cursor-wait"
              >
                <X className="h-4 w-4" /> {isProcessing ? 'Annulation...' : 'Annuler la demande'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}