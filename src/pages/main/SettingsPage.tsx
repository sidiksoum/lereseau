import { useState } from 'react'
import { User, Bell, Palette, Shield, Globe, Monitor, Type, Moon, Sun, MonitorSmartphone, Key, Lock, LogOut, HelpCircle } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeProvider'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog'

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('appearance')
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  const tabs = [
    { id: 'profile', label: t('settings.profile_tab'), icon: User },
    { id: 'appearance', label: t('settings.appearance'), icon: Palette },
    { id: 'notifications', label: t('settings.notifications_tab'), icon: Bell },
    { id: 'security', label: t('settings.security_tab'), icon: Shield },
    { id: 'language', label: t('settings.language'), icon: Globe },
    { id: 'privacy', label: 'Confidentialité', icon: Lock },
    { id: 'account', label: 'Compte', icon: Key },
    { id: 'help', label: 'Aide', icon: HelpCircle },
    { id: 'logout', label: 'Déconnexion', icon: LogOut },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full max-w-5xl mx-auto dark:text-white">
      {/* Sidebar des paramètres */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 px-2">{t('settings.title')}</h1>
        <div className="flex flex-row md:flex-col overflow-x-auto hide-scrollbar gap-1 bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'logout') {
                  setShowLogoutConfirm(true);
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
            >
              <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des paramètres */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">

        {/* Tab: Apparence */}
        {activeTab === 'appearance' && (
          <div className="p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Apparence de l'application</h2>

            <div className="space-y-8">
              {/* Thème */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-slate-400" /> Thème
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button onClick={() => setTheme('light')} className={`flex flex-col items-center gap-3 p-4 border-2 rounded-xl transition-all h-full ${theme === 'light' ? 'border-blue-600 bg-blue-50/50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                    <Sun className={`h-8 w-8 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span className={`text-sm font-semibold ${theme === 'light' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>{t('settings.theme_light')}</span>
                  </button>
                  <button onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-3 p-4 border-2 rounded-xl transition-all h-full ${theme === 'dark' ? 'border-blue-600 bg-blue-50/50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                    <Moon className={`h-8 w-8 ${theme === 'dark' ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>{t('settings.theme_dark')}</span>
                  </button>
                  <button onClick={() => setTheme('system')} className={`flex flex-col items-center gap-3 p-4 border-2 rounded-xl transition-all h-full ${theme === 'system' ? 'border-blue-600 bg-blue-50/50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                    <MonitorSmartphone className={`h-8 w-8 ${theme === 'system' ? 'text-blue-500' : 'text-slate-400'}`} />
                    <span className={`text-sm font-semibold ${theme === 'system' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>{t('settings.theme_system')}</span>
                  </button>
                </div>
              </div>

              {/* Police */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <Type className="h-4 w-4 text-slate-400" /> Police et Typographie
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Famille de police</label>
                    <select className="w-full sm:max-w-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none">
                      <option>Inter (Par défaut)</option>
                      <option>Roboto</option>
                      <option>Poppins</option>
                      <option>System Default</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Langue */}
        {activeTab === 'language' && (
          <div className="p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('settings.language')}</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sélectionnez la langue de l'interface</label>
                <select
                  value={i18n.language.split('-')[0]}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="w-full sm:max-w-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none"
                >
                  <option value="fr">Français (French)</option>
                  <option value="en">English (Anglais)</option>
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">La langue affecte tous les menus et textes de l'interface. Les publications générées par les utilisateurs s'afficheront dans leur langue originale.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Notifications */}
        {activeTab === 'notifications' && (
          <div className="p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Préférences de Notifications</h2>

            <div className="space-y-6">
              {[
                { title: "Notifications Push", desc: "Recevez des alertes en temps réel sur votre navigateur.", active: true },
                { title: "Nouveaux messages", desc: "Être notifié quand vous recevez un message chat.", active: true },
                { title: "Opportunités & Bourses", desc: "Recevez les offres de bourse IA correspondantes.", active: true },
                { title: "Mentions du forum", desc: "Être alerté lorsque quelqu'un vous identifie.", active: false },
                { title: "Emails Récapitulatifs", desc: "Recevez un email hebdomadaire de l'activité.", active: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                  <div className="pr-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <button className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${item.active ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.active ? 'translate-x-5' : 'translate-x-0'}`}></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Confidentialité */}
        {activeTab === 'privacy' && (
          <div className="p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Confidentialité</h2>
            <div className="space-y-6">
              {[
                { title: "Profil public", desc: "Autoriser tout le monde à voir mon profil", active: true },
                { title: "Statut en ligne", desc: "Afficher quand je suis en ligne", active: true },
                { title: "Recherche par email", desc: "Permettre aux autres de me trouver via mon email", active: false },
                { title: "Collecte de données", desc: "Autoriser l'utilisation de mes données pour améliorer le service", active: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                  <div className="pr-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <button className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${item.active ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.active ? 'translate-x-5' : 'translate-x-0'}`}></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Profil */}
        {activeTab === 'profile' && (
          <div className="p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Mon Profil</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
                  <User className="h-10 w-10 text-slate-400" />
                </div>
                <div>
                  <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Changer la photo
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Prénom</label>
                  <input type="text" defaultValue="Utilisateur" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nom</label>
                  <input type="text" defaultValue="Test" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                  <textarea rows={3} defaultValue="Passionné par le développement et les nouvelles technologies." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none"></textarea>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Sécurité */}
        {activeTab === 'security' && (
          <div className="p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Sécurité</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-3">Changer le mot de passe</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Mot de passe actuel</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Nouveau mot de passe</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Confirmer le mot de passe</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none" />
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-3">Authentification à deux facteurs (2FA)</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Ajoute une couche de sécurité supplémentaire.</p>
                  <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-slate-200 dark:bg-slate-700">
                    <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Compte */}
        {activeTab === 'account' && (
          <div className="p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Paramètres du compte</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Adresse email</label>
                <div className="flex max-w-md gap-3">
                  <input type="email" defaultValue="utilisateur@exemple.com" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none" readOnly />
                  <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">
                    Modifier
                  </button>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-red-600 mb-3">Zone de danger</h3>
                <div className="border border-red-200 dark:border-red-900/50 rounded-xl p-4 bg-red-50/50 dark:bg-red-900/10">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">Supprimer le compte</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière possible.</p>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Aide */}
        {activeTab === 'help' && (
          <div className="p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Aide et Support</h2>
            <div className="space-y-4">
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">Centre d'aide</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Trouvez des réponses à vos questions dans notre base de connaissances.</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">Nous contacter</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Envoyez-nous un message et nous vous répondrons dès que possible.</p>
              </div>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">Signaler un problème</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Aidez-nous à améliorer la plateforme en signalant les bugs rencontrés.</p>
              </div>
              <div className="pt-4 text-center">
                <p className="text-xs text-slate-400">Version 1.0.0</p>
              </div>
            </div>
          </div>
        )}

            {/* Footer Actions */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:px-8 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
              <button className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Réinitialiser
              </button>
              <button className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors">
                Enregistrer
              </button>
            </div>

          </div>

          {/* Logout Confirmation Dialog */}
          <ConfirmationDialog
            isOpen={showLogoutConfirm}
            onClose={() => setShowLogoutConfirm(false)}
            onConfirm={handleLogout}
            title="Déconnexion"
            message="Êtes-vous sûr de vouloir vous déconnecter?"
            confirmText={isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
            type="danger"
          />

    </div>
      )
}
