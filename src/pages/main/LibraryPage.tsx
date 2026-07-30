import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, FileText, Download, Clock, Star, ShoppingCart, Filter } from "lucide-react"
import { getDocuments } from "../../services/documents"
import type { Document } from "../../types/api"

export function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tout')
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getDocuments({
          q: searchQuery.trim() || undefined,
          category: activeCategory === 'Tout' ? undefined : activeCategory,
        })
        setDocuments(data)
      } catch (err) {
        setError('Erreur lors du chargement des documents')
        console.error('Error fetching documents:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [searchQuery, activeCategory])

  const filteredDocs = documents.filter(doc =>
    doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-4 w-full">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Bibliothèque</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ressources, sujets d'examens et documents partagés.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-64"
            />
          </div>
          <button className="flex items-center justify-center p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {['Tout', 'Mathématiques', 'Physique', 'Informatique', 'Anglais', 'Méthodologie'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden animate-pulse">
              <div className="flex flex-row p-3 sm:p-5 gap-3 sm:gap-5">
                <div className="h-24 w-20 sm:h-32 sm:w-28 shrink-0 rounded-lg bg-slate-200"></div>
                <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                  <div>
                    <div className="h-4 bg-slate-200 rounded mb-1"></div>
                    <div className="h-3 bg-slate-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                    <div className="flex gap-1 mb-2">
                      <div className="h-3 bg-slate-200 rounded w-12"></div>
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                    <div className="h-3 bg-slate-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                <div className="h-4 bg-slate-200 rounded w-20"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <FileText className="h-12 w-12 text-slate-200 mb-3" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Erreur de chargement</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{error}</p>
          </div>
        ) : filteredDocs.length > 0 ? filteredDocs.map((doc) => (
          <div key={doc.id} onClick={() => navigate(`/library/${doc.id}`)} className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group overflow-hidden cursor-pointer">
            <div className="flex flex-row p-3 sm:p-5 gap-3 sm:gap-5">

              {/* Image d'illustration PDF */}
              <div className="h-24 w-20 sm:h-32 sm:w-28 shrink-0 rounded-lg overflow-hidden border border-slate-200 relative bg-slate-100 group-hover:border-blue-300 transition-colors shadow-sm">
                {doc.previewUrl || doc.imageUrl || doc.fileUrl ? (
                  <img
                    src={doc.previewUrl || doc.imageUrl || doc.fileUrl || ''}
                    alt={`Visuel de ${doc.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`fallback-icon flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 ${(doc.previewUrl || doc.imageUrl || doc.fileUrl) ? 'hidden' : ''}`}>
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div className="absolute top-0 right-0 p-1 bg-white/90 backdrop-blur-sm rounded-bl-lg shadow-sm border-b border-l border-white/50">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-[15px] sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{doc.title}</h3>
                    <button className="text-slate-300 hover:text-amber-400 transition-colors shrink-0 hidden sm:block"><Star className="h-5 w-5" /></button>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-1">{doc.publisher} • {doc.publicationYear}</p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-2 line-clamp-2 leading-relaxed">{doc.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(doc.tags || []).map((tag, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-400 font-medium mt-2 sm:mt-3">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(doc.createdAt).toLocaleDateString('fr-FR')}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 line-clamp-1">{doc.format} - {doc.pagesCount} pages</span>
                </div>
              </div>
            </div>

            {/* Actions: Prix & Téléchargement / Achat */}
            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className={`text-sm font-bold ${doc.isPremium ? 'text-slate-900 dark:text-white bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm' : 'text-green-600 bg-green-50 px-2 py-1 rounded-md'}`}>
                {doc.isPremium ? `${doc.price} €` : "Gratuit"}
              </span>

              {doc.isPremium ? (
                <Link
                  onClick={(e) => e.stopPropagation()}
                  to={`/library/checkout/${doc.id}`}
                  className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                  <ShoppingCart className="h-4 w-4" /> Acheter
                </Link>
              ) : (
                <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-5 py-2 rounded-lg font-bold transition-all shadow-sm">
                  <Download className="h-4 w-4" /> Télécharger
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <FileText className="h-12 w-12 text-slate-200 mb-3" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucun document trouvé</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">Essayez avec d'autres mots-clés ou modifiez vos filtres.</p>
          </div>
        )}
      </div>
    </div>
  )
}
