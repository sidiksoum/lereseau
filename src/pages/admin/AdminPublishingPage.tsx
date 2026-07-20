import { useState, useEffect } from "react"
import { Upload, BookOpen, Award, MessageSquare, Edit, Eye, Trash2, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { getAdminFeeds, getAdminOpportunities, getAdminDocuments } from "../../services/admin"

export function AdminPublishingPage() {
  const [activeTab, setActiveTab] = useState<'scholarship' | 'library' | 'feed'>('feed')

  const [feeds, setFeeds] = useState<any[]>([])
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'feed') {
        const data = await getAdminFeeds()
        setFeeds(data)
      } else if (activeTab === 'scholarship') {
        const data = await getAdminOpportunities()
        setOpportunities(data)
      } else if (activeTab === 'library') {
        const data = await getAdminDocuments()
        setDocuments(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Outils de Publication</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ajoutez du contenu officiel pour la communauté.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${activeTab === 'feed' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-500' : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
        >
          <MessageSquare className={`h-8 w-8 mb-2 ${activeTab === 'feed' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
          <span className={`font-bold ${activeTab === 'feed' ? 'text-blue-900 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>Fil d'actualité</span>
        </button>

        <button
          onClick={() => setActiveTab('scholarship')}
          className={`flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${activeTab === 'scholarship' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 dark:border-indigo-500' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
        >
          <Award className={`h-8 w-8 mb-2 ${activeTab === 'scholarship' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
          <span className={`font-bold ${activeTab === 'scholarship' ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>Bourse d'étude</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${activeTab === 'library' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 hover:border-emerald-300'
            }`}
        >
          <BookOpen className={`h-8 w-8 mb-2 ${activeTab === 'library' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span className={`font-bold ${activeTab === 'library' ? 'text-emerald-900' : 'text-slate-600 dark:text-slate-400'}`}>Document Bibliothèque</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">

        {activeTab === 'feed' && (
          <>
            <form className="space-y-6 animate-in fade-in max-w-2xl">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Publier un message officiel</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Contenu de la publication</label>
                  <textarea
                    rows={6}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-blue-600 p-3 text-sm outline-none"
                    placeholder="Votre message officiel apparaîtra en tête du fil d'actualité..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Joindre une image institutionnelle (Optionnel)</label>
                  <div className="mt-1 flex justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-6 py-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500" />
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">Sélectionner une photo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 font-semibold text-white border-0" size="lg">
                Diffuser sur le Fil
              </Button>
            </form>

            <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Publications - Fil d'actualité</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Filtrer et gérer les publications officielles par type.</p>
                </div>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 outline-none text-slate-700 dark:text-slate-300">
                    <option>Tous</option>
                    <option>Publiés</option>
                    <option>Brouillons</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                {loading ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
                ) : (
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
                      {feeds.map((feed: any, idx: number) => (
                        <tr key={feed.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900 dark:text-white max-w-md truncate">{feed.title || feed.content?.substring(0, 50) + '...'}</div>
                            <div className="text-xs text-slate-500">Auteur: {feed.authorDetails?.firstName || 'Admin'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {feed.type || 'Publication'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                            {feed.createdAt ? new Date(feed.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                            <button className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg tooltip" title="Voir">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg tooltip" title="Modifier">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg tooltip" title="Supprimer">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {feeds.length === 0 && !loading && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Aucune publication trouvée.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'scholarship' && (
          <>
            <form className="space-y-6 animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Nouvelle Bourse ou Opportunité</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Titre de l'opportunité</label>
                  <Input type="text" placeholder="Ex: Bourse d'Excellence Eiffel 2024" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Institution partenaire</label>
                    <Input type="text" placeholder="Ex: Campus France" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Catégorie</label>
                    <select className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-indigo-600 focus:ring-indigo-600 p-2.5 text-sm h-[42px] outline-none">
                      <option>Bourse d'étude (Licence/Master/Doctorat)</option>
                      <option>Stage professionnel</option>
                      <option>Emploi</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Montant & Prise en charge</label>
                    <Input type="text" placeholder="Ex: 5000€/an + Logement" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Date limite (Deadline)</label>
                    <Input type="date" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Source de financement (Bailleur)</label>
                    <Input type="text" placeholder="Ex: Programme d'État / Banque Mondiale" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Public cible</label>
                    <Input type="text" placeholder="Ex: Étudiants d'Afrique de l'Ouest (Bac +4)" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description et Missions</label>
                    <textarea
                      rows={3}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-indigo-600 p-3 text-sm outline-none"
                      placeholder="Détaillez les activités et objectifs de cette opportunité..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Critères d'éligibilité & Documents requis</label>
                    <textarea
                      rows={3}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-indigo-600 p-3 text-sm outline-none"
                      placeholder="Ex: Être de nationalité sénégalaise, avoir un Bac+3. Documents : CV, Lettre de motivation..."
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Processus de candidature (Étapes)</label>
                    <textarea
                      rows={3}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-indigo-600 p-3 text-sm outline-none"
                      placeholder="1. Inscription en ligne, 2. Entretien visio..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Critères de sélection (Mots-clés)</label>
                    <textarea
                      rows={3}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-indigo-600 p-3 text-sm outline-none"
                      placeholder="Excellence académique, Proactivité, Leadership..."
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email de contact</label>
                    <Input type="email" placeholder="postuler@institution.com" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Lien externe (Optionnel)</label>
                    <Input type="url" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Personne à contacter</label>
                    <Input type="text" placeholder="Ex: Marie Curie, Resp. Admissions" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Image de bannière (Optionnel)</label>
                  <div className="mt-1 flex justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-6 py-8 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-500" aria-hidden="true" />
                      <div className="mt-2 flex text-sm leading-6 text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-indigo-600">Téléverser un fichier</span>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">PNG, JPG, GIF jusqu'à 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full sm:w-auto" size="lg">Publier la Bourse</Button>
            </form>

            <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Publications - Opportunités</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Filtrer et gérer les publications officielles par type.</p>
                </div>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 outline-none text-slate-700 dark:text-slate-300">
                    <option>Tous</option>
                    <option>Publiés</option>
                    <option>Brouillons</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                {loading ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Titre / Organisation</th>
                        <th className="px-6 py-4 font-semibold">Type</th>
                        <th className="px-6 py-4 font-semibold">Deadline / Info</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {opportunities.map((opp: any, idx: number) => (
                        <tr key={opp.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900 dark:text-white max-w-md truncate">{opp.title}</div>
                            <div className="text-xs text-slate-500">{opp.organization || 'Non spécifié'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              {opp.type || 'Opportunité'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                            <div className="text-sm">{opp.amount ? opp.amount : 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                            <button className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg tooltip" title="Voir">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg tooltip" title="Modifier">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg tooltip" title="Supprimer">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {opportunities.length === 0 && !loading && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Aucune opportunité trouvée.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'library' && (
          <>
            <form className="space-y-6 animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Nouveau Document (Bibliothèque Premium)</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Titre du document</label>
                  <Input type="text" placeholder="Ex: Annales Mathématiques L3" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Domaine d'étude</label>
                    <select className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm h-[42px] outline-none">
                      <option>Mathématiques Appliquées</option>
                      <option>Informatique & Réseaux</option>
                      <option>Droit des Affaires</option>
                      <option>Médecine</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Prix (Laissez vide si gratuit)</label>
                    <Input type="number" placeholder="Ex: 500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Résumé / Description</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-600 focus:ring-emerald-600 p-3 text-sm outline-none"
                    placeholder="Résumé bref ce que contient ce document..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre de pages</label>
                    <Input type="number" placeholder="Ex: 120" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Format</label>
                    <select className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-emerald-600 focus:ring-emerald-600 p-2.5 text-sm h-[42px] outline-none">
                      <option>PDF</option>
                      <option>EPUB</option>
                      <option>DOCX</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Auteur du document</label>
                    <Input type="text" placeholder="Ex: Dr. Sy" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Année de publication</label>
                    <Input type="number" placeholder="Ex: 2025" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Éditeur / Institution</label>
                    <Input type="text" placeholder="Ex: Presses Universitaires" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Cours associé (Optionnel)</label>
                    <Input type="text" placeholder="Ex: MAT301 - Algèbre" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Édition / Version</label>
                    <Input type="text" placeholder="Ex: 2ème Édition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Référence / ISBN</label>
                    <Input type="text" placeholder="Ex: ISBN-13: 978..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mots-clés (séparés par virgule)</label>
                    <Input type="text" placeholder="Algèbre, Concours, Master" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Table des matières (Optionnel, séparé par des virgules)</label>
                  <Input type="text" placeholder="1. Intro, 2. Théorie, 3. Exercices" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Fichier du document (PDF, DOCX)</label>
                  <div className="mt-1 flex justify-center rounded-lg border border-dashed border-emerald-300 dark:border-emerald-700 px-6 py-6 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-emerald-400 dark:text-emerald-600" />
                      <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400 text-center">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">Sélectionner le Fichier</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 font-semibold text-white border-0" size="lg">
                Publier dans la bibliothèque
              </Button>
            </form>

            <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Publications - Documents</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Filtrer et gérer les publications officielles par type.</p>
                </div>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 outline-none text-slate-700 dark:text-slate-300">
                    <option>Tous</option>
                    <option>Publiés</option>
                    <option>Brouillons</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                {loading ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-emerald-600" /></div>
                ) : (
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
                      {documents.map((doc: any, idx: number) => (
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
                            <button className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg tooltip" title="Voir">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg tooltip" title="Modifier">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg tooltip" title="Supprimer">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {documents.length === 0 && !loading && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Aucun document trouvé.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
