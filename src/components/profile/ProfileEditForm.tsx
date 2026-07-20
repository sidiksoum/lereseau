import { useState, useRef } from "react"
import { Upload, Camera, Award, GraduationCap, Briefcase, Building2, Save, X, Loader2 } from "lucide-react"

export function ProfileEditForm({
  profile,
  setProfile,
  setIsEditing,
  handleSave,
  isSaving,
  avatarFile,
  setAvatarFile,
  coverFile,
  setCoverFile,
  avatarPreview,
  setAvatarPreview,
  coverPreview,
  setCoverPreview,
  removedExperienceIds,
  setRemovedExperienceIds,
  removedEducationIds,
  setRemovedEducationIds
}: any) {
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setCoverPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Modification du Profil</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Mettez à jour vos informations publiques.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
            <X className="h-4 w-4" /> Annuler
          </button>
          <button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer
          </button>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 mb-8">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2"><Camera className="w-5 h-5 text-blue-500" /> Photos</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Photo de profil (Avatar)</label>
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-md overflow-hidden shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Upload className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                <button onClick={() => avatarInputRef.current?.click()} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Changer l'avatar
                </button>
                <p className="text-xs text-slate-500 mt-2">Format recommandé : JPG, PNG. Taille max : 2MB.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Photo de couverture</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-full sm:w-64 h-32 rounded-xl bg-white border-4 border-white shadow-md overflow-hidden shrink-0">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Upload className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
                <button onClick={() => coverInputRef.current?.click()} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Changer la couverture
                </button>
                <p className="text-xs text-slate-500 mt-2">Format recommandé : JPG, PNG (16:9). Taille max : 5MB.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><Briefcase className="w-5 h-5 text-indigo-500" /> Type de Compte</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'student', label: 'Étudiant', icon: GraduationCap },
              { id: 'professional', label: 'Professionnel', icon: Briefcase },
              { id: 'institution', label: 'Institution', icon: Building2 },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setProfile({ ...profile, roleType: type.id as any })}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${profile.roleType === type.id
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-100 bg-white text-slate-600 dark:text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                  }`}
              >
                <type.icon className="h-5 w-5" /> {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Informations Générales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom Complet / Nom Structure</label>
              <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Localisation</label>
              <input type="text" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lien LinkedIn / Site Web</label>
              <input type="text" value={profile.linkedin} onChange={e => setProfile({ ...profile, linkedin: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL Avatar (Fallback)</label>
              <input type="text" value={profile.avatarUrl} onChange={e => setProfile({ ...profile, avatarUrl: e.target.value })} placeholder="https://..." className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL Couverture (Fallback)</label>
              <input type="text" value={profile.coverUrl} onChange={e => setProfile({ ...profile, coverUrl: e.target.value })} placeholder="https://..." className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">À Propos (Bio)</label>
            <textarea rows={4} value={profile.about} onChange={e => setProfile({ ...profile, about: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Détails de {profile.roleType === 'student' ? 'Scolarité' : profile.roleType === 'institution' ? 'l\'Organisation' : 'Carrière & KYC'}</h3>

          {profile.roleType === 'student' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Niveau d'étude</label>
                <input type="text" value={profile.educationLevel} onChange={e => setProfile({ ...profile, educationLevel: e.target.value })} placeholder="Ex: Master 2, Licence 3..." className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Domaine d'étude</label>
                <input type="text" value={profile.studyDomain} onChange={e => setProfile({ ...profile, studyDomain: e.target.value })} placeholder="Ex: Informatique, Droit..." className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          )}

          {profile.roleType === 'professional' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Poste Actuel</label>
                  <input type="text" value={profile.jobTitle} onChange={e => setProfile({ ...profile, jobTitle: e.target.value })} placeholder="Ex: Ingénieur Système" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Domaine Métier</label>
                  <input type="text" value={profile.workDomain} onChange={e => setProfile({ ...profile, workDomain: e.target.value })} placeholder="Ex: Cybersécurité, Finance..." className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {profile.roleType === 'institution' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type de structure</label>
                <select value={profile.institutionType} onChange={e => setProfile({ ...profile, institutionType: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Sélectionnez un type</option>
                  <option value="university">Université / École</option>
                  <option value="company">Entreprise</option>
                  <option value="ngo">ONG / Association</option>
                  <option value="government">Institution Publique</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Détails (Département, filière, spécialité)</label>
                <textarea rows={2} value={profile.institutionDetails} onChange={e => setProfile({ ...profile, institutionDetails: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
              </div>
            </div>
          )}
        </div>

        {profile.roleType !== 'institution' && (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><Award className="w-5 h-5 text-emerald-500" /> Compétences & Mots-clés</h3>
            </div>
            <p className="text-sm text-slate-500 mb-3">Séparez les compétences par des virgules (ex: React, Python, Management, Droit des affaires)</p>
            <input
              type="text"
              value={profile.skills.join(', ')}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="React, Management de projet, Finance d'entreprise..."
            />
          </div>
        )}

        {profile.roleType !== 'institution' && (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><Briefcase className="w-5 h-5 text-indigo-500" /> Expériences</h3>
              <button onClick={() => setProfile({ ...profile, experiences: [...profile.experiences, { id: Date.now(), title: '', company: '', startDate: '', endDate: '', description: '' }] })} className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">+ Ajouter</button>
            </div>
            <div className="space-y-4">
              {profile.experiences.map((exp: any, index: number) => (
                <div key={exp.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg relative">
                  <button onClick={() => {
                    const newExps = [...profile.experiences];
                    newExps.splice(index, 1);
                    setProfile({ ...profile, experiences: newExps });
                    if (exp.user_id) setRemovedExperienceIds([...removedExperienceIds, exp.id]);
                  }} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <input type="text" placeholder="Titre du poste" value={exp.title} onChange={e => { const newExps = [...profile.experiences]; newExps[index].title = e.target.value; setProfile({ ...profile, experiences: newExps }) }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                    <input type="text" placeholder="Entreprise" value={exp.company} onChange={e => { const newExps = [...profile.experiences]; newExps[index].company = e.target.value; setProfile({ ...profile, experiences: newExps }) }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <input type="date" value={exp.startDate ? exp.startDate.split('T')[0] : ''} onChange={e => { const newExps = [...profile.experiences]; newExps[index].startDate = e.target.value ? new Date(e.target.value).toISOString() : ''; setProfile({ ...profile, experiences: newExps }) }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-500" />
                    <input type="date" value={exp.endDate ? exp.endDate.split('T')[0] : ''} onChange={e => { const newExps = [...profile.experiences]; newExps[index].endDate = e.target.value ? new Date(e.target.value).toISOString() : ''; setProfile({ ...profile, experiences: newExps }) }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-500" />
                  </div>
                  <textarea placeholder="Description des missions..." rows={2} value={exp.description} onChange={e => { const newExps = [...profile.experiences]; newExps[index].description = e.target.value; setProfile({ ...profile, experiences: newExps }) }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm resize-none"></textarea>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.roleType === 'student' && (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-500" /> Scolarité</h3>
              <button onClick={() => setProfile({ ...profile, education: [...profile.education, { id: Date.now(), degree: '', school: '', startDate: '', endDate: '', description: '' }] })} className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">+ Ajouter</button>
            </div>
            <div className="space-y-4">
              {profile.education.map((edu: any, index: number) => (
                <div key={edu.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg relative">
                  <button onClick={() => {
                    const newEdu = [...profile.education];
                    newEdu.splice(index, 1);
                    setProfile({ ...profile, education: newEdu });
                    if (edu.user_id) setRemovedEducationIds([...removedEducationIds, edu.id]);
                  }} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <input type="text" placeholder="Diplôme (ex: Master, Licence)" value={edu.degree} onChange={e => { const newEdu = [...profile.education]; newEdu[index].degree = e.target.value; setProfile({ ...profile, education: newEdu }) }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                    <input type="text" placeholder="École / Université" value={edu.school} onChange={e => { const newEdu = [...profile.education]; newEdu[index].school = e.target.value; setProfile({ ...profile, education: newEdu }) }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <input type="date" value={edu.startDate ? edu.startDate.split('T')[0] : ''} onChange={e => { const newEdu = [...profile.education]; newEdu[index].startDate = e.target.value ? new Date(e.target.value).toISOString() : ''; setProfile({ ...profile, education: newEdu }) }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-500" />
                    <input type="date" value={edu.endDate ? edu.endDate.split('T')[0] : ''} onChange={e => { const newEdu = [...profile.education]; newEdu[index].endDate = e.target.value ? new Date(e.target.value).toISOString() : ''; setProfile({ ...profile, education: newEdu }) }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-500" />
                  </div>
                  <textarea placeholder="Description ou mention..." rows={2} value={edu.description} onChange={e => { const newEdu = [...profile.education]; newEdu[index].description = e.target.value; setProfile({ ...profile, education: newEdu }) }} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm resize-none"></textarea>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-colors">
          Annuler
        </button>
        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer les modifications
        </button>
      </div>
    </div>
  )
}
