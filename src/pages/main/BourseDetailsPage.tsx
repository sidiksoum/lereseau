import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, Briefcase, MapPin, Heart, Share2, ShieldCheck, CheckCircle2, Clock, Globe } from 'lucide-react'
import { getOpportunity } from '../../services/opportunities'
import type { Opportunity } from '../../types/api'

export function BourseDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return

      try {
        const data = await getOpportunity(id)
        setOpportunity(data)
      } catch (err) {
        setError('Erreur lors du chargement de l\'opportunité')
        console.error('Error fetching opportunity:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunity()
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

  if (error || !opportunity) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
        <div>
          <button
            onClick={() => navigate('/opportunities')}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux opportunités
          </button>
        </div>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Erreur de chargement</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  const getOppImageUrl = (opp: Opportunity) => {
    if (opp.imageUrl || opp.bannerUrl) return opp.imageUrl || opp.bannerUrl;
    if (opp.attachments && opp.attachments.length > 0) {
      for (const a of opp.attachments) {
        if (typeof a === 'string') {
          if (a.includes('url=')) return a.split('url=')[1].split(';')[0].replace('}', '').trim();
          if (a.startsWith('http')) return a;
        } else if (a && typeof a === 'object' && a.url) {
          return a.url;
        }
      }
    }
    return '';
  };

  const bannerImageUrl = getOppImageUrl(opportunity);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12">
      {/* Bouton de retour */}
      <div>
        <button
          onClick={() => navigate('/opportunities')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux opportunités
        </button>
      </div>

      {/* Bannière et Header principal */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="h-32 md:h-48 w-full relative overflow-hidden">
          {bannerImageUrl ? (
            <>
              <img
                src={bannerImageUrl}
                alt={`Visuel de ${opportunity.title}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="fallback-bg hidden absolute inset-0 h-full w-full bg-gradient-to-r from-blue-600 to-indigo-700" />
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-blue-600 to-indigo-700" />
          )}
          <div className="absolute inset-0 bg-slate-900/20" />
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button className="h-10 w-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="h-10 w-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 md:-mt-16 mb-6">
            <div className="h-24 w-24 md:h-32 md:w-32 bg-white dark:bg-slate-800 rounded-2xl shadow-md border-4 border-white dark:border-slate-900 flex items-center justify-center shrink-0">
              <Briefcase className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 w-full flex flex-col items-start gap-2">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-lg">
                {opportunity.type}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{opportunity.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                {opportunity.location && <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {opportunity.location}</div>}
                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Publié {new Date(opportunity.createdAt).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
            <div className="w-full md:w-auto mt-4 md:mt-0">
              <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-colors text-sm">
                Postuler Maintenant
              </button>
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
                {opportunity.deadline ? `Délai: ${new Date(opportunity.deadline).toLocaleDateString('fr-FR')}` : 'Date limite non spécifiée'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Colonne Principale (Détails) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Description de l'offre</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <p className="mb-4">
                {opportunity.description}
              </p>
              {opportunity.missions && (
                <p className="mb-4">
                  {opportunity.missions}
                </p>
              )}
              {opportunity.benefits && (
                <p className="mb-4">
                  {opportunity.benefits}
                </p>
              )}
              <h3 className="text-md font-bold text-slate-900 dark:text-white mt-6 mb-3">Vos missions :</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                {opportunity.eligibilityRequirements && (
                  <li>Exigences d'éligibilité: {opportunity.eligibilityRequirements.text}</li>
                )}
                {opportunity.selectionCriteria && (
                  <li>Critères de sélection: {opportunity.selectionCriteria.text}</li>
                )}
                {opportunity.applicationProcess && (
                  <li>Processus de candidature: {opportunity.applicationProcess.text}</li>
                )}
              </ul>
              {opportunity.fundingDetails && (
                <>
                  <h3 className="text-md font-bold text-slate-900 dark:text-white mt-6 mb-3">Détails du financement :</h3>
                  <p className="mb-4">{opportunity.fundingDetails}</p>
                </>
              )}

              {opportunity.selectionCriteria && (
                <>
                  <h3 className="text-md font-bold text-slate-900 dark:text-white mt-8 mb-4">Critères de sélection :</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
                      <span>{opportunity.selectionCriteria.text}</span>
                    </li>
                  </ul>
                </>
              )}

              {opportunity.applicationProcess && (
                <>
                  <h3 className="text-md font-bold text-slate-900 dark:text-white mt-8 mb-5">Processus de candidature :</h3>
                  <div className="relative border-l-2 border-blue-100 dark:border-blue-900/50 ml-3.5 pl-6 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[39.5px] flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 ring-[6px] ring-white dark:ring-slate-900 text-xs font-bold text-blue-600 dark:text-blue-400">
                        1
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Candidature</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 md:line-clamp-none">{opportunity.applicationProcess.text}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Alert IA Match */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/40 p-6 rounded-2xl flex gap-4 items-start">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-full shadow-sm shrink-0">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-1">Pourquoi cette offre vous correspond ?</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300/80">Basé sur votre profil étudiant et vos compétences déclarées, notre IA estime un match de <strong className="font-extrabold text-emerald-900 dark:text-emerald-300">92%</strong> avec les exigences de cette structure.</p>
            </div>
          </div>
        </div>

        {/* Sidebar d'infos (Droite) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">Résumé</h2>

            <div className="space-y-5">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm text-slate-500 dark:text-slate-400">Organisation</span>
                <span className="font-semibold text-sm text-slate-900 dark:text-white">{opportunity.organization}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm text-slate-500 dark:text-slate-400">Montant / Sal.</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{opportunity.amount}</span>
              </div>
              {opportunity.location && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Localisation</span>
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">{opportunity.location}</span>
                </div>
              )}
              {opportunity.duration && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Durée</span>
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">{opportunity.duration}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Public cible</span>
                <span className="font-semibold text-sm text-slate-900 dark:text-white">{opportunity.targetAudience}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-sm text-slate-500 dark:text-slate-400">Financement</span>
                <span className="font-semibold text-sm text-slate-900 dark:text-white text-right w-[60%] leading-tight">{opportunity.fundingSource}</span>
              </div>
              {opportunity.domain && (
                <div className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Domaine</span>
                  <span className="font-semibold text-sm text-slate-900 dark:text-white text-right w-[60%] leading-tight">{opportunity.domain}</span>
                </div>
              )}
            </div>

            {opportunity.deadline && (
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">Date limite</h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="font-medium text-slate-900 dark:text-white">{new Date(opportunity.deadline).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">Contact</h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="font-bold text-sm text-slate-900 dark:text-white">{opportunity.contactPerson?.name || 'Contact non disponible'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Contact</p>
                <a href={`mailto:${opportunity.contactPerson?.email ?? ''}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">{opportunity.contactPerson?.email || 'Email non disponible'}</a>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-slate-400" />
                <a href="#" className="text-sm text-blue-600 hover:underline">Voir le site de l'organisation</a>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-slate-800 p-6 rounded-2xl shadow-sm text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <h3 className="font-bold mb-2 relative z-10">Besoin d'aide pour postuler ?</h3>
            <p className="text-sm text-slate-300 mb-4 relative z-10">Demandez conseil à la communauté ou faites réviser votre CV par un mentor académique.</p>
            <button className="w-full bg-white text-slate-900 dark:bg-blue-600 dark:text-white hover:bg-slate-100 dark:hover:bg-blue-700 font-semibold py-2.5 rounded-lg text-sm transition-colors relative z-10">
              Trouver un Mentor
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
