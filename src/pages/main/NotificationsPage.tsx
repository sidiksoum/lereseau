import { Bell, UserPlus, Heart, MessageCircle, Briefcase } from "lucide-react"

export function NotificationsPage() {
  const notifications = [
    { type: 'connection', user: 'Alexandre Roy', avatar: 45, content: 'vous a envoyé une demande de connexion.', time: 'Il y a 10 min', read: false },
    { type: 'like', user: 'Sarah L.', avatar: 12, content: 'a aimé votre publication "Lancement de mon nouveau projet".', time: 'Il y a 1h', read: false },
    { type: 'comment', user: 'Dr. Martin', avatar: 33, content: 'a commenté votre question dans le forum Études.', time: 'Il y a 3h', read: true },
    { type: 'opportunity', user: 'LeRéseau Admin', avatar: 1, content: 'Une nouvelle bourse correspond à votre profil.', time: 'Hier', read: true },
    { type: 'connection', user: 'Marie Dubois', avatar: 20, content: 'a accepté votre demande de connexion.', time: 'Il y a 2 jours', read: true },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'connection': return <UserPlus className="h-4 w-4 text-blue-600" />
      case 'like': return <Heart className="h-4 w-4 text-rose-600" />
      case 'comment': return <MessageCircle className="h-4 w-4 text-green-600" />
      case 'opportunity': return <Briefcase className="h-4 w-4 text-amber-600" />
      default: return <Bell className="h-4 w-4 text-slate-600 dark:text-slate-400" />
    }
  }

  const getBg = (type: string) => {
    switch (type) {
      case 'connection': return 'bg-blue-100 border-blue-200'
      case 'like': return 'bg-rose-100 border-rose-200'
      case 'comment': return 'bg-green-100 border-green-200'
      case 'opportunity': return 'bg-amber-100 border-amber-200'
      default: return 'bg-slate-100 border-slate-200'
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Notifications</h1>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Tout marquer comme lu</button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {notifications.map((notif, i) => (
          <div key={i} className={`flex gap-4 p-5 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/30' : ''}`}>
            <div className="relative shrink-0">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(notif.user)}&background=cbd5e1&color=64748b`} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white ${getBg(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm text-slate-800 dark:text-slate-200">
                <span className="font-bold text-slate-900 dark:text-white">{notif.user}</span> {notif.content}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">{notif.time}</p>
            </div>
            {!notif.read && (
              <div className="shrink-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
