import { useState, useEffect } from "react"
import { Check, X, Eye, Users, UserCheck, GraduationCap, Building2, Briefcase, Trash2, Loader2, ShieldAlert } from "lucide-react"
import { getAdminUsers, getAdminUserStats, changeUserStatus, deleteUser, type AdminUserStats } from "../../services/admin"
import type { User } from "../../types/api"
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog"
import { Toast, useToast } from "../../components/ui/Toast"

type RequestType = 'all' | 'mentor' | 'premium'

export function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<RequestType>('all')
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<AdminUserStats | null>(null)
  const [loading, setLoading] = useState(false)
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
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'danger',
    confirmText: 'Confirmer',
    loading: false
  })

  const openConfirmationDialog = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'success' = 'danger', confirmText: string = 'Confirmer') => {
    setConfirmationDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
      type,
      confirmText,
      loading: false
    })
  }

  const closeConfirmationDialog = () => {
    setConfirmationDialog(prev => ({ ...prev, isOpen: false, loading: false }))
  }

  const mentorRequests = [
    { id: 1, name: "Dr Oumar Sy", role: "Directeur de Recherche", domain: "Intelligence Artificielle", date: "12 Oct 2023", status: "pending" },
    { id: 2, name: "Aminata Diallo", role: "Senior Data Scientist", domain: "Data Science", date: "11 Oct 2023", status: "pending" },
  ]

  const premiumRequests = [
    { id: 3, name: "Alioune Fall", role: "Étudiant Master", amount: "5000 FCFA", paymentMethod: "Wave", date: "12 Oct 2023" },
    { id: 4, name: "Cédric K.", role: "Étudiant L3", amount: "10000 FCFA", paymentMethod: "Orange Money", date: "10 Oct 2023" }
  ]

  useEffect(() => {
    if (activeTab === 'all') {
      loadUsersAndStats()
    }
  }, [activeTab])

  const loadUsersAndStats = async () => {
    try {
      setLoading(true)
      const [usersData, statsData] = await Promise.all([
        getAdminUsers(0, 50),
        getAdminUserStats()
      ])
      setUsers(usersData)
      setStats(statsData)
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs", error)
      showToast("Erreur lors du chargement des données", "error")
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
      `Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur ${userName} ? Cette action est irréversible.`,
      async () => {
        setConfirmationDialog(prev => ({ ...prev, loading: true }))
        try {
          await deleteUser(userId)
          showToast("Utilisateur supprimé avec succès", "success")
          setUsers(users.filter(u => u.id !== userId))
          if (stats) {
            setStats({ ...stats, totalUsers: stats.totalUsers - 1 })
          }
        } catch (error) {
          console.error("Erreur lors de la suppression de l'utilisateur", error)
          showToast("Erreur lors de la suppression", "error")
        } finally {
          closeConfirmationDialog()
        }
      },
      'danger',
      'Supprimer'
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'PENDING': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'BANNED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'SHADOWBANNED': return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestion des Utilisateurs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">CRM et validation des comptes Mentors et Premium.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'all' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Tous les utilisateurs
        </button>
        <button
          onClick={() => setActiveTab('mentor')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'mentor' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Validations Mentorat ({mentorRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('premium')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'premium' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Vérifications Premium ({premiumRequests.length})
        </button>
      </div>

      {activeTab === 'all' && (
        <div className="space-y-6">
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

          {/* CRM Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Utilisateur</th>
                      <th className="px-6 py-4 font-semibold">Rôle & Type</th>
                      <th className="px-6 py-4 font-semibold">Statut</th>
                      <th className="px-6 py-4 font-semibold">Date d'inscription</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
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
                              <div className="font-medium text-slate-900 dark:text-white">{user.firstName} {user.lastName}</div>
                              <div className="text-xs text-slate-500">{user.email}</div>
                              {user.isPremium && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold ml-1 mt-1 inline-block">PREMIUM</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900 dark:text-white">{user.roleType}</div>
                          <div className="text-xs">{user.role}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={user.status || 'PENDING'}
                            onChange={(e) => handleStatusChange(user.id, e.target.value)}
                            className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border-0 outline-none cursor-pointer appearance-none ${getStatusColor(user.status || 'PENDING')}`}
                          >
                            <option value="VERIFIED">VERIFIED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="BANNED">BANNED</option>
                            <option value="SHADOWBANNED">SHADOWBANNED</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(user.createdAt || '').toLocaleDateString('fr-FR')}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 rounded-lg tooltip" title="Voir profil">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg tooltip" title="Supprimer">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table Content for Mentor and Premium (Mocked) */}
      {activeTab !== 'all' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
              <tr>
                <th className="px-6 py-4 font-semibold">Candidat</th>
                <th className="px-6 py-4 font-semibold">{activeTab === 'mentor' ? 'Domaine/Poste' : 'Détails Paiement'}</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {activeTab === 'mentor' && mentorRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{req.name}</td>
                  <td className="px-6 py-4 flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-white">{req.domain}</span>
                    <span className="text-xs">{req.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{req.date}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 rounded-lg tooltip" title="Voir infos">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 rounded-lg tooltip" title="Approuver">
                      <Check className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg tooltip" title="Rejeter">
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {activeTab === 'premium' && premiumRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{req.name}</td>
                  <td className="px-6 py-4 flex flex-col">
                    <span className="font-semibold text-amber-600">{req.amount}</span>
                    <span className="text-xs">via {req.paymentMethod}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{req.date}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1">
                      <Check className="h-3 w-3" /> Valider
                    </button>
                    <button className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg">
                      Rejeter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog */}
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

      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
}
