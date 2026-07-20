import { useState, useEffect } from "react"
import { AlertCircle, Trash2, CheckCircle, Hash, Plus, Loader } from "lucide-react"
import { getAdminChannels, createChannel, deleteChannel, getReportedTopics, deleteTopic, authorizeTopic } from "../../services/forum"
import type { ForumChannel, ForumTopic } from "../../types/forum"

export function AdminForumPage() {
  const [activeTab, setActiveTab] = useState<'channels' | 'reported' | 'validation'>('channels')
  const [channels, setChannels] = useState<ForumChannel[]>([])
  const [reportedTopics, setReportedTopics] = useState<ForumTopic[]>([])
  const [loading, setLoading] = useState(false)
  const [channelName, setChannelName] = useState("")
  const [channelDescription, setChannelDescription] = useState("")

  useEffect(() => {
    loadChannels()
    loadReportedTopics()
  }, [])

  const loadChannels = async () => {
    try {
      setLoading(true)
      const data = await getAdminChannels()
      setChannels(data)
    } catch (error) {
      console.error('Erreur lors du chargement des canaux:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReportedTopics = async () => {
    try {
      const data = await getReportedTopics()
      setReportedTopics(data)
    } catch (error) {
      console.error('Erreur lors du chargement des sujets signalés:', error)
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

  const handleDeleteTopic = async (topicId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce sujet ?')) return

    try {
      await deleteTopic(topicId)
      loadReportedTopics()
    } catch (error) {
      console.error('Erreur lors de la suppression du sujet:', error)
    }
  }

  const handleAuthorizeTopic = async (topicId: string) => {
    try {
      await authorizeTopic(topicId)
      loadReportedTopics()
    } catch (error) {
      console.error('Erreur lors de la validation du sujet:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestion du Forum</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gérez les canaux, validez les sujets et traitez les signalements.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'channels' ? 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Hash className="h-4 w-4" /> Gestion des Canaux ({channels.length})
        </button>
        <button
          onClick={() => setActiveTab('validation')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'validation' ? 'border-amber-600 text-amber-600 dark:border-amber-500 dark:text-amber-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <CheckCircle className="h-4 w-4" /> Validation
        </button>
        <button
          onClick={() => setActiveTab('reported')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'reported' ? 'border-red-600 text-red-600 dark:border-red-500 dark:text-red-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <AlertCircle className="h-4 w-4" /> Signalements ({reportedTopics.length})
        </button>
      </div>

      <div>
        {activeTab === 'channels' && (
          <div className="space-y-6">
            {/* Créer un canal */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Créer un nouveau Canal</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="Ex: intelligence-artificielle"
                  className="flex-1 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <input
                  type="text"
                  value={channelDescription}
                  onChange={(e) => setChannelDescription(e.target.value)}
                  placeholder="Description courte..."
                  className="flex-1 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  onClick={handleCreateChannel}
                  disabled={loading || !channelName.trim() || !channelDescription.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" /> Ajouter
                </button>
              </div>
            </div>

            {/* Liste des canaux */}
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : channels.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-500">
                Aucun canal créé pour le moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {channels.map((channel) => (
                  <div key={channel.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                          <Hash className="h-4 w-4" /> {channel.name}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{channel.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteChannel(channel.id)}
                      className="text-sm text-red-600 hover:text-red-700 dark:hover:text-red-400 font-medium flex items-center gap-1 w-max mt-4"
                    >
                      <Trash2 className="h-4 w-4" /> Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="space-y-4">
            {reportedTopics.filter(t => t.status === 'PENDING').length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-500">
                Aucun sujet en attente de validation.
              </div>
            ) : (
              reportedTopics
                .filter(t => t.status === 'PENDING')
                .map((topic) => (
                  <div key={topic.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-amber-100 dark:border-amber-900/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">En attente</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {topic.authorDetails?.firstName} {topic.authorDetails?.lastName}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">{topic.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                        {topic.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAuthorizeTopic(topic.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" /> Valider
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" /> Refuser
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {activeTab === 'reported' && (
          <div className="space-y-4">
            {reportedTopics.filter(t => t.reportsCount > 0).length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-500">
                Aucun sujet signalé.
              </div>
            ) : (
              reportedTopics
                .filter(t => t.reportsCount > 0)
                .sort((a, b) => b.reportsCount - a.reportsCount)
                .map((topic) => (
                  <div key={topic.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                          {topic.reportsCount} signalements
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {topic.authorDetails?.firstName} {topic.authorDetails?.lastName}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">{topic.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                        {topic.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors">
                        Ignorer
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" /> Supprimer
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
