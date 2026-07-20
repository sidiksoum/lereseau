import { useState } from 'react'
import {
  MessageSquarePlus,
  Award,
  BookOpen,
} from 'lucide-react'
import { Toast } from '../../components/ui/Toast'
import { AdminCMSFeedTab } from './cms/AdminCMSFeedTab'
import { AdminCMSScholarshipTab } from './cms/AdminCMSScholarshipTab'
import { AdminCMSLibraryTab } from './cms/AdminCMSLibraryTab'

export function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'scholarship' | 'library'>('feed')

  // Toast state
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Outils de Publication</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ajoutez du contenu officiel pour la communauté.</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${activeTab === 'feed' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-500' : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
        >
          <MessageSquarePlus className={`h-8 w-8 mb-2 ${activeTab === 'feed' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
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
          className={`flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${activeTab === 'library' ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-500' : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
            }`}
        >
          <BookOpen className={`h-8 w-8 mb-2 ${activeTab === 'library' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
          <span className={`font-bold ${activeTab === 'library' ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>Bibliothèque</span>
        </button>
      </div>

      {/* Tabs Content */}
      <div className="mt-8">
        {activeTab === 'feed' && <AdminCMSFeedTab showToast={showToast} />}
        {activeTab === 'scholarship' && <AdminCMSScholarshipTab showToast={showToast} />}
        {activeTab === 'library' && <AdminCMSLibraryTab showToast={showToast} />}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          isVisible={true}
        />
      )}
    </div>
  )
}
