import { ArrowLeft, Download, FileText, ShoppingCart, Share2 } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { getDocument } from "../../services/documents"
import type { Document } from "../../types/api"

export function DocumentDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return

      try {
        const data = await getDocument(id)
        setDocument(data)
      } catch (err) {
        setError('Erreur lors du chargement du document')
        console.error('Error fetching document:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-32 mb-6"></div>
          <div className="h-64 bg-slate-200 rounded-2xl mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-slate-200 rounded-2xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-slate-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
        <div>
          <button
            onClick={() => navigate('/library')}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à la bibliothèque
          </button>
        </div>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Erreur de chargement</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  const {
    publisher,
    publicationYear,
    edition,
    format,
    language,
  } = document

  const { user } = useAuth()
  const documentImageUrl = document.previewUrl || document.imageUrl || ''
  const isPaid = Boolean(document.price)
  const userIsPremium = Boolean(user?.isPremium)
  const tags = document.tags ?? []

  const handleAction = () => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank')
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      <div>
        <button
          onClick={() => navigate('/library')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à la bibliothèque
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-6 p-6 sm:p-8">
              <div className="relative w-full lg:w-64 h-64 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                {documentImageUrl ? (
                  <>
                    <img
                      src={documentImageUrl}
                      alt={`Couverture de ${document.title}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="fallback-icon hidden absolute inset-0 flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <FileText className="h-16 w-16 text-blue-500 dark:text-blue-400" />
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FileText className="h-16 w-16 text-blue-500 dark:text-blue-400" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-300">
                  {document.category}
                </span>
                <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                  {document.title}
                </h1>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  Par <span className="font-semibold text-slate-900 dark:text-white">{document.authorDetails?.name || 'Auteur inconnu'}</span>
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{document.rating}</p>
                    <p className="mt-1">Note</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{document.downloadsCount}</p>
                    <p className="mt-1">Téléchargements</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{document.pagesCount}</p>
                    <p className="mt-1">Pages</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button onClick={handleAction} disabled={!document.fileUrl} className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${isPaid ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-blue-600 text-white hover:bg-blue-700'} ${!document.fileUrl ? 'opacity-50 cursor-not-allowed hover:bg-current' : ''}`}>
                    {isPaid ? <ShoppingCart className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                    {isPaid ? `Acheter pour ${document.price} €` : 'Télécharger'}
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                    <Share2 className="h-4 w-4" />
                    Partager
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">À propos de ce document</h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{document.description}</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Informations générales</h3>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Éditeur</span>
                    <span className="font-medium text-slate-900 dark:text-white">{document.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Année</span>
                    <span className="font-medium text-slate-900 dark:text-white">{document.publicationYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format</span>
                    <span className="font-medium text-slate-900 dark:text-white">{document.format}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Détails académiques</h3>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Cours associé</span>
                    <span className="font-medium text-slate-900 dark:text-white">{document.associatedCourse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Référence</span>
                    <span className="font-medium text-slate-900 dark:text-white">{document.referenceKey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statut</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${document.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'}`}>
                      {document.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {document.isPremium && !userIsPremium && (
            <div className="rounded-3xl border border-amber-200/80 bg-amber-50 p-6 shadow-sm dark:border-amber-900/30 dark:bg-amber-900/10">
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-3">Premium disponible</h3>
              <p className="text-sm text-amber-700 dark:text-amber-200 mb-4">Ce document fait partie des contenus Premium. Passez à l'abonnement pour y accéder sans frais supplémentaires.</p>
              <button onClick={() => navigate('/profile')} className="w-full rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition">
                Essayer Premium
              </button>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-[0.24em]">Informations Fichier</h2>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between items-center">
                <span>Éditeur</span>
                <span className="font-semibold text-slate-900 dark:text-white">{publisher}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Année</span>
                <span className="font-semibold text-slate-900 dark:text-white">{publicationYear} ({edition})</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Format</span>
                <span className="font-semibold text-slate-900 dark:text-white">{format}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Langue</span>
                <span className="font-semibold text-slate-900 dark:text-white">{language}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Prix</span>
                <span className="font-semibold text-slate-900 dark:text-white">{isPaid ? `${document.price} €` : 'Gratuit'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Accès</span>
                <a href={document.fileUrl || '#'} target="_blank" rel="noreferrer" className={`font-semibold hover:underline dark:text-blue-400 ${document.fileUrl ? 'text-blue-600' : 'text-slate-400 pointer-events-none'}`}>{document.fileUrl ? 'Voir le document' : 'Aucun lien disponible'}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
