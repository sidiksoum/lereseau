import { useState, useEffect } from "react"
import { AlertCircle, Trash2, Hash, Plus, Loader, CheckCircle, Eye, BellOff, MessageSquare, User as UserIcon, FileText } from "lucide-react"
import { getAdminChannels, createChannel, deleteChannel, getReportedTopics, deleteTopic, getPendingTopics, authorizeTopic, getReportedReplies, deleteReply, ignoreReport, getTopicById } from "../../services/forum"
import { getUserById } from "../../services/user"
import type { ForumChannel, ForumTopic, ReportedReply } from "../../types/forum"
import type { User } from "../../types/api"
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog"
import { Toast, useToast } from "../../components/ui/Toast"

export function AdminModerationPage() {
  const [activeTab, setActiveTab] = useState<'signalisations' | 'validation' | 'channels'>('channels')
  const [channels, setChannels] = useState<ForumChannel[]>([])
  const [reportedTopics, setReportedTopics] = useState<ForumTopic[]>([])
  const [reportedReplies, setReportedReplies] = useState<ReportedReply[]>([])
  const [pendingTopics, setPendingTopics] = useState<ForumTopic[]>([])
  const [loading, setLoading] = useState(false)
  const [channelName, setChannelName] = useState("")
  const [channelDescription, setChannelDescription] = useState("")

  // Cache for author and topic details
  const [authorsCache, setAuthorsCache] = useState<Record<string, User>>({})
  const [topicsCache, setTopicsCache] = useState<Record<string, ForumTopic>>({})

  // Toast notification
  const { toast, showToast, hideToast } = useToast()

  // Confirmation dialog state
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
    setConfirmationDialog(prev => ({ ...prev, isOpen: false }))
  }

  useEffect(() => {
    loadChannels()
    loadReportedTopics()
    loadPendingTopics()
    loadReportedReplies()
  }, [])

  const loadChannels = async () => {
    try {
      setLoading(true)
      const data = await getAdminChannels()
      setChannels(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des canaux:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPendingTopics = async () => {
    try {
      const data = await getPendingTopics()
      setPendingTopics(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des sujets en attente:', error)
    }
  }

  const loadReportedTopics = async () => {
    try {
      const data = await getReportedTopics()
      setReportedTopics(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des sujets signalés:', error)
    }
  }

  const loadReportedReplies = async () => {
    try {
      const data = await getReportedReplies()
      const validData = data || []
      setReportedReplies(validData)

      // Load author and topic details for each reply
      for (const reply of validData) {
        // Load author if not cached
        if (!authorsCache[reply.authorId]) {
          try {
            const author = await getUserById(reply.authorId)
            setAuthorsCache(prev => ({ ...prev, [reply.authorId]: author }))
          } catch (e) {
            console.error('Error loading author:', e)
          }
        }
        // Load topic if not cached
        if (!topicsCache[reply.topicId]) {
          try {
            const topic = await getTopicById(reply.topicId)
            setTopicsCache(prev => ({ ...prev, [reply.topicId]: topic }))
          } catch (e) {
            console.error('Error loading topic:', e)
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réponses signalées:', error)
    }
  }

  const handleCreateChannel = async () => {
    if (!channelName.trim() || !channelDescription.trim()) return

    try {
      const slug = channelName.toLowerCase().replace(/\s+/g, '-')
      await createChannel({
        name: channelName,
        slug,
        description: channelDescription
      })
      setChannelName("")
      setChannelDescription("")
      loadChannels()
    } catch (error) {
      console.error('Erreur lors de la création du canal:', error)
    }
  }

  const handleDeleteChannel = async (channelId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce canal ?')) return

    try {
      await deleteChannel(channelId)
      loadChannels()
    } catch (error) {
      console.error('Erreur lors de la suppression du canal:', error)
    }
  }

  const handleAuthorizeTopic = async (topicId: string) => {
    try {
      await authorizeTopic(topicId)
      loadPendingTopics()
    } catch (error) {
      console.error('Erreur lors de l\'approbation du sujet:', error)
    }
  }

  const handleRejectTopic = async (topicId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir rejeter ce sujet ?')) return

    try {
      await deleteTopic(topicId)
      loadPendingTopics()
    } catch (error) {
      console.error('Erreur lors du rejet du sujet:', error)
    }
  }

  const handleDeleteTopic = async (topicId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce sujet ?')) return

    try {
      await deleteTopic(topicId)
      loadReportedTopics()
    } catch (error) {
      console.error('Erreur lors de la suppression du sujet:', error)
    }
  }

  const handleDeleteReply = async (replyId: string) => {
    openConfirmationDialog(
      'Supprimer la réponse',
      'Êtes-vous sûr de vouloir supprimer cette réponse signalée ? Cette action est irréversible.',
      async () => {
        setConfirmationDialog(prev => ({ ...prev, loading: true }))
        try {
          await deleteReply(replyId)
          closeConfirmationDialog()
          showToast('Réponse supprimée avec succès', 'success')
          loadReportedReplies()
        } catch (error) {
          console.error('Erreur lors de la suppression de la réponse:', error)
          setConfirmationDialog(prev => ({ ...prev, loading: false }))
          showToast('Erreur lors de la suppression', 'error')
        }
      },
      'danger',
      'Supprimer'
    )
  }

  const handleIgnoreReport = async (replyId: string) => {
    openConfirmationDialog(
      'Ignorer le signalement',
      'Êtes-vous sûr de vouloir ignorer ce signalement ? La réponse ne sera plus affichée comme signalée.',
      async () => {
        setConfirmationDialog(prev => ({ ...prev, loading: true }))
        try {
          await ignoreReport(replyId)
          closeConfirmationDialog()
          showToast('Signalement ignoré', 'success')
          loadReportedReplies()
        } catch (error) {
          console.error('Erreur lors de l\'ignorance du signalement:', error)
          setConfirmationDialog(prev => ({ ...prev, loading: false }))
          showToast('Erreur lors de l\'ignorance', 'error')
        }
      },
      'warning',
      'Ignorer'
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Centre de Modération</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gardez la plateforme sûre et pertinente.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('signalisations')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'signalisations' ? 'border-red-600 text-red-600 dark:border-red-500 dark:text-red-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <AlertCircle className="h-4 w-4" /> Signalements ({reportedTopics.length + reportedReplies.length})
        </button>
        <button
          onClick={() => setActiveTab('validation')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'validation' ? 'border-yellow-600 text-yellow-600 dark:border-yellow-500 dark:text-yellow-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Eye className="h-4 w-4" /> Validation Sujets
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'channels' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Hash className="h-4 w-4" /> Gestion des Canaux
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeTab === 'signalisations' && (
          <div className="space-y-6">
            {/* Sujets signalés */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" /> Sujets signalés
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">{reportedTopics.length}</span>
              </div>
              <div className="space-y-3">
                {reportedTopics.length > 0 && reportedTopics.map(topic => (
                  <div key={topic.id} className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">{topic.reportsCount} signalements</span>
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{topic.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 italic">"{topic.content}"</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" /> Supprimer
                      </button>
                    </div>
                  </div>
                ))}
                {reportedTopics.length === 0 && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-4">Aucun sujet signalé.</p>
                )}
              </div>
            </div>

            {/* Réponses signalées */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-orange-500" /> Réponses signalées
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">{reportedReplies.length}</span>
              </div>
              <div className="space-y-3">
                {reportedReplies.length > 0 && reportedReplies.map(reply => {
                  const author = authorsCache[reply.authorId]
                  const topic = topicsCache[reply.topicId]
                  return (
                    <div key={reply.id} className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-900/30">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div className="flex-1">
                          {/* Author and Topic Info */}
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                              <UserIcon className="h-3 w-3" />
                              <span className="font-medium">Auteur:</span>
                              {author ? (
                                <span>{author.firstName} {author.lastName}</span>
                              ) : (
                                <span className="text-slate-400">#{reply.authorId.slice(0, 8)}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                              <FileText className="h-3 w-3" />
                              <span className="font-medium">Sujet:</span>
                              {topic ? (
                                <span className="max-w-[200px] truncate">{topic.title}</span>
                              ) : (
                                <span className="text-slate-400">#{reply.topicId.slice(0, 8)}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">{reply.reportsCount} signalements</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(reply.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                          {/* Reply Content */}
                          <p className="text-slate-800 dark:text-white text-sm line-clamp-2 italic bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">"{reply.content}"</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleIgnoreReport(reply.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
                            title="Ignorer le signalement"
                          >
                            <BellOff className="h-4 w-4" /> Ignorer
                          </button>
                          <button
                            onClick={() => handleDeleteReply(reply.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" /> Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {reportedReplies.length === 0 && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-4">Aucune réponse signalée.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Sujets en attente de validation</h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">{pendingTopics.length} en attente</span>
              </div>
              <div className="space-y-3">
                {pendingTopics.length > 0 && pendingTopics.map((topic) => (
                  <div key={topic.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">#{topic.channelId}</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">Auteur: {topic.authorDetails?.firstName} {topic.authorDetails?.lastName}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{topic.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 italic bg-white dark:bg-slate-700 p-2 rounded border border-slate-100 dark:border-slate-600">"{topic.content}"</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAuthorizeTopic(topic.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                      >
                        <CheckCircle className="h-4 w-4" /> Valider
                      </button>
                      <button
                        onClick={() => handleRejectTopic(topic.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                      >
                        <Trash2 className="h-4 w-4" /> Rejeter
                      </button>
                    </div>
                  </div>
                ))}
                {pendingTopics.length === 0 && (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    Aucun sujet en attente de validation.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'channels' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Créer un nouveau Canal</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="Ex: intelligence-artificielle"
                  className="flex-1 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={channelDescription}
                  onChange={(e) => setChannelDescription(e.target.value)}
                  placeholder="Description courte..."
                  className="flex-1 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleCreateChannel}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                  {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Ajouter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map(channel => (
                <div key={channel.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><Hash className="h-4 w-4" /> {channel.name}</span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-semibold">Gérer</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{channel.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteChannel(channel.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 w-max">
                    <Trash2 className="h-4 w-4" /> Supprimer ce canal
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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




