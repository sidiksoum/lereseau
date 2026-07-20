import { X, AlertTriangle, CheckCircle, Trash2 } from "lucide-react"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'success'
  loading?: boolean
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = 'danger',
  loading = false
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="h-6 w-6 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      default:
        return <AlertTriangle className="h-6 w-6 text-red-600" />
    }
  }

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      case 'warning':
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
      case 'success':
        return "bg-green-600 hover:bg-green-700 focus:ring-green-500"
      default:
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500"
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${getButtonStyles()}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Chargement...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
