import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, UserPlus, Heart, MessageCircle, Briefcase, Info } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { getNotifications, markAsRead, markAllAsRead, subscribePush, unsubscribePush } from "../../services/notifications"
import type { AppNotification } from "../../types/api"

const VAPID_PUBLIC_KEY = "BCqd9LIoVZbHi6yh5GAa4h24u59NUsD5sK2As6Bp-Hui78psNRDqcSCon12QJ6qruP1GJ-ck92SVXYJY6STB23k"

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const { updateUnreadNotificationsCount } = useAuth()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [pushSupported, setPushSupported] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)

  const checkPushSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setPushSupported(true)
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setPushEnabled(!!subscription)
      } catch (err) {
        console.warn('Error checking push manager subscription:', err)
      }
    }
  }

  const handleTogglePush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      if (pushEnabled) {
        const subscription = await registration.pushManager.getSubscription()
        if (subscription) {
          await subscription.unsubscribe()
          await unsubscribePush(subscription.endpoint)
        }
        setPushEnabled(false)
      } else {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          alert('Vous devez autoriser les notifications pour activer cette fonctionnalité.')
          return
        }
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        })
        await subscribePush(subscription)
        setPushEnabled(true)
      }
    } catch (err) {
      console.error('Erreur de configuration Push:', err)
      alert('Impossible d’activer les notifications sur cet appareil.')
    }
  }

  const loadNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getNotifications()
      setNotifications(data)
      updateUnreadNotificationsCount(data.filter(n => !n.isRead).length)
    } catch (err) {
      console.error("Erreur lors du chargement des notifications:", err)
      setError("Impossible de charger les notifications. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
    checkPushSubscription()
  }, [])

  const handleMarkAllRead = async () => {
    if (notifications.length === 0) return
    try {
      await markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      updateUnreadNotificationsCount(0)
    } catch (err) {
      console.error("Erreur lors du marquage de toutes les notifications:", err)
    }
  }

  const handleNotifClick = async (notif: AppNotification) => {
    if (!notif.isRead) {
      try {
        await markAsRead(notif.id)
        setNotifications(prev => {
          const next = prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n)
          updateUnreadNotificationsCount(next.filter(n => !n.isRead).length)
          return next
        })
      } catch (err) {
        console.error("Erreur lors du marquage comme lu:", err)
      }
    }

    // Redirection en fonction des données ou du type de notification
    if (notif.data) {
      if (notif.data.postId) {
        navigate(`/feed`)
      } else if (notif.data.connectionId) {
        navigate(`/network`)
      } else if (notif.data.topicId) {
        navigate(`/forum`)
      }
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'FRIEND_REQUEST':
        return <UserPlus className="h-4 w-4 text-blue-600" />
      case 'FEED_LIKE':
        return <Heart className="h-4 w-4 text-rose-600" />
      case 'FEED_COMMENT':
        return <MessageCircle className="h-4 w-4 text-green-600" />
      case 'FORUM_REPLY':
        return <MessageCircle className="h-4 w-4 text-purple-600" />
      case 'OPPORTUNITY_MATCH':
        return <Briefcase className="h-4 w-4 text-amber-600" />
      case 'FOLLOWER_POST':
        return <Bell className="h-4 w-4 text-emerald-600" />
      default:
        return <Bell className="h-4 w-4 text-slate-600 dark:text-slate-400" />
    }
  }

  const getBg = (type: string) => {
    switch (type) {
      case 'FRIEND_REQUEST':
        return 'bg-blue-100 border-blue-200 dark:bg-blue-950 dark:border-blue-900'
      case 'FEED_LIKE':
        return 'bg-rose-100 border-rose-200 dark:bg-rose-950 dark:border-rose-900'
      case 'FEED_COMMENT':
        return 'bg-green-100 border-green-200 dark:bg-green-950 dark:border-green-900'
      case 'FORUM_REPLY':
        return 'bg-purple-100 border-purple-200 dark:bg-purple-950 dark:border-purple-900'
      case 'OPPORTUNITY_MATCH':
        return 'bg-amber-100 border-amber-200 dark:bg-amber-950 dark:border-amber-900'
      case 'FOLLOWER_POST':
        return 'bg-emerald-100 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-900'
      default:
        return 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
    }
  }

  const getSenderName = (message: string) => {
    const parts = message.split(' ')
    if (parts.length > 1 && /^[A-Z]/.test(parts[0]) && /^[A-Z]/.test(parts[1])) {
      return `${parts[0]} ${parts[1]}`
    }
    return parts[0] || 'LeRéseau'
  }

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      if (diffMs < 0) return 'À l’instant'
      const diffMins = Math.floor(diffMs / 60000)
      if (diffMins < 1) return 'À l’instant'
      if (diffMins < 60) return `Il y a ${diffMins} min`
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) return `Il y a ${diffHours} h`
      const diffDays = Math.floor(diffHours / 24)
      if (diffDays === 1) return 'Hier'
      if (diffDays < 7) return `Il y a ${diffDays} jours`
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
    } catch {
      return 'Récemment'
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Notifications</h1>
        <button
          onClick={handleMarkAllRead}
          disabled={loading || notifications.length === 0 || !notifications.some(n => !n.isRead)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tout marquer comme lu
        </button>
      </div>

      {pushSupported && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 gap-3">
          <div className="flex items-center gap-3">
            <Bell className={`h-6 w-6 shrink-0 ${pushEnabled ? 'text-emerald-500' : 'text-slate-400'}`} />
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Notifications de l'appareil</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Recevez des alertes système en temps réel sur cet appareil.</p>
            </div>
          </div>
          <button
            onClick={handleTogglePush}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              pushEnabled
                ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {pushEnabled ? 'Désactiver' : 'Activer'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Chargement de vos notifications...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center gap-4">
          <Info className="h-8 w-8 text-rose-500" />
          <p className="text-slate-800 dark:text-slate-200 font-medium">{error}</p>
          <button
            onClick={loadNotifications}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center gap-3">
          <Bell className="h-10 w-10 text-slate-400 dark:text-slate-600 animate-pulse" />
          <p className="text-slate-800 dark:text-slate-200 font-medium">Vous n'avez pas encore de notifications</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Les alertes de connexion, commentaires et j'aime apparaîtront ici.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {notifications.map((notif) => {
            const senderName = getSenderName(notif.message)
            return (
              <div
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={`flex gap-4 p-5 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-blue-50/20 dark:bg-blue-950/10' : ''}`}
              >
                <div className="relative shrink-0">
                  <img
                    src={notif.senderDetails?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=cbd5e1&color=64748b`}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 ${getBg(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-slate-800 dark:text-slate-200">
                    {notif.message}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>
                {!notif.isRead && (
                  <div className="shrink-0 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

