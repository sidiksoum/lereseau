import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, FileText, CheckCircle2, CreditCard, Smartphone } from 'lucide-react'

export function DocumentCheckoutPage() {
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('orange')
  
  // Simulation de données du document (normalement récupéré via l'ID dans l'URL)
  const document = {
    id: 2,
    title: "Thèse : IA en Imagerie Médicale",
    author: "Dr. Jean Dupont",
    price: "15,00 €",
    priceXOF: "9 850 FCFA",
    size: "12.8 MB",
    img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=300&auto=format&fit=crop"
  }

  const paymentOptions = [
    { id: 'orange', name: 'Orange Money', color: 'bg-orange-500', icon: Smartphone, type: 'Mobile' },
    { id: 'mtn', name: 'MTN Mobile Money', color: 'bg-yellow-400', icon: Smartphone, type: 'Mobile' },
    { id: 'moov', name: 'Moov Money', color: 'bg-blue-600', icon: Smartphone, type: 'Mobile' },
    { id: 'wave', name: 'Wave', color: 'bg-cyan-400', icon: Smartphone, type: 'Mobile' },
    { id: 'card', name: 'Carte Bancaire', color: 'bg-slate-800', icon: CreditCard, type: 'Carte' },
  ]

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulation de validation de paiement
    alert(`Redirection vers l'API de paiement ${paymentMethod.toUpperCase()} en cours...`)
    navigate('/library') // Redirection après achat pour l'exemple
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      {/* Header back button */}
      <div className="mb-6">
        <Link to="/library" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour à la bibliothèque
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne gauche : Formulaire de paiement */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Finaliser l'achat</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Choisissez votre méthode de paiement pour débloquer ce document instantanément.</p>

            <form onSubmit={handlePayment}>
              {/* Sélection du moyen de paiement */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Moyens de Paiement</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {paymentOptions.map((option) => {
                    const isSelected = paymentMethod === option.id;
                    return (
                      <div 
                        key={option.id}
                        onClick={() => setPaymentMethod(option.id)}
                        className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                          isSelected ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white shadow-sm ${option.color}`}>
                          <option.icon className="h-5 w-5" />
                        </div>
                        <span className={`text-xs font-bold text-center ${isSelected ? 'text-blue-700' : 'text-slate-600 dark:text-slate-400'}`}>{option.name}</span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 text-blue-600">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Formulaire dynamique selon la méthode */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-8">
                {paymentMethod !== 'card' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Numéro de téléphone ({paymentOptions.find(p => p.id === paymentMethod)?.name})</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400 text-sm font-medium">+225</span>
                        <input 
                          type="text" 
                          placeholder="01 23 45 67 89" 
                          className="w-full bg-white border border-slate-300 rounded-lg pl-12 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none font-medium" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Numéro de carte</label>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000" 
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date d'expiration</label>
                        <input 
                          type="text" 
                          placeholder="MM/AA" 
                          className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CVC</label>
                        <input 
                          type="text" 
                          placeholder="123" 
                          maxLength={3}
                          className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sécurité info */}
              <div className="flex items-start gap-3 bg-green-50/50 p-4 rounded-lg border border-green-100 mb-8 text-sm text-green-700 font-medium">
                <ShieldCheck className="h-5 w-5 shrink-0 text-green-500" />
                <p>Paiement 100% sécurisé et crypté. Les fonds seront transférés directement à l'auteur après déduction des frais de transaction.</p>
              </div>

              {/* Submit button */}
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2"
              >
                Payer {document.priceXOF} MAINTENANT
              </button>
            </form>
          </div>
        </div>

        {/* Colonne droite : Résumé de commande */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden sticky top-24">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 dark:text-white">Résumé de la commande</h3>
            </div>
            
            <div className="p-5 border-b border-slate-100">
              <div className="flex gap-4">
                <div className="h-20 w-16 shrink-0 rounded bg-slate-100 border border-slate-200 overflow-hidden relative">
                  <img src={document.img} alt="Cover" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 border border-black/10 rounded"></div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">Document PDF</p>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 leading-tight">{document.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Par {document.author}</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3 border-b border-slate-100 hidden sm:block">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Format</span>
                <span className="font-medium flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> PDF ({document.size})</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Licence</span>
                <span className="font-medium">Usage personnel</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Droits d'auteur</span>
                <span className="font-medium text-green-600">Inclus</span>
              </div>
            </div>

            <div className="p-5 bg-slate-50">
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                <span>Sous-total</span>
                <span>{document.price}</span>
              </div>
              <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-200">
                <span className="font-bold text-slate-900 dark:text-white">Total à payer</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{document.priceXOF}</span>
                  <p className="text-xs text-slate-400 mt-1">Taxes incluses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
