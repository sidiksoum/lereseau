import { useState, useRef } from 'react'
import { X, Upload, Loader2, Link as LinkIcon, FileText, BookOpen } from 'lucide-react'
import { createPremiumDocument } from '../../services/publishing'

interface PublishDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function PublishDocumentModal({ isOpen, onClose, onSuccess }: PublishDocumentModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState("Mathématiques Appliquées")
  const [accessType, setAccessType] = useState<'FREE' | 'PREMIUM'>('FREE')
  
  const [price, setPrice] = useState('')
  const [pagesCount, setPagesCount] = useState('')
  const [format, setFormat] = useState('PDF')
  const [author, setAuthor] = useState('')
  const [publicationYear, setPublicationYear] = useState('')
  const [publisher, setPublisher] = useState('')
  const [associatedCourse, setAssociatedCourse] = useState('')
  const [edition, setEdition] = useState('')

  const [file, setFile] = useState<File | null>(null)
  const [externalUrl, setExternalUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!externalUrl.trim()) {
      setError("Veuillez fournir un lien externe vers le document.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('accessType', accessType)
      if (price) formData.append('price', price)
      if (pagesCount) formData.append('pagesCount', pagesCount)
      if (format) formData.append('format', format)
      if (author) formData.append('author', author)
      if (publicationYear) formData.append('publicationYear', publicationYear)
      if (publisher) formData.append('publisher', publisher)
      if (associatedCourse) formData.append('associatedCourse', associatedCourse)
      if (edition) formData.append('edition', edition)
      if (imageUrl.trim()) formData.append('imageUrl', imageUrl.trim())

      if (file) {
        formData.append('file', file)
      }
      if (externalUrl.trim()) {
        formData.append('externalUrl', externalUrl.trim())
      }

      await createPremiumDocument(formData)
      onSuccess()
      onClose()

      // Reset form
      setTitle('')
      setDescription('')
      setCategory('Mathématiques Appliquées')
      setAccessType('FREE')
      setPrice('')
      setPagesCount('')
      setFormat('PDF')
      setAuthor('')
      setPublicationYear('')
      setPublisher('')
      setAssociatedCourse('')
      setEdition('')
      setFile(null)
      setExternalUrl('')
      setImageUrl('')
    } catch (err: any) {
      setError(err.message || "Erreur lors de la publication du document")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Publier un document</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <form id="doc-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Titre du document</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm outline-none"
                placeholder="Ex: Guide pratique de l'entrepreneuriat"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description / Résumé</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-600 focus:ring-emerald-600 p-3 text-sm outline-none"
                placeholder="Décrivez brièvement le contenu de ce document..."
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Domaine d'étude</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm outline-none"
                >
                  <option value="Mathématiques Appliquées">Mathématiques Appliquées</option>
                  <option value="Informatique & Réseaux">Informatique & Réseaux</option>
                  <option value="Droit des Affaires">Droit des Affaires</option>
                  <option value="Médecine">Médecine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Prix (Laissez vide si gratuit)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm outline-none"
                  placeholder="Ex: 5000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre de pages</label>
                <input
                  type="number"
                  value={pagesCount}
                  onChange={(e) => setPagesCount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm outline-none"
                >
                  <option value="PDF">PDF</option>
                  <option value="EPUB">EPUB</option>
                  <option value="DOCX">DOCX</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Auteur du document</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Année de publication</label>
                <input
                  type="number"
                  value={publicationYear}
                  onChange={(e) => setPublicationYear(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Éditeur / Institution</label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Cours associé</label>
                <input
                  type="text"
                  value={associatedCourse}
                  onChange={(e) => setAssociatedCourse(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Édition / Version</label>
                <input
                  type="text"
                  value={edition}
                  onChange={(e) => setEdition(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Type d'accès</label>
                <select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value as 'FREE' | 'PREMIUM')}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm outline-none"
                >
                  <option value="FREE">Gratuit (Accessible à tous)</option>
                  <option value="PREMIUM">Premium (Réservé aux membres Premium)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL de l'image de couverture (Optionnel)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm outline-none"
                placeholder="Ex: https://example.com/cover.jpg"
              />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Source du document (Choisissez une option)</label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: Image de couverture */}
                <div className={`border-2 rounded-xl p-4 transition-colors ${file ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 border-dashed'}`}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {!file ? (
                    <div onClick={() => fileInputRef.current?.click()} className="text-center cursor-pointer py-4">
                      <Upload className="mx-auto h-6 w-6 text-slate-400 mb-2" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Importer une image de couverture</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-lg shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Option 2: External URL */}
                <div className={`border-2 rounded-xl p-4 transition-colors ${externalUrl ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex flex-col justify-center h-full gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                      <LinkIcon className="h-4 w-4" />
                      Ou lien vers le document (Drive, Dropbox...)
                    </div>
                    <input
                      type="url"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2 text-sm outline-none focus:border-emerald-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Annuler
          </button>
          <button
            form="doc-form"
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
            Publier le document
          </button>
        </div>
      </div>
    </div>
  )
}
