import { useState, type FormEvent, useEffect } from 'react'
import {
  Video,
  Images,
  Image as ImageIcon,
  Loader2,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { createAdminFeedPost, getAdminFeeds, updateAdminFeed, deleteAdminFeed } from '../../../services/admin'
import type { FeedPost } from '../../../types/api'
import { ConfirmationDialog } from '../../../components/ui/ConfirmationDialog'

export function AdminCMSFeedTab({ showToast }: { showToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const [feeds, setFeeds] = useState<FeedPost[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [postType, setPostType] = useState<'image' | 'gallery' | 'video'>('image')
  const [feedTitle, setFeedTitle] = useState('')
  const [feedContent, setFeedContent] = useState('')
  const [feedImage, setFeedImage] = useState<File | null>(null)
  const [feedGalleryFiles, setFeedGalleryFiles] = useState<File[]>([])
  const [feedImageUrls, setFeedImageUrls] = useState('')
  const [feedVideoUrl, setFeedVideoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Modals states
  const [viewModalData, setViewModalData] = useState<FeedPost | null>(null)
  const [editModalData, setEditModalData] = useState<FeedPost | null>(null)
  const [deleteDialogData, setDeleteDialogData] = useState<FeedPost | null>(null)

  const loadFeeds = async () => {
    setIsLoading(true)
    try {
      const data = await getAdminFeeds()
      setFeeds((data as FeedPost[]) || [])
    } catch (error) {
      console.error(error)
      showToast('Erreur lors du chargement des actualités', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFeeds()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', feedTitle)
      formData.append('content', feedContent)
      formData.append('mediaType', postType)
      formData.append('type', postType === 'video' ? 'VIDEO' : 'IMAGE')

      if (postType === 'video' && feedVideoUrl.trim()) formData.append('videoUrl', feedVideoUrl.trim())
      if (postType === 'image') {
        if (feedImage) {
          formData.append('files', feedImage)
        } else if (feedImageUrls.trim()) {
          formData.append('imageUrls', feedImageUrls.trim())
        }
      }
      if (postType === 'gallery') {
        if (feedGalleryFiles.length > 0) {
          feedGalleryFiles.forEach((file) => formData.append('files', file))
        } else if (feedImageUrls.trim()) {
          formData.append('imageUrls', feedImageUrls.trim())
        }
      }

      await createAdminFeedPost(formData)
      showToast('Publication envoyée avec succès.', 'success')

      // Reset form
      setFeedTitle('')
      setFeedContent('')
      setFeedImage(null)
      setFeedGalleryFiles([])
      setFeedImageUrls('')
      setFeedVideoUrl('')

      loadFeeds()
    } catch (error) {
      showToast('Impossible de publier le post.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialogData) return
    try {
      await deleteAdminFeed(deleteDialogData.id)
      showToast('Publication supprimée avec succès.', 'success')
      setDeleteDialogData(null)
      loadFeeds()
    } catch (err) {
      showToast('Erreur lors de la suppression.', 'error')
    }
  }

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editModalData) return
    
    try {
      const formData = new FormData(e.currentTarget)
      await updateAdminFeed(editModalData.id, formData)
      showToast('Publication mise à jour avec succès.', 'success')
      setEditModalData(null)
      loadFeeds()
    } catch (err) {
      showToast('Erreur lors de la mise à jour.', 'error')
    }
  }

  const totalPages = Math.ceil(feeds.length / itemsPerPage)
  const paginatedFeeds = feeds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in max-w-2xl bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
          Publier un message officiel
        </h2>

        {/* Post Type Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-max mb-6">
          <button
            type="button"
            onClick={() => setPostType('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${postType === 'image' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <ImageIcon className="h-4 w-4" /> Image
          </button>
          <button
            type="button"
            onClick={() => setPostType('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${postType === 'gallery' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Images className="h-4 w-4" /> Galerie
          </button>
          <button
            type="button"
            onClick={() => setPostType('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${postType === 'video' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Video className="h-4 w-4" /> Vidéo
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Titre de la publication</label>
            <Input type="text" value={feedTitle} onChange={(e) => setFeedTitle(e.target.value)} placeholder="Ex: Rentrée solennelle 2026..." required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Contenu de la publication</label>
            <textarea
              rows={6}
              value={feedContent}
              onChange={(e) => setFeedContent(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-blue-600 p-3 text-sm outline-none"
              placeholder="Votre message officiel apparaîtra en tête du fil d'actualité..."
              required
            />
          </div>

          {postType === 'image' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Joindre une image (Fichier optionnel)</label>
                <Input type="file" accept="image/*" onChange={(e) => setFeedImage(e.target.files?.[0] || null)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL de l'image (Fallback optionnel)</label>
                <Input type="url" value={feedImageUrls} onChange={(e) => setFeedImageUrls(e.target.value)} placeholder="https://..." />
              </div>
            </div>
          )}

          {postType === 'gallery' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Galerie (Fichiers optionnels)</label>
                <Input type="file" accept="image/*" multiple onChange={(e) => setFeedGalleryFiles(Array.from(e.target.files || []))} />
                {feedGalleryFiles.length > 0 && <p className="text-xs text-slate-500 mt-2">{feedGalleryFiles.length} fichier(s) sélectionné(s)</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URLs des images (Séparées par des virgules)</label>
                <Input type="text" value={feedImageUrls} onChange={(e) => setFeedImageUrls(e.target.value)} placeholder="https://img1.com, https://img2.com" />
              </div>
            </div>
          )}

          {postType === 'video' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Lien de la vidéo (YouTube, Vimeo, etc.)</label>
              <Input type="url" value={feedVideoUrl} onChange={(e) => setFeedVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          )}
        </div>

        <Button disabled={isSubmitting} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 font-bold text-white border-0" size="lg" type="submit">
          {isSubmitting ? 'Publication en cours...' : 'Diffuser sur le Fil'}
        </Button>
      </form>

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fil d'actualité - Gérer ({feeds.length})</h3>
          </div>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
          ) : (
            <>
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Titre / Contenu</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {paginatedFeeds.map((feed) => (
                    <tr key={feed.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white max-w-md truncate">{feed.title || feed.content?.substring(0, 50) + '...'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Publication
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {feed.createdAt ? new Date(feed.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        <button onClick={() => setViewModalData(feed)} className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg tooltip" title="Voir">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => setEditModalData(feed)} className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg tooltip" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteDialogData(feed)} className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg tooltip" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedFeeds.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Aucune publication trouvée.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button onClick={() => setViewModalData(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 pr-8 text-slate-900 dark:text-white">{viewModalData.title || 'Détails du post'}</h3>
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Type:</strong> Publication</p>
              <p><strong>Date:</strong> {viewModalData.createdAt ? new Date(viewModalData.createdAt).toLocaleDateString() : 'N/A'}</p>
              <div>
                <strong>Contenu:</strong>
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg whitespace-pre-wrap">{viewModalData.content}</div>
              </div>
              {(viewModalData.attachments || viewModalData.mediaType === 'image' || viewModalData.mediaType === 'gallery') && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium flex items-center gap-2">
                   <ImageIcon className="h-4 w-4" /> Pièce jointe / Image associée à ce post
                </div>
              )}
              {viewModalData.videoUrl && (
                <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-medium flex items-center gap-2">
                   <Video className="h-4 w-4" /> Vidéo: <a href={viewModalData.videoUrl} target="_blank" rel="noreferrer" className="underline hover:text-rose-700">{viewModalData.videoUrl}</a>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setViewModalData(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-800">Fermer</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditModalData(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Modifier la publication</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Titre</label>
                <Input name="title" defaultValue={editModalData.title} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Contenu</label>
                <textarea
                  name="content"
                  rows={6}
                  defaultValue={editModalData.content}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL(s) d'image(s) (Fallback optionnel)</label>
                <Input type="text" name="imageUrls" placeholder="https://img1.com, https://img2.com" defaultValue={editModalData.imageUrls || ''} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" onClick={() => setEditModalData(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-800">Annuler</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Sauvegarder</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteDialogData}
        onClose={() => setDeleteDialogData(null)}
        onConfirm={handleDelete}
        title="Supprimer la publication"
        message="Êtes-vous sûr de vouloir supprimer définitivement cette publication ? Cette action est irréversible."
        confirmText="Supprimer"
        type="danger"
      />
    </>
  )
}
