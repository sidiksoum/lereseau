import { useState, useEffect } from "react"
import { Users, AlertOctagon, Activity, DollarSign, Loader } from "lucide-react"
import { getAdminDashboardStats, type AdminDashboardStats } from "../../services/admin"

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminDashboardStats()
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching stats:", err)
        setLoading(false)
      })
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  const kpis = [
    { title: "Utilisateurs Actifs (MAU)", value: stats.kpis.mau, trend: "Actifs (30j)", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Revenu (Premium)", value: stats.kpis.revenue, trend: "Total", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Taux d'Engagement", value: stats.kpis.engagementRate, trend: "Moyenne", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-100" },
    { title: "Alertes Critiques", value: stats.kpis.criticalAlerts, trend: "Signalements", icon: AlertOctagon, color: "text-red-600", bg: "bg-red-100" },
  ]

  const weeklyData = stats.weeklyData
  // Calcule dynamiquement le max pour l'échelle du graphe
  const maxValue = Math.max(10, ...weeklyData.map(d => Math.max(d.newUsers, d.activeUsers))) * 1.2

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics & Vue d'ensemble</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Performances du réseau social sur les 7 derniers jours.</p>
        </div>
        <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium outline-none">
          <option>7 derniers jours</option>
          <option>30 derniers jours</option>
          <option>Cette année</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${kpi.bg}`}>
              <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{kpi.title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{kpi.value}</h3>
                <span className={`text-xs font-bold ${kpi.trend.includes('-') ? (kpi.title === 'Alertes Critiques' ? 'text-emerald-500' : 'text-red-500') : 'text-emerald-500'}`}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Croissance des Utilisateurs</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex justify-center gap-1 items-end h-[200px] relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-12 bg-slate-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity z-10 pointer-events-none">
                    Nouveaux: {data.newUsers} <br />
                    Actifs: {data.activeUsers}
                  </div>
                  {/* Bar for new users */}
                  <div 
                    className="w-1/2 bg-blue-400 rounded-t-sm transition-all duration-500 group-hover:bg-blue-500" 
                    style={{ height: `${(data.newUsers / maxValue) * 100}%` }}
                  ></div>
                  {/* Bar for active users */}
                  <div 
                    className="w-1/2 bg-indigo-600 rounded-t-sm transition-all duration-500 group-hover:bg-indigo-700" 
                    style={{ height: `${(data.activeUsers / maxValue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-6">
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400"></div><span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Nouveaux inscrits</span></div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-600"></div><span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Utilisateurs actifs</span></div>
          </div>
        </div>

        {/* System Health / Top Tags */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Tendances Forum</h2>
          <div className="flex-1 flex flex-col gap-4">
             {stats.forumTrends.map((trend, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-xs">{(i+1)}</div>
                      <span className="font-semibold text-indigo-600">{trend.tag}</span>
                   </div>
                   <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{trend.count} posts</span>
                </div>
             ))}
          </div>
          <button className="mt-4 w-full py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors">
            Voir Analyse Détaillée
          </button>
        </div>
      </div>
    </div>
  )
}
