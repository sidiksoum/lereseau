import { useState, useEffect } from "react"
import { Check, FileText, BadgeCheck, AlertCircle, X, Loader2, Search } from "lucide-react"
import { getAdminCertifications, processAdminCertification, getAdminPendingPremium, approveAdminPremium, rejectAdminPremium, getAdminUsers } from "../../services/admin"

type RequestType = 'mentor' | 'institution' | 'premium' | 'student'

export function AdminCertificationsPage() {
  const [activeTab, setActiveTab] = useState<RequestType>('mentor')
  const [mentors, setMentors] = useState<any[]>([])
  const [institutions, setInstitutions] = useState<any[]>([])
  const [premiums, setPremiums] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [certsData, premiumData, allStudents] = await Promise.all([
        getAdminCertifications(),
        getAdminPendingPremium(),
        getAdminUsers(0, 1000, 'student')
      ])
      setMentors(certsData.mentors || [])
      setInstitutions(certsData.institutions || [])
      setPremiums(premiumData ? premiumData.filter((p: any) => p.roleType !== 'student') : [])
      setStudents(allStudents ? allStudents.filter((s: any) => s.isPremium || s.premiumPaymentMethod === 'PENDING_REQUEST') : [])
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCertify = async (userId: string, isApproved: boolean) => {
    try {
      await processAdminCertification(userId, isApproved)
      // Update local state instead of fetchData() to prevent items from disappearing
      setMentors(prev => prev.map(m => m.id === userId ? { ...m, status: isApproved ? 'VERIFIED' : 'REJECTED' } : m))
      setInstitutions(prev => prev.map(i => i.id === userId ? { ...i, status: isApproved ? 'VERIFIED' : 'REJECTED' } : i))
    } catch (error) {
      console.error("Erreur lors du traitement de la certification", error)
    }
  }

  const handlePremium = async (userId: string, isApproved: boolean) => {
    try {
      if (isApproved) {
        await approveAdminPremium(userId)
      } else {
        await rejectAdminPremium(userId)
      }
      // Update local state instead of fetchData() to prevent items from disappearing
      setPremiums(prev => prev.map(p => p.id === userId ? { ...p, isPremium: isApproved } : p))
      setStudents(prev => prev.map(s => s.id === userId ? { ...s, isPremium: isApproved } : s))
    } catch (error) {
      console.error("Erreur lors du traitement du premium", error)
    }
  }

  const filteredMentors = mentors.filter(m => (m.firstName + ' ' + m.lastName).toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredInstitutions = institutions.filter(i => (i.firstName || i.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredPremiums = premiums.filter(p => (p.firstName + ' ' + p.lastName).toLowerCase().includes(searchQuery.toLowerCase()))
  const filteredStudents = students.filter(s => (s.firstName + ' ' + s.lastName).toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><BadgeCheck className="h-6 w-6 text-indigo-600" /> Validation & Certifications (KYC)</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Examen strict des accréditations Mentors et reçus de paiement Premium.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full max-w-2xl overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('mentor')}
          className={`flex-1 py-2 px-4 font-semibold text-sm rounded-lg transition-all whitespace-nowrap ${activeTab === 'mentor' ? 'bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Mentors ({filteredMentors.length})
        </button>
        <button
          onClick={() => setActiveTab('institution')}
          className={`flex-1 py-2 px-4 font-semibold text-sm rounded-lg transition-all whitespace-nowrap ${activeTab === 'institution' ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Institutions ({filteredInstitutions.length})
        </button>
        <button
          onClick={() => setActiveTab('student')}
          className={`flex-1 py-2 px-4 font-semibold text-sm rounded-lg transition-all whitespace-nowrap ${activeTab === 'student' ? 'bg-white dark:bg-slate-900 text-fuchsia-900 dark:text-fuchsia-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Étudiants ({filteredStudents.length})
        </button>
        <button
          onClick={() => setActiveTab('premium')}
          className={`flex-1 py-2 px-4 font-semibold text-sm rounded-lg transition-all whitespace-nowrap ${activeTab === 'premium' ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          Paiements Premium ({filteredPremiums.length})
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeTab === 'mentor' && filteredMentors.map(req => {
            const isApproved = req.status === 'VERIFIED';
            return (
              <div key={req.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{req.firstName} {req.lastName}</h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{req.jobTitle || 'Professionnel'} • {req.workDomain || 'Général'}</p>
                    <p className="text-xs text-slate-400 mt-1">Inscrit le {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  {isApproved ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <Check className="h-3 w-3" /> Validé
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> En examen
                    </span>
                  )}
                </div>
                <div className="p-5 bg-slate-50 flex items-center gap-3 border-b border-slate-100">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Document Fourni (KYC)</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{req.kycDocumentUrl ? "Document transmis" : "Aucun document"}</p>
                    {req.kycDocumentUrl && req.kycDocumentUrl !== "PENDING_REQUEST" && <a href={req.kycDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-xs font-semibold hover:underline">Ouvrir le document</a>}
                  </div>
                </div>
                <div className="p-4 flex items-center justify-end gap-3 bg-white">
                  {isApproved ? (
                    <>
                      <button onClick={() => handleCertify(req.id, false)} className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                        <X className="h-4 w-4" /> Révoquer Certification
                      </button>
                      <button disabled className="px-4 py-2 bg-indigo-200 text-indigo-700 cursor-not-allowed rounded-lg text-sm font-semibold flex items-center gap-2">
                        <Check className="h-4 w-4" /> Mentor Actif
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleCertify(req.id, false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors">
                        Rejeter / Révoquer
                      </button>
                      <button onClick={() => handleCertify(req.id, true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                        <BadgeCheck className="h-4 w-4" /> Activer Profil Mentor
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}

          {activeTab === 'institution' && filteredInstitutions.map(req => {
            const isApproved = req.status === 'VERIFIED';
            return (
              <div key={req.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{req.firstName || req.name}</h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{req.institutionType || 'Institution'} • {req.institutionDetails || 'Général'}</p>
                    <p className="text-xs text-slate-400 mt-1">Inscrit le {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  {isApproved ? (
                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
                      <Check className="h-3 w-3" /> Validé
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> En examen
                    </span>
                  )}
                </div>
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Document Fourni (KYC)</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{req.kycDocumentUrl ? "Document transmis" : "Aucun document"}</p>
                    {req.kycDocumentUrl && req.kycDocumentUrl !== "PENDING_REQUEST" && <a href={req.kycDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline">Ouvrir le document</a>}
                  </div>
                </div>
                <div className="p-4 flex items-center justify-end gap-3 bg-white dark:bg-slate-900">
                  {isApproved ? (
                    <button onClick={() => handleCertify(req.id, false)} className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                      <X className="h-4 w-4" /> Révoquer Institution
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleCertify(req.id, false)} className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Rejeter</button>
                      <button onClick={() => handleCertify(req.id, true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                        <BadgeCheck className="h-4 w-4" /> Certifier Institution
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}

          {activeTab === 'premium' && filteredPremiums.map(req => {
            const isApproved = req.isPremium;
            return (
              <div key={req.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{req.firstName} {req.lastName}</h3>
                    <p className="text-sm font-bold text-emerald-600">{req.roleType}</p>
                    <p className="text-xs text-slate-400 mt-1">Inscrit le {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  {isApproved ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <Check className="h-3 w-3" /> Abonnement Actif
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Vérification Requise
                    </span>
                  )}
                </div>
                <div className="p-5 bg-slate-50 border-b border-slate-100 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Détails de transaction</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{req.premiumAmount || "Non précisé"} — {req.premiumPaymentMethod || "Paiement externe"}</p>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                    <div className="p-2 bg-slate-200 text-slate-600 dark:text-slate-400 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{req.premiumReceiptUrl ? "Reçu fourni" : "Aucun reçu"}</p>
                      {req.premiumReceiptUrl && req.premiumReceiptUrl !== "PENDING_REQUEST" && <a href={req.premiumReceiptUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-xs font-semibold hover:underline">Voir la capture du reçu</a>}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-end gap-3 bg-white">
                  {isApproved ? (
                    <button onClick={() => handlePremium(req.id, false)} className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                      <X className="h-4 w-4" /> Révoquer Premium
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handlePremium(req.id, false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 transition-colors flex items-center gap-1"><X className="w-4 h-4" /> Refuser</button>
                      <button onClick={() => handlePremium(req.id, true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                        <Check className="h-4 w-4" /> Activer l'abonnement
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}

          {activeTab === 'student' && filteredStudents.map(req => {
            const isApproved = req.isPremium;
            return (
              <div key={req.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{req.firstName} {req.lastName}</h3>
                    <p className="text-sm font-bold text-fuchsia-600">Étudiant(e)</p>
                    <p className="text-xs text-slate-400 mt-1">Inscrit le {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  {isApproved ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <Check className="h-3 w-3" /> Premium Actif
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Vérification Requise
                    </span>
                  )}
                </div>
                <div className="p-5 bg-slate-50 border-b border-slate-100 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Détails de transaction</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{req.premiumAmount || "Non précisé"} — {req.premiumPaymentMethod || "Paiement externe"}</p>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                    <div className="p-2 bg-slate-200 text-slate-600 dark:text-slate-400 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{req.premiumReceiptUrl ? "Reçu fourni" : "Aucun reçu"}</p>
                      {req.premiumReceiptUrl && req.premiumReceiptUrl !== "PENDING_REQUEST" && <a href={req.premiumReceiptUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-xs font-semibold hover:underline">Voir la capture du reçu</a>}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-end gap-3 bg-white">
                  {isApproved ? (
                    <button onClick={() => handlePremium(req.id, false)} className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                      <X className="h-4 w-4" /> Révoquer Premium Étudiant
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handlePremium(req.id, false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 transition-colors flex items-center gap-1"><X className="w-4 h-4" /> Refuser</button>
                      <button onClick={() => handlePremium(req.id, true)} className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                        <Check className="h-4 w-4" /> Activer l'abonnement
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}

          {activeTab === 'mentor' && filteredMentors.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-500">Aucune demande de mentorat trouvée.</div>
          )}
          {activeTab === 'institution' && filteredInstitutions.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-500">Aucune demande d'institution trouvée.</div>
          )}
          {activeTab === 'premium' && filteredPremiums.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-500">Aucune demande premium trouvée.</div>
          )}
          {activeTab === 'student' && filteredStudents.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-500">Aucun étudiant premium trouvé.</div>
          )}
        </div>
      )}
    </div>
  )
}
