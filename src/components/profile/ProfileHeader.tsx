import { Camera, ShieldCheck, Sparkles, Star, Edit, MapPin, Mail, Link as LinkIcon, User, Building2 } from "lucide-react"

export function ProfileHeader({
  profile,
  displayedCover,
  displayedAvatar,
  openCoverPicker,
  openAvatarPicker,
  getRoleTitle,
  setIsEditing
}: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative mb-6">
      <div
        className={`h-48 relative group cursor-pointer ${displayedCover ? 'bg-slate-900' : profile.roleType === 'institution' ? 'bg-gradient-to-r from-amber-600 to-orange-500' : profile.roleType === 'professional' ? 'bg-gradient-to-r from-teal-600 to-emerald-700' : 'bg-gradient-to-r from-blue-600 to-indigo-700'}`}
        style={displayedCover ? { backgroundImage: `url(${displayedCover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        onClick={openCoverPicker}
      >
        {!displayedCover && <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2 font-medium">
            <Camera className="h-4 w-4" /> Modifier la couverture
          </button>
        </div>
      </div>

      <div className="px-6 pb-6 lg:px-10 relative">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 sm:-mt-20 mb-6">
          <div className="relative group">
            <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-white p-1.5 shadow-lg relative z-10 flex items-center justify-center overflow-hidden">
              {profile.roleType === 'institution' ? (
                <Building2 className="h-16 w-16 text-slate-300" />
              ) : displayedAvatar ? (
                <img src={displayedAvatar} alt="Mon Profil" className="h-full w-full rounded-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <User className="h-14 w-14" />
                </div>
              )}
            </div>
            <button onClick={openAvatarPicker} className="absolute bottom-2 right-2 z-20 h-10 w-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-slate-800 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 pb-2 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {profile.name}
                    {profile.roleType === 'institution' && <span title="Institution Vérifiée"><ShieldCheck className="h-6 w-6 text-blue-500" /></span>}
                    {profile.roleType === 'professional' && profile.openToMentoring && <span title="Mentor Vérifié"><ShieldCheck className="h-6 w-6 text-purple-500" /></span>}
                  </h1>
                  {profile.isPremium && (
                    <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm border border-yellow-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> PREMIUM
                    </span>
                  )}
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">{getRoleTitle()}</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0 items-center justify-start md:justify-end">
                {profile.roleType === 'professional' && profile.isPremium && profile.openToMentoring && (
                  <span className="px-3 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg flex items-center gap-2 text-sm border border-indigo-200 shadow-sm cursor-default">
                    <Star className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Top Mentor Recommandé (IA)</span>
                  </span>
                )}
                {profile.roleType === 'institution' && profile.isPremium && (
                  <span className="px-3 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-lg flex items-center gap-2 text-sm border border-emerald-200 shadow-sm cursor-default">
                    <Star className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Établissement Prioritaire</span>
                  </span>
                )}
                <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  <Edit className="h-4 w-4" /> Modifier le profil
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-400 font-medium border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> {profile.location}</div>
          <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /> {profile.email}</div>
          <div className="flex items-center gap-2"><LinkIcon className="h-4 w-4 text-slate-400" /> <a href="#" className="hover:text-blue-600 hover:underline">{profile.linkedin}</a></div>
        </div>
      </div>
    </div>
  )
}
