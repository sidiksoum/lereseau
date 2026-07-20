import { useState, useEffect, useRef, type ChangeEvent } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { updateUserEducation, updateUserExperience, deleteUserEducation, deleteUserExperience } from "../../services/user"
import { requestPremium, requestCertification } from "../../services/profile"
import { ProfilePublications } from "../../components/profile/ProfilePublications"
import { ProfileEditForm } from "../../components/profile/ProfileEditForm"
import { ProfileHeader } from "../../components/profile/ProfileHeader"
import { StudentProfile } from "../../components/profile/StudentProfile"
import { ProfessionalProfile } from "../../components/profile/ProfessionalProfile"
import { InstitutionProfile } from "../../components/profile/InstitutionProfile"
import { MapPin, Mail, Link as LinkIcon, Edit, Award, GraduationCap, Briefcase, Camera, Check, X, Building2, Star, ShieldCheck, Sparkles, Upload, FileText, Zap, BookOpen, Plus, Trash2, Calendar, Lock, User, AlertCircle } from "lucide-react"

type ProfileExperience = {
  id: number
  user_id?: string
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
}

type ProfileEducation = {
  id: number
  user_id?: string
  degree: string
  school: string
  startDate: string
  endDate: string
  description: string
}

type ProfileState = {
  name: string
  roleType: 'student' | 'professional' | 'institution'
  isPremium: boolean
  location: string
  email: string
  linkedin: string
  about: string
  studyDomain: string
  educationLevel: string
  workDomain: string
  jobTitle: string
  openToMentoring: boolean
  cvUploaded: boolean
  institutionType: string
  institutionDetails: string
  nineaUploaded: boolean
  skills: string[]
  avatarUrl: string
  coverUrl: string
  experiences: ProfileExperience[]
  education: ProfileEducation[]
}

const initialProfileState: ProfileState = {
  name: '',
  roleType: 'student',
  isPremium: false,
  location: '',
  email: '',
  linkedin: '',
  about: '',
  studyDomain: '',
  educationLevel: '',
  workDomain: '',
  jobTitle: '',
  openToMentoring: false,
  cvUploaded: false,
  institutionType: '',
  institutionDetails: '',
  nineaUploaded: false,
  skills: [],
  avatarUrl: '',
  coverUrl: '',
  experiences: [],
  education: [],
}

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { user, updateProfile, createExperience, createEducation, fetchCurrentUser } = useAuth()

  const [isPendingPremium, setIsPendingPremium] = useState(false)
  const [isPendingCert, setIsPendingCert] = useState(false)
  const [flashMessage, setFlashMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      if (user.isPremium) {
        localStorage.removeItem(`premium_pending_${user.id}`)
        setIsPendingPremium(false)
      } else {
        setIsPendingPremium(localStorage.getItem(`premium_pending_${user.id}`) === 'true')
      }

      if (user.status === 'VERIFIED') {
        localStorage.removeItem(`cert_pending_${user.id}`)
        setIsPendingCert(false)
      } else {
        setIsPendingCert(localStorage.getItem(`cert_pending_${user.id}`) === 'true')
      }
    }
  }, [user])

  const [removedExperienceIds, setRemovedExperienceIds] = useState<number[]>([])
  const [removedEducationIds, setRemovedEducationIds] = useState<number[]>([])
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  const [photoPreviewModal, setPhotoPreviewModal] = useState<'avatar' | 'cover' | null>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)

  useEffect(() => {
    if (!user) return

    setProfile((previous) => ({
      ...previous,
      name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || previous.name,
      email: user.email ?? previous.email,
      location: user.location ?? previous.location,
      linkedin: user.linkedin ?? previous.linkedin,
      about: user.about ?? previous.about,
      educationLevel: user.educationLevel ?? previous.educationLevel,
      studyDomain: user.studyDomain ?? previous.studyDomain,
      jobTitle: user.jobTitle ?? previous.jobTitle,
      workDomain: user.workDomain ?? previous.workDomain,
      institutionType: user.institutionType ?? previous.institutionType,
      institutionDetails: user.institutionDetails ?? previous.institutionDetails,
      skills: user.skills ?? previous.skills,
      roleType: user.roleType ?? previous.roleType,
      isPremium: user.isPremium ?? previous.isPremium,
      avatarUrl: user.avatarUrl ?? previous.avatarUrl,
      coverUrl: user.coverUrl ?? previous.coverUrl,
      experiences: user.experiences?.map((exp) => ({
        id: exp.id || Date.now(),
        user_id: exp.user_id,
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
      })) ?? previous.experiences,
      education: user.educations?.map((edu) => ({
        id: edu.id || Date.now(),
        user_id: edu.user_id,
        degree: edu.degree,
        school: edu.school,
        startDate: edu.startDate,
        endDate: edu.endDate,
        description: edu.description,
      })) ?? previous.education,
    }))

    setAvatarPreview(user.avatarUrl ?? '')
    setCoverPreview(user.coverUrl ?? '')
  }, [user])

  const handleSave = async () => {
    if (!user) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)

    try {
      const [firstName, ...rest] = profile.name.trim().split(' ')
      const lastName = rest.join(' ')
      const formData = new FormData()

      formData.append('firstName', firstName || '')
      formData.append('lastName', lastName || '')
      formData.append('about', profile.about)
      formData.append('educationLevel', profile.educationLevel)
      formData.append('studyDomain', profile.studyDomain)
      formData.append('jobTitle', profile.jobTitle)
      formData.append('workDomain', profile.workDomain)
      formData.append('institutionType', profile.institutionType)
      formData.append('institutionDetails', profile.institutionDetails)
      formData.append('location', profile.location)
      formData.append('linkedin', profile.linkedin)
      formData.append('skills', JSON.stringify(profile.skills))
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      } else if (profile.avatarUrl) {
        formData.append('avatarUrlString', profile.avatarUrl)
      }
      if (coverFile) {
        formData.append('cover', coverFile)
      } else if (profile.coverUrl) {
        formData.append('coverUrlString', profile.coverUrl)
      }

      await updateProfile(formData)

      await Promise.all(
        removedExperienceIds.map((id) => deleteUserExperience(id))
      )

      await Promise.all(
        removedEducationIds.map((id) => deleteUserEducation(id))
      )

      const newExperiences = profile.experiences.filter((exp) => !exp.user_id && (exp.title || exp.company || exp.startDate || exp.endDate || exp.description))
      const newEducations = profile.education.filter((edu) => !edu.user_id && (edu.degree || edu.school || edu.startDate || edu.endDate || edu.description))
      const existingExperiences = profile.experiences.filter((exp) => exp.user_id)
      const existingEducations = profile.education.filter((edu) => edu.user_id)

      await Promise.all(
        existingExperiences.map((experience) =>
          updateUserExperience(experience.id, {
            title: experience.title,
            company: experience.company,
            startDate: experience.startDate,
            endDate: experience.endDate,
            description: experience.description,
          })
        )
      )

      await Promise.all(
        existingEducations.map((education) =>
          updateUserEducation(education.id, {
            school: education.school,
            degree: education.degree,
            startDate: education.startDate,
            endDate: education.endDate,
            description: education.description,
          })
        )
      )

      await Promise.all(newExperiences.map(createExperience))
      await Promise.all(newEducations.map(createEducation))

      await fetchCurrentUser()
      setRemovedExperienceIds([])
      setRemovedEducationIds([])
      setAvatarFile(null)
      setCoverFile(null)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error)
    } finally {
      setIsSaving(false)
      setIsEditing(false)
    }
  }

  const handlePhotoSave = async () => {
    if (!user) return
    setIsUploadingPhoto(true)

    try {
      const formData = new FormData()
      const [firstName, ...rest] = profile.name.trim().split(' ')
      const lastName = rest.join(' ')

      formData.append('firstName', firstName || '')
      formData.append('lastName', lastName || '')
      formData.append('about', profile.about)
      formData.append('educationLevel', profile.educationLevel)
      formData.append('studyDomain', profile.studyDomain)
      formData.append('jobTitle', profile.jobTitle)
      formData.append('workDomain', profile.workDomain)
      formData.append('institutionType', profile.institutionType)
      formData.append('institutionDetails', profile.institutionDetails)
      formData.append('location', profile.location)
      formData.append('linkedin', profile.linkedin)
      formData.append('skills', JSON.stringify(profile.skills))

      if (photoPreviewModal === 'avatar' && avatarFile) {
        formData.append('avatar', avatarFile)
      }
      if (photoPreviewModal === 'cover' && coverFile) {
        formData.append('cover', coverFile)
      }

      await updateProfile(formData)
      await fetchCurrentUser()

      setPhotoPreviewModal(null)
      setAvatarFile(null)
      setCoverFile(null)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo', error)
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const cancelPhotoPreview = () => {
    setPhotoPreviewModal(null)
    setAvatarFile(null)
    setCoverFile(null)
    setAvatarPreview(user?.avatarUrl ?? '')
    setCoverPreview(user?.coverUrl ?? '')
  }

  const [profile, setProfile] = useState<ProfileState>(initialProfileState)

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview)
      }
      if (coverPreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview)
      }
    }
  }, [avatarPreview, coverPreview])

  // --- FORM STATES FOR IN-SITU PUBLISHING ---
  const [isPublishingLibrary, setIsPublishingLibrary] = useState(false)
  const [isPublishingJob, setIsPublishingJob] = useState(false)

  const displayedAvatar = avatarPreview || profile.avatarUrl
  const displayedCover = coverPreview || profile.coverUrl

  const getRoleTitle = () => {
    if (profile.roleType === 'student') return `Étudiant ${profile.educationLevel} - ${profile.studyDomain}`
    if (profile.roleType === 'professional') return `${profile.jobTitle} - ${profile.workDomain}`
    if (profile.roleType === 'institution') return `${profile.institutionType}`
    return ""
  }

  const handleUpgradePremium = async () => {
    setIsProcessingPayment(true)
    try {
      if (profile.roleType === 'student') {
        await requestPremium()
        localStorage.setItem(`premium_pending_${user?.id}`, 'true')
        setIsPendingPremium(true)
      } else {
        await requestPremium()
        await requestCertification()
        localStorage.setItem(`premium_pending_${user?.id}`, 'true')
        localStorage.setItem(`cert_pending_${user?.id}`, 'true')
        setIsPendingPremium(true)
        setIsPendingCert(true)
      }

      setFlashMessage("Votre demande a été envoyée avec succès ! Vous allez être redirigé vers WhatsApp...")

      let roleMsg = profile.roleType === 'student' ? 'Étudiant' : profile.roleType === 'professional' ? 'Professionnel' : 'Institution'
      let message = `Bonjour LeRéseau, je suis ${profile.name} (${profile.email}, compte: ${roleMsg}). Je souhaite activer mon compte Premium`
      if (profile.roleType !== 'student') {
        message += ` et obtenir le statut certifié.`
      }

      setTimeout(() => {
        setIsPremiumModalOpen(false)
        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/2250798646697?text=${encodedMessage}`, '_blank')
        setIsProcessingPayment(false)
      }, 2000)

    } catch (error) {
      console.error(error)
      setFlashMessage("Une erreur est survenue lors de la demande.")
      setIsProcessingPayment(false)
    }
  }

  const getUpgradeButtonContent = () => {
    if (profile.roleType === 'student') {
      return (
        <div className="flex flex-col text-left">
          <span className="font-bold">Abonnement Premium</span>
          <span className="text-xs opacity-90 font-normal">Débloque la fonctionnalité radar (étudiants) ou la recommandation IA (pros/institutions).</span>
        </div>
      )
    }
    if (profile.roleType === 'professional') {
      return (
        <div className="flex flex-col text-left">
          <span className="font-bold">Je souhaite devenir Mentor Vérifié</span>
          <span className="text-xs opacity-90 font-normal">Accompagnez des étudiants et partagez votre expérience métier.</span>
        </div>
      )
    }
    if (profile.roleType === 'institution') {
      return (
        <div className="flex flex-col text-left">
          <span className="font-bold">Agrément Officiel (NINEA / Charte)</span>
          <span className="text-xs opacity-90 font-normal">Pour obtenir le statut certifié et prouver la véracité de votre structure, veuillez envoyer vos documents légaux. Déposer Document Légal.</span>
        </div>
      )
    }
    return "Toutes les fonctionnalités"
  }

  // List Management Mathods
  const addExperience = () => {
    setProfile({ ...profile, experiences: [...profile.experiences, { id: Date.now(), title: '', company: '', startDate: '', endDate: '', description: '' }] })
  }

  const handleRemoveExperience = (id: number) => {
    const confirmed = window.confirm('Voulez-vous vraiment supprimer cette expérience ?')
    if (!confirmed) return

    setProfile((previous) => {
      const removed = previous.experiences.find((exp) => exp.id === id)
      if (removed?.user_id) {
        setRemovedExperienceIds((current) => [...current, id])
      }
      return {
        ...previous,
        experiences: previous.experiences.filter((exp) => exp.id !== id),
      }
    })
  }

  const addEducation = () => {
    setProfile({ ...profile, education: [...profile.education, { id: Date.now(), degree: '', school: '', startDate: '', endDate: '', description: '' }] })
  }

  const addSkill = () => {
    setProfile({ ...profile, skills: [...profile.skills, ''] })
  }

  const handleRemoveSkill = (index: number) => {
    setProfile({ ...profile, skills: profile.skills.filter((_, i) => i !== index) })
  }

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...profile.skills]
    newSkills[index] = value
    setProfile({ ...profile, skills: newSkills })
  }

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setPhotoPreviewModal('avatar')
  }

  const handleCoverFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
    setPhotoPreviewModal('cover')
  }

  const openAvatarPicker = () => {
    setTimeout(() => avatarInputRef.current?.click(), 50)
  }

  const openCoverPicker = () => {
    setTimeout(() => coverInputRef.current?.click(), 50)
  }

  const renderHiddenFileInputs = () => (
    <>
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFileChange} />
      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFileChange} />
    </>
  )

  const handleRemoveEducation = (id: number) => {
    const confirmed = window.confirm('Voulez-vous vraiment supprimer cette formation ?')
    if (!confirmed) return

    setProfile((previous) => {
      const removed = previous.education.find((edu) => edu.id === id)
      if (removed?.user_id) {
        setRemovedEducationIds((current) => [...current, id])
      }
      return {
        ...previous,
        education: previous.education.filter((edu) => edu.id !== id),
      }
    })
  }


  // ---- RENDER VIEW MODE ----
  if (isEditing) {
    return (
      <ProfileEditForm
        profile={profile}
        setProfile={setProfile}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
        isSaving={isSaving}
        avatarFile={avatarFile}
        setAvatarFile={setAvatarFile}
        coverFile={coverFile}
        setCoverFile={setCoverFile}
        avatarPreview={avatarPreview}
        setAvatarPreview={setAvatarPreview}
        coverPreview={coverPreview}
        setCoverPreview={setCoverPreview}
        removedExperienceIds={removedExperienceIds}
        setRemovedExperienceIds={setRemovedExperienceIds}
        removedEducationIds={removedEducationIds}
        setRemovedEducationIds={setRemovedEducationIds}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto">
      {renderHiddenFileInputs()}
      
      <ProfileHeader 
        profile={profile}
        displayedCover={displayedCover}
        displayedAvatar={displayedAvatar}
        openCoverPicker={openCoverPicker}
        openAvatarPicker={openAvatarPicker}
        getRoleTitle={getRoleTitle}
        setIsEditing={setIsEditing}
      />

      {profile.roleType === 'student' && (
        <StudentProfile 
          profile={profile} 
          flashMessage={flashMessage}
          isPendingPremium={isPendingPremium}
          isPendingCert={isPendingCert}
          setIsPremiumModalOpen={setIsPremiumModalOpen}
          getUpgradeButtonContent={getUpgradeButtonContent}
        />
      )}
      {profile.roleType === 'professional' && (
        <ProfessionalProfile 
          profile={profile} 
          flashMessage={flashMessage}
          isPendingPremium={isPendingPremium}
          isPendingCert={isPendingCert}
          setIsPremiumModalOpen={setIsPremiumModalOpen}
          getUpgradeButtonContent={getUpgradeButtonContent}
        />
      )}
      {profile.roleType === 'institution' && (
        <InstitutionProfile 
          profile={profile} 
          flashMessage={flashMessage}
          isPendingPremium={isPendingPremium}
          isPendingCert={isPendingCert}
          setIsPremiumModalOpen={setIsPremiumModalOpen}
          getUpgradeButtonContent={getUpgradeButtonContent}
        />
      )}

      {/* SECTION : Mes Publications (Premium uniquement) - Largeur maximale en bas */}
      {(profile.roleType === 'professional' || profile.roleType === 'institution') && profile.isPremium && (
        <div className="mt-8">
          <ProfilePublications />
        </div>
      )}

      {/* MODAL PREMIUM */}
      {isPremiumModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden relative">
            <button onClick={() => setIsPremiumModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full p-2 transition-colors z-10">
              <X className="w-5 h-5" />
            </button>

            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-center relative overflow-hidden">
              <Sparkles className="absolute -top-6 -right-6 w-32 h-32 text-white/20" />
              <div className="mx-auto bg-white/20 p-3 rounded-full w-fit mb-4 backdrop-blur-md border border-white/30">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">LeRéseau Premium</h2>
              <p className="text-amber-50 font-medium">L'outil ultime pour votre carrière et vos études.</p>
            </div>

            <div className="p-8 pb-4">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full text-emerald-600 dark:text-emerald-400 mt-0.5"><Check className="w-4 h-4" /></div>
                  <span className="text-slate-700 dark:text-slate-300 text-sm"><strong className="text-slate-900 dark:text-white">Badge Premium Exclusif</strong> visible par tous sur votre profil.</span>
                </li>
                {profile.roleType === 'student' && (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full text-emerald-600 dark:text-emerald-400 mt-0.5"><Check className="w-4 h-4" /></div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm"><strong className="text-slate-900 dark:text-white">LeRéseau AI Match</strong> : Notification instantanée des bourses correspondantes.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full text-emerald-600 dark:text-emerald-400 mt-0.5"><Check className="w-4 h-4" /></div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm"><strong className="text-slate-900 dark:text-white">Documents Pédagogiques</strong> illimités dans la Bibliothèque.</span>
                    </li>
                  </>
                )}
                {profile.roleType === 'professional' && (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full text-emerald-600 dark:text-emerald-400 mt-0.5"><Check className="w-4 h-4" /></div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm"><strong className="text-slate-900 dark:text-white">Recommandation Mentorat IA</strong> : Attirez les meilleurs profils vers votre mentorat.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full text-emerald-600 dark:text-emerald-400 mt-0.5"><Check className="w-4 h-4" /></div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm"><strong className="text-slate-900 dark:text-white">Visibilité Accrue</strong> : Mettez en avant vos publications et votre expertise.</span>
                    </li>
                  </>
                )}
                {profile.roleType === 'institution' && (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full text-emerald-600 dark:text-emerald-400 mt-0.5"><Check className="w-4 h-4" /></div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm"><strong className="text-slate-900 dark:text-white">Propulsion Ciblée</strong> : Vos annonces atteignent directement les étudiants cibles.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full text-emerald-600 dark:text-emerald-400 mt-0.5"><Check className="w-4 h-4" /></div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm"><strong className="text-slate-900 dark:text-white">Statistiques Avancées</strong> : Suivez la portée de vos annonces et formations.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="p-8 pt-0 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">4.99€ <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">/mois</span></span>
                </div>
                <div className="text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">Sans engagement</div>
              </div>
              <button
                onClick={handleUpgradePremium}
                disabled={isProcessingPayment}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-wait shadow-lg"
              >
                {isProcessingPayment ? (
                  <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900 rounded-full animate-spin"></div> Paiement en cours...</span>
                ) : (
                  <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Payer et Activer Premium</span>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1"><ShieldCheck className="w-3 h-3" /> Paiement sécurisé via Stripe</p>
            </div>
          </div>
        </div>
      )}
      {/* PHOTO PREVIEW MODAL */}
      {photoPreviewModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden relative">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Aperçu de la photo</h2>
              <button onClick={cancelPhotoPreview} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full p-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 min-h-[250px]">
              {photoPreviewModal === 'avatar' && (
                <div className="h-48 w-48 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-slate-700">
                  <img src={avatarPreview} alt="Aperçu Avatar" className="h-full w-full object-cover" />
                </div>
              )}
              {photoPreviewModal === 'cover' && (
                <div className="w-full h-40 rounded-xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-700">
                  <img src={coverPreview} alt="Aperçu Couverture" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={cancelPhotoPreview} disabled={isUploadingPhoto} className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                Annuler
              </button>
              <button onClick={handlePhotoSave} disabled={isUploadingPhoto} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2">
                {isUploadingPhoto ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Enregistrement...</>
                ) : (
                  <><Check className="w-4 h-4" /> Enregistrer</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
