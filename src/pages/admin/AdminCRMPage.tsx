import { useState, useEffect } from "react"
import { Search, Filter, ShieldBan, ShieldAlert, UserX, UserMinus, ShieldCheck, Mail, PenSquare, Users, GraduationCap, Briefcase, Building2, UserCheck, Loader2, Trash2 } from "lucide-react"
import { getAdminUsers, getAdminUserStats, changeUserStatus, deleteUser, type AdminUserStats } from "../../services/admin"
import type { User } from "../../types/api"
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog"
import { Toast, useToast } from "../../components/ui/Toast"

export function AdminCRMPage() {
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<AdminUserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [skip, setSkip] = useState(0)
  const limit = 50
  
  const { toast, showToast, hideToast } = useToast()

  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type: 'danger' | 'warning' | 'success'
    confirmText: string
    loading: boolean
  }>({
    isOpen: false, title: '', message: '', onConfirm: () => {}, type: 'danger', confirmText: 'Confirmer', loading: false
  })

  const openConfirmationDialog = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'success' = 'danger', confirmText: string = 'Confirmer') => {
    setConfirmationDialog({ isOpen: true, title, message, onConfirm, type, confirmText, loading: false })
  }

  const closeConfirmationDialog = () => {
    setConfirmationDialog(prev => ({ ...prev, isOpen: false, loading: false }))
  }

  useEffect(() => {
    loadData()
  }, [skip])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersData, statsData] = await Promise.all([
        getAdminUsers(skip, limit),
        getAdminUserStats()
      ])
      setUsers(usersData)
      setStats(statsData)
    } catch (error) {
      console.error("Erreur", error)
      showToast("Erreur de chargement des données CRM", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await changeUserStatus(userId, newStatus)
      showToast(`Statut mis à jour (${newStatus})`, "success")
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus as any } : u))
    } catch (error) {
      console.error("Erreur lors du changement de statut", error)
      showToast("Erreur lors du changement de statut", "error")
    }
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    openConfirmationDialog(
      "Supprimer l'utilisateur",
      `Êtes-vous sûr de vouloir supprimer définitivement ${userName} ? Cette action est irréversible.`,
      async () => {
        setConfirmationDialog(prev => ({ ...prev, loading: true }))
        try {
          await deleteUser(userId)
          showToast("Utilisateur supprimé", "success")
          setUsers(users.filter(u => u.id !== userId))
          if (stats) setStats({ ...stats, totalUsers: stats.totalUsers - 1 })
        } catch (error) {
          console.error("Erreur de suppression", error)
          showToast("Erreur lors de la suppression", "error")
        } finally {
          closeConfirmationDialog()
        }
      },
      'danger',
      'Supprimer'
    )
  }

  const filteredUsers = users.filter(u => 
    `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-emerald-100 text-emerald-800'
      case 'PENDING': return 'bg-amber-100 text-amber-800'
      case 'BANNED': return 'bg-red-100 text-red-800'
      case 'SHADOWBANNED': return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <ShieldCheck className="h-3.5 w-3.5" />
      case 'BANNED': return <ShieldBan className="h-3.5 w-3.5" />
      case 'SHADOWBANNED': return <UserMinus className="h-3.5 w-3.5" />
      default: return <ShieldAlert className="h-3.5 w-3.5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CRM Utilisateurs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gestion de la base de données, bannissements et permissions.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors">
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-2">
              <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Étudiants</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalStudents}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-2">
              <Briefcase className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pro</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalProfessionals}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-2">
              <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Institutions</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalInstitutions}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-2">
              <UserCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Mentors</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalCertifiedMentors}</p>
          </div>
        </div>
      )}

      {/* Toolbar / Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-slate-900 dark:text-white transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium w-full sm:w-auto justify-center">
            <Filter className="h-4 w-4" /> Filtrer par Rôle
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
           <div className="flex justify-center items-center p-12">
             <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold">Identité</th>
                  <th className="px-6 py-4 font-semibold">Rôle & Date</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-center">Signalements (<ShieldAlert className="inline h-4 w-4" />)</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions de Modération</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">
                            {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                             <Mail className="h-3 w-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700 dark:text-slate-300">{user.roleType} - {user.role}</div>
                      <div className="text-xs text-slate-400">Inscrit le {new Date(user.createdAt || '').toLocaleDateString('fr-FR')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                         value={user.status || 'PENDING'} 
                         onChange={(e) => handleStatusChange(user.id, e.target.value)}
                         className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border-0 outline-none cursor-pointer appearance-none ${getStatusColor(user.status || 'PENDING')}`}
                       >
                         <option value="VERIFIED">Actif (VERIFIED)</option>
                         <option value="PENDING">En attente (PENDING)</option>
                         <option value="BANNED">Banni (BANNED)</option>
                         <option value="SHADOWBANNED">Shadowban</option>
                       </select>
                    </td>
                    <td className="px-6 py-4 text-center font-bold">
                      <span className={`${(user.reportsCount || 0) > 5 ? 'text-red-600 bg-red-50 px-2 py-1 rounded' : 'text-slate-400 dark:text-slate-500'}`}>
                        {(user.reportsCount || 0) > 0 ? user.reportsCount : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg tooltip" title="Éditer Profil" aria-label="Éditer">
                        <PenSquare className="h-4 w-4" />
                      </button>
                      
                      {user.status === 'BANNED' ? (
                         <button 
                           onClick={() => handleStatusChange(user.id, 'VERIFIED')}
                           className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                           title="Réhabiliter"
                         >
                           Réhabiliter
                         </button>
                      ) : (
                         <button 
                           onClick={() => handleStatusChange(user.id, 'BANNED')}
                           className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 rounded-lg tooltip transition-colors" 
                           title="Bannir Définitivement"
                         >
                           <UserX className="h-4 w-4" />
                         </button>
                      )}

                      <button 
                         onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                         className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg tooltip transition-colors ml-1" 
                         title="Supprimer le compte"
                      >
                         <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Dummy */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
           <span>Affichage {skip + 1}-{Math.min(skip + limit, stats?.totalUsers || 0)} sur {stats?.totalUsers || 0} utilisateurs</span>
           <div className="flex items-center gap-1">
             <button 
               onClick={() => setSkip(Math.max(0, skip - limit))}
               disabled={skip === 0}
               className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
             >
               Précédent
             </button>
             <button 
               onClick={() => setSkip(skip + limit)}
               disabled={!stats || skip + limit >= stats.totalUsers}
               className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
             >
               Suivant
             </button>
           </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={closeConfirmationDialog}
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        confirmText={confirmationDialog.confirmText}
        type={confirmationDialog.type}
        loading={confirmationDialog.loading}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
}
