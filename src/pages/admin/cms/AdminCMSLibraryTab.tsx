import { useState, type FormEvent, useEffect } from 'react'
import {
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
import { createAdminDocument, getAdminDocuments, deleteAdminDocument, updateAdminDocument } from '../../../services/admin'
import type { Document } from '../../../types/api'
import { ConfirmationDialog } from '../../../components/ui/ConfirmationDialog'

export function AdminCMSLibraryTab({ showToast }: { showToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [documentTitle, setDocumentTitle] = useState('')
  const [documentDomain, setDocumentDomain] = useState('Mathématiques Appliquées')
  const [documentPrice, setDocumentPrice] = useState('')
  const [documentPages, setDocumentPages] = useState('')
  const [documentFormat, setDocumentFormat] = useState('PDF')
  const [documentAuthor, setDocumentAuthor] = useState('')
  const [documentYear, setDocumentYear] = useState('')
  const [documentPublisher, setDocumentPublisher] = useState('')
  const [documentCourse, setDocumentCourse] = useState('')
  const [documentEdition, setDocumentEdition] = useState('')
  const [documentIsbn, setDocumentIsbn] = useState('')
  const [documentKeywords, setDocumentKeywords] = useState('')
  const [documentDescription, setDocumentDescription] = useState('')
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [documentUrlString, setDocumentUrlString] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Modals states
  const [viewModalData, setViewModalData] = useState<Document | null>(null)
  const [editModalData, setEditModalData] = useState<Document | null>(null)
  const [deleteDialogData, setDeleteDialogData] = useState<Document | null>(null)

  const loadDocuments = async () => {
    setIsLoading(true)
    try {
      const data = await getAdminDocuments()
      setDocuments((data as Document[]) || [])
    } catch (error) {
      console.error(error)
      showToast('Erreur lors du chargement des documents', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', documentTitle)
      formData.append('category', documentDomain)
      if (documentPrice) formData.append('price', documentPrice)
      if (documentPages) formData.append('pagesCount', documentPages)
      formData.append('format', documentFormat)
      formData.append('author', documentAuthor)
      if (documentYear) formData.append('publicationYear', documentYear)
      if (documentPublisher) formData.append('publisher', documentPublisher)
      if (documentCourse) formData.append('associatedCourse', documentCourse)
      if (documentEdition) formData.append('edition', documentEdition)
      if (documentIsbn) formData.append('isbn', documentIsbn)
      if (documentKeywords) formData.append('tags', documentKeywords)
      if (documentDescription) formData.append('description', documentDescription)
      if (documentFile) {
        formData.append('file', documentFile)
      } else if (documentUrlString) {
        formData.append('documentUrlString', documentUrlString)
      }

      await createAdminDocument(formData)
      showToast('Document ajouté avec succès.', 'success')
      
      // Reset
      setDocumentTitle('')
      setDocumentDomain('Mathématiques Appliquées')
      setDocumentPrice('')
      setDocumentPages('')
      setDocumentFormat('PDF')
      setDocumentAuthor('')
      setDocumentYear('')
      setDocumentPublisher('')
      setDocumentCourse('')
      setDocumentEdition('')
      setDocumentIsbn('')
      setDocumentKeywords('')
      setDocumentDescription('')
      setDocumentFile(null)
      setDocumentUrlString('')
      
      loadDocuments()
    } catch (error) {
      showToast('Impossible de publier le document.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialogData) return
    try {
      await deleteAdminDocument(deleteDialogData.id)
      showToast('Document supprimé avec succès.', 'success')
      setDeleteDialogData(null)
      loadDocuments()
    } catch (err) {
      showToast('Erreur lors de la suppression.', 'error')
    }
  }

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editModalData) return
    
    try {
      const formData = new FormData(e.currentTarget)
      await updateAdminDocument(editModalData.id, formData)
      showToast('Document mis à jour avec succès.', 'success')
      setEditModalData(null)
      loadDocuments()
    } catch (err) {
      showToast('Erreur lors de la mise à jour.', 'error')
    }
  }

  const totalPages = Math.ceil(documents.length / itemsPerPage)
  const paginatedData = documents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Nouveau Document (Bibliothèque)</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Titre du document</label>
            <Input type="text" value={documentTitle} onChange={(e) => setDocumentTitle(e.target.value)} placeholder="Ex: Annales Mathématiques L3" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Domaine d'étude</label>
              <select value={documentDomain} onChange={(e) => setDocumentDomain(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm h-[42px] outline-none">
                <option>Mathématiques Appliquées</option>
                <option>Informatique & Réseaux</option>
                <option>Droit des Affaires</option>
                <option>Médecine</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Prix (Laissez vide si gratuit)</label>
              <Input type="number" value={documentPrice} onChange={(e) => setDocumentPrice(e.target.value)} placeholder="Ex: 500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Résumé / Description</label>
            <textarea
              rows={3}
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm outline-none"
              placeholder="Résumé bref ce que contient ce document..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre de pages</label>
              <Input type="number" value={documentPages} onChange={(e) => setDocumentPages(e.target.value)} placeholder="Ex: 120" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Format</label>
              <select value={documentFormat} onChange={(e) => setDocumentFormat(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm h-[42px] outline-none">
                <option>PDF</option>
                <option>EPUB</option>
                <option>DOCX</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Auteur du document</label>
              <Input type="text" value={documentAuthor} onChange={(e) => setDocumentAuthor(e.target.value)} placeholder="Ex: Dr. Sy" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Année de publication</label>
              <Input type="number" value={documentYear} onChange={(e) => setDocumentYear(e.target.value)} placeholder="Ex: 2025" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Éditeur / Institution</label>
              <Input type="text" value={documentPublisher} onChange={(e) => setDocumentPublisher(e.target.value)} placeholder="Ex: Presses Universitaires" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Cours associé</label>
              <Input type="text" value={documentCourse} onChange={(e) => setDocumentCourse(e.target.value)} placeholder="Ex: MAT301 - Algèbre" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Édition / Version</label>
              <Input type="text" value={documentEdition} onChange={(e) => setDocumentEdition(e.target.value)} placeholder="Ex: 2ème Édition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Référence / ISBN</label>
              <Input type="text" value={documentIsbn} onChange={(e) => setDocumentIsbn(e.target.value)} placeholder="Ex: ISBN-13: 978..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mots-clés</label>
              <Input type="text" value={documentKeywords} onChange={(e) => setDocumentKeywords(e.target.value)} placeholder="Algèbre, Concours, Master" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Fichier du document (Fichier optionnel)</label>
              <Input type="file" accept=".pdf,.doc,.docx,.epub" onChange={(e) => setDocumentFile(e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL du document (Fallback optionnel)</label>
              <Input type="url" value={documentUrlString} onChange={(e) => setDocumentUrlString(e.target.value)} placeholder="https://..." />
            </div>
          </div>
        </div>

        <Button disabled={isSubmitting} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 font-bold" size="lg" type="submit">
          {isSubmitting ? 'Publication...' : 'Publier dans la bibliothèque'}
        </Button>
      </form>

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Documents - Gérer ({documents.length})</h3>
          </div>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-emerald-600" /></div>
          ) : (
            <>
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Titre / Catégorie</th>
                    <th className="px-6 py-4 font-semibold">Tags</th>
                    <th className="px-6 py-4 font-semibold">Auteur / Info</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {paginatedData.map((doc, idx) => (
                    <tr key={doc.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white max-w-md truncate">{doc.description?.substring(0, 30) || 'Document'}</div>
                        <div className="text-xs text-slate-500">{doc.category || 'Non spécifié'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags?.slice(0, 2).map((tag: string, i: number) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        <div className="text-sm">{doc.authorDetails?.name || 'Auteur inconnu'}</div>
                        <div className="text-xs text-slate-400">{doc.pagesCount || 0} pages</div>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        <button onClick={() => setViewModalData(doc)} className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg tooltip" title="Voir">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => setEditModalData(doc)} className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg tooltip" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteDialogData(doc)} className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg tooltip" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Aucun document trouvé.</td>
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
            <h3 className="text-lg font-bold mb-4 pr-8 text-slate-900 dark:text-white">Détails du document</h3>
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Catégorie:</strong> {viewModalData.category}</p>
              <p><strong>Prix:</strong> {viewModalData.price || 'Gratuit'}</p>
              <p><strong>Auteur:</strong> {viewModalData.authorDetails?.name || 'N/A'}</p>
              <div>
                <strong>Description:</strong>
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg whitespace-pre-wrap">{viewModalData.description || 'N/A'}</div>
              </div>
              {viewModalData.fileUrl && (
                <div>
                  <strong>Fichier/Lien:</strong>
                  <div className="mt-2">
                    <a href={viewModalData.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                      {viewModalData.fileUrl}
                    </a>
                  </div>
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
            <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Modifier le document</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Titre du document</label>
                  <Input name="title" type="text" defaultValue={editModalData.title} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Domaine d'étude</label>
                    <select name="domain" defaultValue={editModalData.category} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm h-[42px] outline-none">
                      <option>Mathématiques Appliquées</option>
                      <option>Informatique & Réseaux</option>
                      <option>Droit des Affaires</option>
                      <option>Médecine</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Prix (Laissez vide si gratuit)</label>
                    <Input name="price" type="number" defaultValue={editModalData.price} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Résumé / Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editModalData.description}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre de pages</label>
                    <Input name="pagesCount" type="number" defaultValue={editModalData.pagesCount} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Format</label>
                    <select name="format" defaultValue={editModalData.format} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm h-[42px] outline-none">
                      <option>PDF</option>
                      <option>EPUB</option>
                      <option>DOCX</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Auteur du document</label>
                    <Input name="author" type="text" defaultValue={editModalData.authorDetails?.name} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Année de publication</label>
                    <Input name="publicationYear" type="number" defaultValue={editModalData.publicationYear} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Éditeur / Institution</label>
                    <Input name="publisher" type="text" defaultValue={editModalData.publisher} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Cours associé</label>
                    <Input name="associatedCourse" type="text" defaultValue={editModalData.associatedCourse} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Édition / Version</label>
                    <Input name="edition" type="text" defaultValue={editModalData.edition} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Référence / ISBN</label>
                    <Input name="referenceKey" type="text" defaultValue={editModalData.referenceKey} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mots-clés</label>
                    <Input name="tags" type="text" defaultValue={editModalData.tags?.join(',')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL du document (Fallback optionnel)</label>
                  <Input type="url" name="documentUrlString" placeholder="https://..." defaultValue={editModalData.fileUrl || ''} />
                </div>
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
        title="Supprimer le document"
        message="Êtes-vous sûr de vouloir supprimer définitivement ce document de la bibliothèque ?"
        confirmText="Supprimer"
        type="danger"
      />
    </>
  )
}
