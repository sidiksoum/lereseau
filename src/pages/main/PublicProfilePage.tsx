import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Link as LinkIcon, UserPlus, X, UserCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getUserById } from '../../services/user'
import { getAcceptedConnections, getOutgoingRequests, sendConnectionRequest, declineConnectionRequest } from '../../services/network'
import type { User, AcceptedConnection, OutgoingRequest } from '../../types/api'

export function PublicProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'accepted'>('none')
  const [requestId, setRequestId] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchProfile = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getUserById(id)
        setProfile(data)

        // Check connection status
        if (currentUser && data.id !== currentUser.id) {
          await checkConnectionStatus(data.id)
        }
      } catch (err) {
        setError('Impossible de charger le profil demandé.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id, currentUser])

  const getSubtitle = () => {
    if (!profile) return ''
    if (profile.roleType === 'student') {
      return [profile.educationLevel, profile.studyDomain].filter(Boolean).join(' • ')
    }
    if (profile.roleType === 'professional') {
      return [profile.jobTitle, profile.workDomain].filter(Boolean).join(' • ')
    }
    if (profile.roleType === 'institution') {
      return [profile.institutionType, profile.institutionDetails].filter(Boolean).join(' • ')
    }
    return ''
  }

  const canShowConnect = profile && currentUser && profile.id !== currentUser.id

  const checkConnectionStatus = async (profileId: string) => {
    try {
      // Check if they are already friends
      const acceptedConnections = await getAcceptedConnections()
      const isFriend = acceptedConnections.some((conn: AcceptedConnection) =>
        conn.targetUser?.id === profileId
      )

      if (isFriend) {
        setConnectionStatus('accepted')
        return
      }

      // Check if there's a pending outgoing request
      const outgoingRequests = await getOutgoingRequests()
      const pendingRequest = outgoingRequests.find((req: OutgoingRequest) =>
        req.addresseeDetails?.id === profileId && req.status === 'PENDING'
      )

      if (pendingRequest) {
        setConnectionStatus('pending')
        setRequestId(pendingRequest.id)
        return
      }

      // No connection
      setConnectionStatus('none')
    } catch (error) {
      console.error('Error checking connection status:', error)
      setConnectionStatus('none')
    }
  }

  const handleConnect = async () => {
    if (!profile) return

    try {
      await sendConnectionRequest(profile.id, 'FRIEND')
      setConnectionStatus('pending')
      // Refresh the status to get the request ID
      await checkConnectionStatus(profile.id)
    } catch (error) {
      console.error('Error sending connection request:', error)
    }
  }

  const handleCancelRequest = async () => {
    if (!requestId) return

    try {
      await declineConnectionRequest(requestId)
      setConnectionStatus('none')
      setRequestId(null)
    } catch (error) {
      console.error('Error canceling request:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto w-full min-w-0">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profil public</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Découvrez les informations publiques de ce membre.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative h-56 bg-slate-100 dark:bg-slate-800">
          {profile?.coverUrl ? (
            <img src={profile.coverUrl} alt="Couverture" className="h-full w-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent" />
          <div className="absolute left-6 bottom-0 translate-y-1/2 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 overflow-hidden h-28 w-28 shadow-lg">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.firstName || profile.lastName || 'Avatar'} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-200">?
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 pt-16 sm:px-10">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-3/5 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-2/5 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-700" />
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 p-6 border border-rose-100 dark:border-rose-800 text-sm text-rose-700 dark:text-rose-200">
              {error}
            </div>
          ) : profile ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">{profile.roleType || 'Membre'}</span>
                    {profile.location ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1"><MapPin className="h-3.5 w-3.5" /> {profile.location}</span>
                    ) : null}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{`${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || profile.email}</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{getSubtitle() || 'Aucune description disponible.'}</p>
                </div>
                <div className="flex gap-3">
                  {canShowConnect ? (
                    <button
                      type="button"
                      onClick={connectionStatus === 'none' ? handleConnect : connectionStatus === 'pending' ? handleCancelRequest : undefined}
                      disabled={connectionStatus === 'accepted'}
                      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                        connectionStatus === 'accepted'
                          ? 'bg-green-600 text-white cursor-not-allowed'
                          : connectionStatus === 'pending'
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {connectionStatus === 'accepted' ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Amis
                        </>
                      ) : connectionStatus === 'pending' ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Annuler
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Se connecter
                        </>
                      )}
                    </button>
                  ) : null}
                  {profile.linkedin ? (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                    >
                      <LinkIcon className="h-4 w-4" /> LinkedIn
                    </a>
                  ) : null}
                </div>
              </div>

              {profile.about ? (
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/60 p-6 border border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">À propos</h3>
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{profile.about}</p>
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                {profile.jobTitle || profile.workDomain ? (
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/60 p-6 border border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">Expérience</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{[profile.jobTitle, profile.workDomain].filter(Boolean).join(' • ')}</p>
                  </div>
                ) : null}
                {profile.institutionType || profile.institutionDetails ? (
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-950/60 p-6 border border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">Organisation</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{[profile.institutionType, profile.institutionDetails].filter(Boolean).join(' • ')}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 p-6 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              Aucune information de profil disponible.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
