import { useState, useEffect } from 'react'
import { Plus, Eye, Trash2, Loader2, BookOpen, MessageSquare, AlertCircle, Video, Images, ThumbsUp, MessageCircle, Download, FileText, X } from 'lucide-react'
import { getPremiumFeeds, getPremiumDocuments, deletePremiumFeed, deletePremiumDocument } from '../../services/publishing'
import { PublishFeedModal } from './PublishFeedModal'
import { PublishDocumentModal } from './PublishDocumentModal'
import type { FeedPost, Document, FeedComment } from '../../types/api'
import { getFeedComments, postFeedComment, toggleLikePost } from '../../services/feed'

export function ProfilePublications() {
  const [activeTab, setActiveTab] = useState<'feed' | 'documents'>('feed')
  const [feeds, setFeeds] = useState<FeedPost[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false)
  const [isDocModalOpen, setIsDocModalOpen] = useState(false)
  
  const [viewFeedData, setViewFeedData] = useState<FeedPost | null>(null)
  const [viewDocData, setViewDocData] = useState<Document | null>(null)

  // Comments & Likes state
  const [commentsByPost, setCommentsByPost] = useState<Record<string, FeedComment[]>>({})
  const [commentsLoading, setCommentsLoading] = useState<Record<string, boolean>>({})
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [commentsError, setCommentsError] = useState<Record<string, string>>({})
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({})
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      if (activeTab === 'feed') {
        const data = await getPremiumFeeds()
        setFeeds(data)
      } else {
        const data = await getPremiumDocuments()
        setDocuments(data)
      }
    } catch (err: any) {
      setError(err.message || "Impossible de charger vos publications")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFeed = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return
    try {
      await deletePremiumFeed(id)
      setFeeds(feeds.filter(f => f.id !== id))
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression")
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) return
    try {
      await deletePremiumDocument(id)
      setDocuments(documents.filter(d => d.id !== id))
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression")
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await toggleLikePost(postId)
      setFeeds((current) => current.map((post) => post.id === postId ? { ...post, likesCount: response.likesCount } : post))
      if (viewFeedData && viewFeedData.id === postId) {
        setViewFeedData(prev => prev ? { ...prev, likesCount: response.likesCount } : prev)
      }
      setLikedPosts((current) => ({ ...current, [postId]: response.liked }))
    } catch (error) {
      console.error('Impossible de liker le post.', error)
    }
  }

  const loadComments = async (postId: string) => {
    setCommentsLoading((current) => ({ ...current, [postId]: true }))
    setCommentsError((current) => ({ ...current, [postId]: '' }))
    try {
      const comments = await getFeedComments(postId)
      setCommentsByPost((current) => ({ ...current, [postId]: comments }))
    } catch (error) {
      setCommentsError((current) => ({
        ...current,
        [postId]: error instanceof Error ? error.message : 'Impossible de charger les commentaires.',
      }))
    } finally {
      setCommentsLoading((current) => ({ ...current, [postId]: false }))
    }
  }

  const handleToggleComments = async (postId: string) => {
    const willOpen = !openComments[postId]
    setOpenComments((current) => ({ ...current, [postId]: willOpen }))

    if (willOpen && !commentsByPost[postId]) {
      await loadComments(postId)
    }
  }

  const handleSubmitComment = async (postId: string) => {
    const content = commentDrafts[postId]?.trim()
    if (!content) return

    setCommentsLoading((current) => ({ ...current, [postId]: true }))
    setCommentsError((current) => ({ ...current, [postId]: '' }))

    try {
      const newComment = await postFeedComment(postId, content)
      setOpenComments((current) => ({ ...current, [postId]: true }))
      setCommentsByPost((current) => ({
        ...current,
        [postId]: [newComment, ...(current[postId] ?? [])],
      }))
      setCommentDrafts((current) => ({ ...current, [postId]: '' }))
      setFeeds((current) => current.map((post) =>
        post.id === postId ? { ...post, commentsCount: post.commentsCount + 1 } : post
      ))
      if (viewFeedData && viewFeedData.id === postId) {
        setViewFeedData(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : prev)
      }
    } catch (error) {
      setCommentsError((current) => ({
        ...current,
        [postId]: error instanceof Error ? error.message : 'Impossible de publier le commentaire.',
      }))
    } finally {
      setCommentsLoading((current) => ({ ...current, [postId]: false }))
    }
  }

  const getFeedImage = (feed: FeedPost) => {
    if (feed.mediaUrl) return feed.mediaUrl;
    if (feed.imageUrls) return feed.imageUrls.split(',')[0].trim();
    if (Array.isArray(feed.attachments) && feed.attachments.length > 0) {
      const img = feed.attachments.find(a => {
        const url = typeof a === 'string' ? a : a.url;
        return url && !url.match(/\.(mp4|webm|ogg)$/i) && !url.includes('youtube') && !url.includes('vimeo');
      });
      return typeof img === 'string' ? img : img?.url;
    }
    return null;
  };

  const getFeedGallery = (feed: FeedPost) => {
    if (feed.galleryUrls) return feed.galleryUrls.split(',').map(u => u.trim()).filter(Boolean);
    if (feed.imageUrls) return feed.imageUrls.split(',').map(u => u.trim()).filter(Boolean);
    if (Array.isArray(feed.attachments) && feed.attachments.length > 0) {
      return feed.attachments
        .map(a => typeof a === 'string' ? a : a.url)
        .filter(url => url && !url.match(/\.(mp4|webm|ogg)$/i) && !url.includes('youtube') && !url.includes('vimeo'));
    }
    return [];
  };

  const getFeedVideo = (feed: FeedPost) => {
    if (feed.videoUrl) return feed.videoUrl;
    if (feed.mediaUrl && (feed.mediaType === 'video' || feed.mediaUrl.match(/\.(mp4|webm|ogg)$/i) || feed.mediaUrl.includes('youtube') || feed.mediaUrl.includes('youtu.be') || feed.mediaUrl.includes('vimeo'))) return feed.mediaUrl;
    if (Array.isArray(feed.attachments) && feed.attachments.length > 0) {
      const vid = feed.attachments.find(a => {
        const url = typeof a === 'string' ? a : a.url;
        return url && (url.match(/\.(mp4|webm|ogg)$/i) || url.includes('youtube') || url.includes('vimeo') || url.includes('youtu.be'));
      });
      return typeof vid === 'string' ? vid : vid?.url;
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 w-2 h-6 rounded-full inline-block"></span>
            Mes Publications
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gérez vos annonces et documents publiés.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsFeedModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl font-semibold transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Publier une</span> annonce (Feed)
          </button>
          <button
            onClick={() => setIsDocModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl font-semibold transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Publier un</span> document
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('feed')}
          className={`pb-3 px-2 text-sm font-semibold transition-all relative ${activeTab === 'feed'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Annonces (Feed)
          </div>
          {activeTab === 'feed' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 px-2 text-sm font-semibold transition-all relative ${activeTab === 'documents'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Documents
          </div>
          {activeTab === 'documents' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-t-full"></span>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/30">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-600" />
          <p>Chargement de vos publications...</p>
        </div>
      ) : activeTab === 'feed' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feeds.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              Vous n'avez pas encore publié d'annonce.
            </div>
          ) : (
            feeds.map((feed) => {
              const imageUrl = getFeedImage(feed);
              const videoUrl = getFeedVideo(feed);
              const galleryUrls = getFeedGallery(feed);
              
              return (
              <div key={feed.id} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="p-4 flex-1 flex flex-col">
                  {feed.title && <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{feed.title}</h3>}
                  
                  {/* Media Preview */}
                  {(feed.mediaType === 'image' || !feed.mediaType) && imageUrl && (
                    <div className="h-32 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden mb-3">
                      <img src={imageUrl} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  {feed.mediaType === 'video' && videoUrl && (
                    <div className="h-32 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden mb-3 flex flex-col items-center justify-center">
                      <Video className="w-8 h-8 text-slate-400 mb-1" />
                      <span className="text-xs font-medium text-slate-500">Vidéo jointe</span>
                    </div>
                  )}
                  {feed.mediaType === 'gallery' && galleryUrls.length > 0 && (
                    <div className="h-32 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden mb-3 flex flex-col items-center justify-center">
                      <Images className="w-8 h-8 text-slate-400 mb-1" />
                      <span className="text-xs font-medium text-slate-500">Galerie jointe</span>
                    </div>
                  )}

                  <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-3 mb-2">{feed.content}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-2 font-medium">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {feed.likesCount || 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {feed.commentsCount || 0}</span>
                  </div>

                  <div className="mt-auto pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-700">
                    <span>{new Date(feed.createdAt).toLocaleDateString()}</span>
                    <span>{feed.viewCount || 0} vues</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
                  <button onClick={() => setViewFeedData(feed)} className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors tooltip" title="Aperçu">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDeleteFeed(feed.id)} className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors tooltip" title="Supprimer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )})
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              Vous n'avez pas encore publié de document.
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2">{doc.title}</h3>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {doc.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{doc.description}</p>
                  <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                    <span className={`px-2 py-0.5 rounded ${doc.isPremium ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {doc.isPremium ? 'Premium' : 'Gratuit'}
                    </span>
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
                  <button onClick={() => setViewDocData(doc)} className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors tooltip" title="Détails">
                    <Eye className="h-4 w-4" />
                  </button>
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors tooltip" title="Télécharger">
                    <Download className="h-4 w-4" />
                  </a>
                  <button onClick={() => handleDeleteDocument(doc.id)} className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors tooltip" title="Supprimer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <PublishFeedModal
        isOpen={isFeedModalOpen}
        onClose={() => setIsFeedModalOpen(false)}
        onSuccess={() => { loadData(); setIsFeedModalOpen(false) }}
      />

      <PublishDocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSuccess={() => { loadData(); setIsDocModalOpen(false) }}
      />

      {/* POPUP VIEW FEED */}
      {viewFeedData && (() => {
        const imageUrl = getFeedImage(viewFeedData);
        const videoUrl = getFeedVideo(viewFeedData);
        const galleryUrls = getFeedGallery(viewFeedData);
        
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Aperçu de l'annonce
              </h2>
              <button onClick={() => setViewFeedData(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="mb-4">
                {viewFeedData.title && <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{viewFeedData.title}</h3>}
                <div className="text-sm text-slate-500 mb-4 flex items-center gap-4">
                  <span>Publié le {new Date(viewFeedData.createdAt).toLocaleDateString()}</span>
                  <span>{viewFeedData.viewCount || 0} vues</span>
                </div>
                
                {/* Media */}
                {(viewFeedData.mediaType === 'image' || !viewFeedData.mediaType) && imageUrl && (
                  <div className="w-full rounded-xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                    <img src={imageUrl} alt="Media" className="w-full h-auto max-h-[400px] object-contain" />
                  </div>
                )}
                {viewFeedData.mediaType === 'video' && videoUrl && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 bg-black">
                    {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                      <iframe src={videoUrl.replace('watch?v=', 'embed/')} className="w-full h-full border-0" allowFullScreen></iframe>
                    ) : (
                      <video controls src={videoUrl} className="w-full h-full" />
                    )}
                  </div>
                )}
                {viewFeedData.mediaType === 'gallery' && galleryUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {galleryUrls.map((url, idx) => (
                      <div key={idx} className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden aspect-video">
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {viewFeedData.content}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <button onClick={() => handleLike(viewFeedData.id)} className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-colors ${likedPosts[viewFeedData.id] ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                    <ThumbsUp className={`w-4 h-4 ${likedPosts[viewFeedData.id] ? 'text-blue-500' : ''}`} /> {viewFeedData.likesCount || 0}
                  </button>
                  <button onClick={() => handleToggleComments(viewFeedData.id)} className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-colors ${openComments[viewFeedData.id] ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                    <MessageCircle className={`w-4 h-4 ${openComments[viewFeedData.id] ? 'text-emerald-500' : ''}`} /> {viewFeedData.commentsCount || 0}
                  </button>
                </div>
                <button onClick={() => setViewFeedData(null)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg font-medium transition-colors text-sm">
                  Fermer
                </button>
              </div>

              {/* COMMENTS SECTION */}
              {openComments[viewFeedData.id] && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex gap-2">
                    <textarea
                      value={commentDrafts[viewFeedData.id] ?? ''}
                      onChange={(e) => setCommentDrafts((current) => ({ ...current, [viewFeedData.id]: e.target.value }))}
                      placeholder="Écrire un commentaire..."
                      className="flex-1 min-h-10 max-h-32 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-3 resize-none"
                    />
                    <button
                      onClick={() => handleSubmitComment(viewFeedData.id)}
                      disabled={!commentDrafts[viewFeedData.id]?.trim() || commentsLoading[viewFeedData.id]}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-4 font-semibold text-sm transition-colors"
                    >
                      {commentsLoading[viewFeedData.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Envoyer'}
                    </button>
                  </div>
                  {commentsError[viewFeedData.id] && (
                    <p className="text-sm text-rose-600 dark:text-rose-400">{commentsError[viewFeedData.id]}</p>
                  )}
                  
                  {commentsLoading[viewFeedData.id] ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {commentsByPost[viewFeedData.id]?.map((comment) => {
                        const author = comment.authorDetails ? `${comment.authorDetails.firstName ?? ''} ${comment.authorDetails.lastName ?? ''}`.trim() : 'Utilisateur';
                        return (
                          <div key={comment.id} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700 shadow-sm flex gap-3">
                            <div className="h-8 w-8 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <img src={comment.authorDetails?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=cbd5e1&color=64748b`} alt={author} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{author}</span>
                                <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
                            </div>
                          </div>
                        )
                      })}
                      {commentsByPost[viewFeedData.id]?.length === 0 && (
                        <p className="text-center text-sm text-slate-500 py-4">Aucun commentaire pour le moment.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) })()}

      {/* POPUP VIEW DOCUMENT */}
      {viewDocData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                Détails du document
              </h2>
              <button onClick={() => setViewDocData(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-20 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30 shrink-0">
                  <FileText className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{viewDocData.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{viewDocData.category}</span>
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${viewDocData.isPremium ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {viewDocData.isPremium ? 'Premium' : 'Gratuit'}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">{viewDocData.format || 'PDF'}</span>
                  </div>
                  <p className="text-sm text-slate-500">Ajouté le {new Date(viewDocData.createdAt).toLocaleDateString()} • {viewDocData.downloadsCount || 0} vues</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Description</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{viewDocData.description || 'Aucune description disponible.'}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {viewDocData.authorDetails?.name && (
                  <div>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Auteur</span>
                    <span className="font-medium text-sm text-slate-900 dark:text-white">{viewDocData.authorDetails.name}</span>
                  </div>
                )}
                {viewDocData.pagesCount && (
                  <div>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Pages</span>
                    <span className="font-medium text-sm text-slate-900 dark:text-white">{viewDocData.pagesCount}</span>
                  </div>
                )}
                {viewDocData.publicationYear && (
                  <div>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Année</span>
                    <span className="font-medium text-sm text-slate-900 dark:text-white">{viewDocData.publicationYear}</span>
                  </div>
                )}
                {viewDocData.price && (
                  <div>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Prix</span>
                    <span className="font-medium text-sm text-slate-900 dark:text-white">{viewDocData.price} FCFA</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setViewDocData(null)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg font-medium transition-colors text-sm">
                Fermer
              </button>
              <a href={viewDocData.fileUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
                <Download className="w-4 h-4" /> Télécharger / Ouvrir
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
