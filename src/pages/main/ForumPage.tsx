import { useState, useEffect } from "react"
import { MessageSquare, Eye, TrendingUp, Search, Hash, Plus, X, Heart, CornerDownRight, Image as ImageIcon, Send, Loader, Flag } from "lucide-react"
import { getChannels, getChannelTopics, createTopic, getTopicReplies, createReply, likeReply, reportReply, incrementTopicViews } from "../../services/forum"
import type { ForumChannel, ForumTopic, ForumReply } from "../../types/forum"
import { ConfirmationDialog } from "../../components/ui/ConfirmationDialog"
import { Toast, useToast } from "../../components/ui/Toast"

export function ForumPage() {
  const [channels, setChannels] = useState<ForumChannel[]>([])
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [pendingTopics, setPendingTopics] = useState<ForumTopic[]>([])
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null)
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false)
  const [topicTitle, setTopicTitle] = useState("")
  const [topicContent, setTopicContent] = useState("")
  const [replyContent, setReplyContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingReplies, setLoadingReplies] = useState(false)

  // Dialog de confirmation
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

  // Fonctions helper pour le dialog
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

  // Toast pour les notifications
  const { toast, showToast, hideToast } = useToast()

  // Load channels on mount
  useEffect(() => {
    loadChannels()
  }, [])

  // Load topics when selected channel changes
  useEffect(() => {
    if (selectedChannelId) {
      loadTopics()
    }
  }, [selectedChannelId])

  const loadChannels = async () => {
    try {
      setLoading(true)
      const data = await getChannels()
      setChannels(data)
      if (data.length > 0 && !selectedChannelId) {
        setSelectedChannelId(data[0].id)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des canaux:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTopics = async () => {
    if (!selectedChannelId) return
    try {
      setLoading(true)
      const data = await getChannelTopics(selectedChannelId)
      setTopics(data.filter(t => t.status === 'APPROVED'))
      setPendingTopics(data.filter(t => t.status === 'PENDING'))
      setSelectedTopic(null) // Remettre le sujet sélectionné à null
      setReplies([]) // Vider les réponses
    } catch (error) {
      console.error('Erreur lors du chargement des sujets:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReplies = async (topicId: string) => {
    try {
      console.log('Loading replies for topic:', topicId)
      setLoadingReplies(true)
      const data = await getTopicReplies(topicId)
      console.log('Received replies data:', data, 'length:', data?.length)
      if (data && Array.isArray(data)) {
        setReplies([...data]) // Force un nouveau tableau
        console.log('Replies state updated, new length:', data.length)
      } else {
        console.warn('Received invalid data format:', data)
        setReplies([])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réponses:', error)
      setReplies([])
    } finally {
      setLoadingReplies(false)
    }
  }

  const handleSelectTopic = async (topic: ForumTopic) => {
    console.log('Selecting topic:', topic.id, topic.title)
    setSelectedTopic(topic)
    setReplies([]) // Vider les réponses précédentes immédiatement

    try {
      await incrementTopicViews(topic.id)
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error)
      // Ne pas bloquer le chargement des réponses si cela échoue
    }

    await loadReplies(topic.id)
  }

  const handleLikeReply = async (replyId: string) => {
    // Mise à jour optimiste : modifier l'état local immédiatement
    setReplies(prevReplies =>
      prevReplies.map(reply =>
        reply.id === replyId
          ? { ...reply, likesCount: reply.likesCount + 1 }
          : reply
      )
    )

    try {
      await likeReply(replyId)
      // Le like a réussi, l'état local est déjà mis à jour
    } catch (error) {
      console.error('Erreur lors du like:', error)
      // En cas d'erreur, annuler la mise à jour optimiste
      setReplies(prevReplies =>
        prevReplies.map(reply =>
          reply.id === replyId
            ? { ...reply, likesCount: reply.likesCount - 1 }
            : reply
        )
      )
    }
  }

  const handleReportReply = async (replyId: string) => {
    openConfirmationDialog(
      'Signaler la réponse',
      'Êtes-vous sûr de vouloir signaler cette réponse ? Elle sera examinée par nos modérateurs.',
      async () => {
        setConfirmationDialog(prev => ({ ...prev, loading: true }))
        try {
          await reportReply(replyId)
          closeConfirmationDialog()
          showToast('Réponse signalée avec succès', 'success')
        } catch (error) {
          console.error('Erreur lors du signalement:', error)
          setConfirmationDialog(prev => ({ ...prev, loading: false }))
          showToast('Erreur lors du signalement', 'error')
        }
      },
      'warning',
      'Signaler'
    )
  }

  const handleCreateTopic = async () => {
    if (!topicTitle.trim() || !topicContent.trim() || !selectedChannelId) return

    try {
      setLoading(true)
      await createTopic(selectedChannelId, {
        title: topicTitle,
        content: topicContent
      })
      setTopicTitle("")
      setTopicContent("")
      setIsNewTopicOpen(false)
      await loadTopics()
      showToast('Sujet soumis avec succès. Il est en attente de validation.', 'info')
    } catch (error) {
      console.error('Erreur lors de la création du sujet:', error)
      showToast('Erreur lors de la soumission du sujet.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateReply = async () => {
    if (!replyContent.trim() || !selectedTopic) return

    try {
      setLoading(true)
      await createReply(selectedTopic.id, {
        content: replyContent
      })
      setReplyContent("")
      await loadReplies(selectedTopic.id) // Recharger les réponses après création
    } catch (error) {
      console.error('Erreur lors de la création de la réponse:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full md:h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Hash className="h-6 w-6 text-slate-400" />
            {channels.find(c => c.id === selectedChannelId)?.name || "Forum"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Espace de discussion pour cette catégorie.</p>
        </div>
        {selectedChannelId && !selectedTopic && (
          <button
            onClick={() => setIsNewTopicOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Nouveau Sujet
          </button>
        )}
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Sidebar Canaux - Layout type Discord */}
        <div className="w-64 shrink-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hidden lg:flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Canaux</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannelId(channel.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedChannelId === channel.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Hash className={`h-4 w-4 ${selectedChannelId === channel.id ? 'text-blue-600' : 'text-slate-400'}`} />
                  {channel.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Forum List */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          {/* Mobile Channels List */}
          <div className="lg:hidden flex overflow-x-auto hide-scrollbar p-3 gap-2 border-b border-slate-100 bg-slate-50/80">
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannelId(channel.id)}
                className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm ${selectedChannelId === channel.id
                  ? 'bg-blue-600 border border-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
              >
                <Hash className="h-3.5 w-3.5" />
                {channel.name}
              </button>
            ))}
          </div>

          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4 shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Chercher dans ce canal..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
              <button className="text-blue-600 hover:text-blue-800 transition-colors">Récent</button>
              <button className="hover:text-blue-600 transition-colors flex items-center gap-1"><TrendingUp className="h-4 w-4" /> Populaire</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Bannière pour les sujets en attente */}
            {!loading && pendingTopics.length > 0 && (
              <div className="mx-4 mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-start gap-3">
                <Flag className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-500">En attente de validation</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400/80 mt-1">
                    Vous avez {pendingTopics.length} sujet(s) en attente de validation par les modérateurs dans ce canal. Ils seront visibles par tous une fois approuvés.
                  </p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : topics.length > 0 ? topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex-1 mb-4 sm:mb-0 pr-4 flex items-start gap-4">
                  <img src={topic.authorDetails?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(topic.authorDetails?.firstName || 'User')}&background=cbd5e1&color=64748b`} className="w-10 h-10 rounded-full object-cover shrink-0 mt-1" alt="avatar" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{topic.authorDetails?.firstName} {topic.authorDetails?.lastName}</span>
                      <span className="text-xs text-slate-400">• {new Date(topic.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{topic.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 shrink-0 mt-2 sm:mt-0 ml-14 sm:ml-0">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full"><MessageSquare className="h-4 w-4 text-slate-400" /> {topic.repliesCount}</div>
                  <div className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-slate-400" /> {topic.viewsCount}</div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                Aucun sujet dans ce canal pour le moment. Soyez le premier à en créer un !
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Nouveau Sujet */}
      {isNewTopicOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Créer un nouveau sujet</h2>
              <button onClick={() => setIsNewTopicOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Canal de discussion</label>
                <select
                  value={selectedChannelId || ''}
                  onChange={(e) => setSelectedChannelId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                >
                  {channels.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titre du sujet</label>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  placeholder="Ex: Avis sur le bootcamp X ?"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contenu</label>
                <textarea
                  rows={6}
                  value={topicContent}
                  onChange={(e) => setTopicContent(e.target.value)}
                  placeholder="Détaillez votre question ou réflexion ici..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none resize-none"
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setIsNewTopicOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Annuler</button>
              <button
                onClick={handleCreateTopic}
                disabled={loading || !topicTitle.trim() || !topicContent.trim()}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Publier le sujet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Détails du sujet et discussion */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-3xl flex flex-col h-[90vh] sm:h-[85vh]">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <Hash className="h-4 w-4" /> {channels.find(c => c.id === selectedChannelId)?.name}
              </div>
              <button onClick={() => setSelectedTopic(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50">
              {/* Message principal */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{selectedTopic.title}</h2>
                <div className="flex items-center gap-3 mb-4">
                  <img src={selectedTopic.authorDetails?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTopic.authorDetails?.firstName || 'User')}&background=cbd5e1&color=64748b`} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">{selectedTopic.authorDetails?.firstName} {selectedTopic.authorDetails?.lastName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{new Date(selectedTopic.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  {selectedTopic.content}
                </p>
                <div className="flex items-center gap-2 border-t border-slate-50 pt-3">
                  <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-blue-50">
                    <Heart className="h-4 w-4" /> {selectedTopic.likesCount || 0}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-blue-50">
                    <MessageSquare className="h-4 w-4" /> Répondre
                  </button>
                </div>
              </div>

              {/* Réponses */}
              {loadingReplies ? (
                <div className="flex items-center justify-center p-8">
                  <Loader className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">Chargement des réponses...</span>
                </div>
              ) : replies.length > 0 ? (
                <div className="space-y-4 ml-2 sm:ml-8 relative">
                  <div className="absolute top-0 bottom-0 left-5 w-px bg-slate-200 dark:bg-slate-700 -z-10"></div>

                  {replies.map((reply) => (
                    <div key={reply.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative">
                      <CornerDownRight className="h-5 w-5 text-slate-300 absolute -left-7 top-4" />
                      <div className="flex items-center gap-3 mb-2">
                        <img src={reply.authorDetails?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.authorDetails?.firstName || 'User')}&background=cbd5e1&color=64748b`} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">{reply.authorDetails?.firstName} {reply.authorDetails?.lastName}</span>
                          <span className="text-xs text-slate-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 ml-11">
                        {reply.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2 ml-11">
                        <button
                          onClick={() => handleLikeReply(reply.id)}
                          className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Heart className="h-3.5 w-3.5" /> {reply.likesCount || 0}
                        </button>
                        <button
                          onClick={() => handleReportReply(reply.id)}
                          className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-orange-600 transition-colors"
                        >
                          <Flag className="h-3.5 w-3.5" /> Signaler
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  Aucune réponse pour le moment. Soyez le premier à répondre !
                </div>
              )}
            </div>

            {/* Input Répondre */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 rounded-b-2xl">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                <button className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-slate-200 transition-colors"><ImageIcon className="h-5 w-5" /></button>
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Ajouter une réponse à la discussion..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-900 dark:text-white px-2 py-1"
                />
                <button
                  onClick={handleCreateReply}
                  disabled={loading || !replyContent.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmation */}
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
