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
import { createAdminOpportunity, getAdminOpportunities, deleteAdminOpportunity, updateAdminOpportunity } from '../../../services/admin'
import type { Opportunity } from '../../../types/api'
import { ConfirmationDialog } from '../../../components/ui/ConfirmationDialog'

export function AdminCMSScholarshipTab({ showToast }: { showToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [opportunityTitle, setOpportunityTitle] = useState('')
  const [opportunityOrganization, setOpportunityOrganization] = useState('')
  const [opportunityCategory, setOpportunityCategory] = useState('Bourse d\'étude (Licence/Master/Doctorat)')
  const [opportunityAmount, setOpportunityAmount] = useState('')
  const [opportunityDeadline, setOpportunityDeadline] = useState('')
  const [opportunityFundingSource, setOpportunityFundingSource] = useState('')
  const [opportunityTargetAudience, setOpportunityTargetAudience] = useState('')
  const [opportunityDescription, setOpportunityDescription] = useState('')
  const [opportunityEligibility, setOpportunityEligibility] = useState('')
  const [opportunityProcess, setOpportunityProcess] = useState('')
  const [opportunitySelectionCriteria, setOpportunitySelectionCriteria] = useState('')
  const [opportunityContactEmail, setOpportunityContactEmail] = useState('')
  const [opportunityExternalLink, setOpportunityExternalLink] = useState('')
  const [opportunityContactPerson, setOpportunityContactPerson] = useState('')
  const [opportunityBanner, setOpportunityBanner] = useState<File | null>(null)
  const [opportunityBannerUrlString, setOpportunityBannerUrlString] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Modals states
  const [viewModalData, setViewModalData] = useState<Opportunity | null>(null)
  const [editModalData, setEditModalData] = useState<Opportunity | null>(null)
  const [deleteDialogData, setDeleteDialogData] = useState<Opportunity | null>(null)

  const loadOpportunities = async () => {
    setIsLoading(true)
    try {
      const data = await getAdminOpportunities()
      setOpportunities((data as Opportunity[]) || [])
    } catch (error) {
      console.error(error)
      showToast('Erreur lors du chargement des opportunités', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOpportunities()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', opportunityTitle)
      formData.append('organization', opportunityOrganization)
      formData.append('domain', opportunityCategory)
      if (opportunityAmount) formData.append('amount', opportunityAmount)
      if (opportunityDeadline) formData.append('deadline', opportunityDeadline)
      if (opportunityFundingSource) formData.append('fundingSource', opportunityFundingSource)
      if (opportunityTargetAudience) formData.append('targetAudience', opportunityTargetAudience)
      if (opportunityDescription) formData.append('description', opportunityDescription)
      if (opportunityEligibility) formData.append('eligibilityRequirements', opportunityEligibility)
      if (opportunityProcess) formData.append('applicationProcess', opportunityProcess)
      if (opportunitySelectionCriteria) formData.append('selectionCriteria', opportunitySelectionCriteria)
      if (opportunityContactEmail) formData.append('contactEmail', opportunityContactEmail)
      if (opportunityExternalLink) formData.append('applyUrl', opportunityExternalLink)
      if (opportunityContactPerson) formData.append('contactPerson', opportunityContactPerson)
      if (opportunityBanner) {
        formData.append('bannerImg', opportunityBanner)
      } else if (opportunityBannerUrlString) {
        formData.append('bannerUrlString', opportunityBannerUrlString)
      }

      await createAdminOpportunity(formData)
      showToast('Opportunité publiée avec succès.', 'success')
      
      // Reset
      setOpportunityTitle('')
      setOpportunityOrganization('')
      setOpportunityAmount('')
      setOpportunityDeadline('')
      setOpportunityFundingSource('')
      setOpportunityTargetAudience('')
      setOpportunityDescription('')
      setOpportunityEligibility('')
      setOpportunityProcess('')
      setOpportunitySelectionCriteria('')
      setOpportunityContactEmail('')
      setOpportunityExternalLink('')
      setOpportunityContactPerson('')
      setOpportunityBanner(null)
      setOpportunityBannerUrlString('')
      
      loadOpportunities()
    } catch (error) {
      showToast('Impossible de publier l\'opportunité.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialogData) return
    try {
      await deleteAdminOpportunity(deleteDialogData.id)
      showToast('Opportunité supprimée avec succès.', 'success')
      setDeleteDialogData(null)
      loadOpportunities()
    } catch (err) {
      showToast('Erreur lors de la suppression.', 'error')
    }
  }

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editModalData) return

    try {
      const formData = new FormData(e.currentTarget)
      await updateAdminOpportunity(editModalData.id, formData)
      showToast('Opportunité mise à jour avec succès.', 'success')
      setEditModalData(null)
      loadOpportunities()
    } catch (err) {
      showToast('Erreur lors de la mise à jour.', 'error')
    }
  }

  const totalPages = Math.ceil(opportunities.length / itemsPerPage)
  const paginatedData = opportunities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Nouvelle Bourse ou Opportunité</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Titre de l'opportunité</label>
            <Input type="text" value={opportunityTitle} onChange={(e) => setOpportunityTitle(e.target.value)} placeholder="Ex: Bourse d'Excellence Eiffel 2024" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Institution partenaire</label>
              <Input type="text" value={opportunityOrganization} onChange={(e) => setOpportunityOrganization(e.target.value)} placeholder="Ex: Campus France" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Catégorie</label>
              <select value={opportunityCategory} onChange={(e) => setOpportunityCategory(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-indigo-600 focus:ring-indigo-600 p-2.5 text-sm h-[42px] outline-none">
                <option>Bourse d'étude (Licence/Master/Doctorat)</option>
                <option>Stage professionnel</option>
                <option>Emploi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Montant & Prise en charge</label>
              <Input type="text" value={opportunityAmount} onChange={(e) => setOpportunityAmount(e.target.value)} placeholder="Ex: 5000€/an + Logement" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Date limite (Deadline)</label>
              <Input type="date" value={opportunityDeadline} onChange={(e) => setOpportunityDeadline(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Source de financement</label>
              <Input type="text" value={opportunityFundingSource} onChange={(e) => setOpportunityFundingSource(e.target.value)} placeholder="Ex: Programme d'État" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Public cible</label>
              <Input type="text" value={opportunityTargetAudience} onChange={(e) => setOpportunityTargetAudience(e.target.value)} placeholder="Ex: Étudiants d'Afrique de l'Ouest" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description et Missions</label>
              <textarea
                rows={3}
                value={opportunityDescription}
                onChange={(e) => setOpportunityDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm outline-none"
                placeholder="Détaillez les activités..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Critères d'éligibilité</label>
              <textarea
                rows={3}
                value={opportunityEligibility}
                onChange={(e) => setOpportunityEligibility(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm outline-none"
                placeholder="Documents : CV, Lettre..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Processus de candidature</label>
              <textarea
                rows={3}
                value={opportunityProcess}
                onChange={(e) => setOpportunityProcess(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm outline-none"
                placeholder="1. Inscription..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Critères de sélection</label>
              <textarea
                rows={3}
                value={opportunitySelectionCriteria}
                onChange={(e) => setOpportunitySelectionCriteria(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm outline-none"
                placeholder="Excellence, Leadership..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email de contact</label>
              <Input type="email" value={opportunityContactEmail} onChange={(e) => setOpportunityContactEmail(e.target.value)} placeholder="postuler@institution.com" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Lien externe</label>
              <Input type="url" value={opportunityExternalLink} onChange={(e) => setOpportunityExternalLink(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Personne à contacter</label>
              <Input type="text" value={opportunityContactPerson} onChange={(e) => setOpportunityContactPerson(e.target.value)} placeholder="Ex: Marie Curie" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Image de bannière (Fichier optionnel)</label>
              <Input type="file" accept="image/*" onChange={(e) => setOpportunityBanner(e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL de l'image (Fallback optionnel)</label>
              <Input type="url" value={opportunityBannerUrlString} onChange={(e) => setOpportunityBannerUrlString(e.target.value)} placeholder="https://..." />
            </div>
          </div>
        </div>

        <Button disabled={isSubmitting} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 font-bold" size="lg" type="submit">
          {isSubmitting ? 'Publication...' : 'Publier la Bourse'}
        </Button>
      </form>

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Opportunités - Gérer ({opportunities.length})</h3>
          </div>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>
          ) : (
            <>
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
                  {paginatedData.map((opp, idx) => (
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
                        <button onClick={() => setViewModalData(opp)} className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg tooltip" title="Voir">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => setEditModalData(opp)} className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg tooltip" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteDialogData(opp)} className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg tooltip" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Aucune opportunité trouvée.</td>
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
            <h3 className="text-lg font-bold mb-4 pr-8 text-slate-900 dark:text-white">Détails de l'opportunité</h3>
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Titre:</strong> {viewModalData.title}</p>
              <p><strong>Organisation:</strong> {viewModalData.organization}</p>
              <p><strong>Montant:</strong> {viewModalData.amount}</p>
              <div>
                <strong>Description:</strong>
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg whitespace-pre-wrap">{viewModalData.description || 'N/A'}</div>
              </div>
              {(viewModalData.bannerUrl || viewModalData.imageUrl) && (
                <div>
                  <strong>Bannière:</strong>
                  <div className="mt-2 h-40 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                    <img src={viewModalData.bannerUrl || viewModalData.imageUrl || ''} alt="Bannière" className="w-full h-full object-cover" />
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
            <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Modifier l'opportunité</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Titre</label>
                    <Input name="title" defaultValue={editModalData.title} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Organisation</label>
                    <Input name="organization" defaultValue={editModalData.organization} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Montant & Prise en charge</label>
                    <Input name="amount" defaultValue={editModalData.amount} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Source de financement</label>
                    <Input name="fundingSource" defaultValue={editModalData.fundingSource} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Date limite (Deadline)</label>
                    <Input name="deadline" type="date" defaultValue={editModalData.deadline ?? ''} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Public cible</label>
                    <Input name="targetAudience" defaultValue={editModalData.targetAudience} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={editModalData.description}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL de l'image de bannière (Fallback optionnel)</label>
                  <Input type="url" name="bannerUrlString" placeholder="https://..." defaultValue={editModalData.bannerUrl || editModalData.imageUrl || ''} />
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
        title="Supprimer l'opportunité"
        message="Êtes-vous sûr de vouloir supprimer définitivement cette opportunité ?"
        confirmText="Supprimer"
        type="danger"
      />
    </>
  )
}
