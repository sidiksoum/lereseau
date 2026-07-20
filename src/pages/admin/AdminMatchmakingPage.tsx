import { Sparkles, Brain, CheckCircle, ArrowRightLeft, Users, Zap } from "lucide-react"

export function AdminMatchmakingPage() {
  const latestMatches = [
    { id: 1, student: "Marc T. (Master 2 Data Science)", pro: "Aminata Diallo (Senior Data Scientist)", date: "Il y a 5 min", score: "98%", topic: "Accompagnement Thèse" },
    { id: 2, student: "Fatou S. (L3 Droit)", pro: "Me. Koné (Avocat Associé)", date: "Il y a 1h", score: "95%", topic: "Mentorat de Carrière" },
    { id: 3, student: "Paul A. (Ingénierie Civile)", pro: "Entreprise SOTRA (Direction Technique)", date: "Il y a 2h", score: "90%", topic: "Stage Fin d'études" },
  ]

  const activeAlerts = [
    { id: 1, keyword: "Bourses d'excellence France", premiumUsersTargeted: 145 },
    { id: 2, keyword: "Mentorat Web3/Blockchain", premiumUsersTargeted: 56 },
    { id: 3, keyword: "Stage Cabinet d'Audit", premiumUsersTargeted: 234 },
  ]

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-indigo-600" /> LeRéseau-Match (IA)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Moteur d'association autonome et d'alertes Intelligentes Premium.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-lg border border-slate-200">
           <span className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-md">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             IA ACTIVE ET EN LIGNE
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* KPI Matchmaking */}
         <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Sparkles className="w-24 h-24 text-white" />
            </div>
            <div className="relative z-10">
               <span className="bg-white/20 text-indigo-50 text-xs font-bold px-2 py-1 rounded">MATCHES RÉALISÉS (7j)</span>
               <div className="text-4xl font-extrabold text-white mt-4 mb-1">1,492</div>
               <p className="text-indigo-200 text-sm">Connexions Pro &lt;-&gt; Étudiants</p>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Abonnés Premium (Alertes)</span>
               <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Zap className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">4.5k</div>
            <p className="text-emerald-600 text-sm font-semibold flex items-center gap-1">+345 nouveaux</p>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mentors Disponibles</span>
               <div className="p-2 bg-slate-100 text-slate-600 dark:text-slate-400 rounded-lg"><Users className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">820</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Capacité totale: 2400 places</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Matchs en direct algorithme */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
               <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><ArrowRightLeft className="w-5 h-5 text-indigo-500" /> Liaisons Autonomes (Temps Réel)</h2>
            </div>
            <div className="flex-1 p-5 space-y-4">
               {latestMatches.map(match => (
                  <div key={match.id} className="p-4 rounded-xl border border-indigo-50 bg-indigo-50/30 flex items-center justify-between">
                     <div className="flex-1">
                        <div className="flex gap-2 items-center text-xs font-bold text-indigo-600 mb-2">
                           SCORE DE COMPATIBILITÉ : {match.score}
                        </div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{match.student}</p>
                        <p className="text-xs text-slate-400 my-1">est désormais lié(e) à</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{match.pro}</p>
                     </div>
                     <div className="flex flex-col items-end gap-2 text-right">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                           <CheckCircle className="w-3 h-3" /> MATCH IA
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{match.date}</span>
                     </div>
                  </div>
               ))}
               <button className="w-full text-center text-sm font-semibold text-indigo-600 py-2 hover:bg-slate-50 rounded-lg transition-colors">
                  Voir tout l'historique de l'IA
               </button>
            </div>
         </div>

         {/* Alertes Actives pour les Etudiants Premium */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
               <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> File d'Alertes PUSH (Étudiants Premium)</h2>
            </div>
            <p className="px-5 pt-4 text-xs text-slate-500 dark:text-slate-400">
               L'algorithme analyse ces mots-clés et achemine les opportunités correspondantes vers les smartphones des utilisateurs Premium.
            </p>
            <div className="flex-1 p-5 space-y-3">
               {activeAlerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border-l-4 border-amber-400 bg-slate-50 rounded-r-lg">
                     <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Cible/Mot-clé : "{alert.keyword}"</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Notifications Push en attente d'envoi</p>
                     </div>
                     <div className="text-right">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{alert.premiumUsersTargeted}</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Étudiants visés</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}
