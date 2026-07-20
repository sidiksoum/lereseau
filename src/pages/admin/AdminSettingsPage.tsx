import { Settings, ShieldAlert, Key, Database } from "lucide-react"
import { Button } from "../../components/ui/Button"

export function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-slate-600 dark:text-slate-400" /> Paramètres Système
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configurations globales avancées de la plateforme.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Generaly Settings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h2 className="font-bold text-slate-900 dark:text-white">Général</h2>
           </div>
           <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Mode Maintenance</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Bascule la plateforme en accès restreint et affiche une page de maintenance.</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" />
                   <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                 </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                 <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Inscriptions Ouvertes</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Autorise les nouveaux utilisateurs à créer des comptes publiquement.</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" defaultChecked />
                   <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                 </label>
              </div>
           </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
           <div className="px-6 py-4 border-b border-red-100 bg-red-50/30 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-600" />
              <h2 className="font-bold text-red-900">Sécurité & API</h2>
           </div>
           <div className="p-6 space-y-6">
              <div className="space-y-3 flex justify-between items-center gap-4">
                 <div className="flex items-start gap-4 flex-1">
                    <Key className="h-5 w-5 text-slate-400 mt-1" />
                    <div>
                       <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Clé API Paiement (Wave/Orange)</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1 blur-sm select-none">sk_live_1234567890abcdef</p>
                    </div>
                 </div>
                 <Button className="bg-white text-slate-700 dark:text-slate-300 border border-slate-300 hover:bg-slate-50" size="sm">Régénérer</Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                 <div className="flex items-start gap-4">
                    <Database className="h-5 w-5 text-slate-400 mt-1" />
                    <div>
                       <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Cache de l'Application</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400">2.4 GB - Dernier vidage il y a 14 jours.</p>
                    </div>
                 </div>
                 <Button className="bg-white text-red-700 border border-red-200 hover:bg-red-50" size="sm">Vider le cache</Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
