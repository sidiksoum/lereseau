import { useState } from "react"
import { Search, Filter, Users, UserCheck, GraduationCap, Briefcase, Bell, Building2 } from "lucide-react"

import { SuggestionsList } from "../../components/network/SuggestionsList"
import { FriendsList } from "../../components/network/FriendsList"
import { MentorsList } from "../../components/network/MentorsList"
import { RelationsList } from "../../components/network/RelationsList"
import { RequestsList } from "../../components/network/RequestsList"
import { SentRequestsList } from "../../components/network/SentRequestsList"
import { InstitutionsList } from "../../components/network/InstitutionsList"

export function NetworkPage() {
  const [activeTab, setActiveTab] = useState('suggestions')

  const tabs = [
    { id: 'suggestions', label: 'Suggestions', icon: Users },
    { id: 'amis', label: 'Mes Amis', icon: UserCheck },
    { id: 'demandes', label: 'Demandes Reçues', icon: Bell },
    { id: 'envoyees', label: 'Demandes Envoyées', icon: Bell },
    { id: 'mentors', label: 'Mes Mentors', icon: GraduationCap },
    { id: 'relations', label: 'Mes Relations', icon: Briefcase },
    { id: 'institutions', label: 'Institutions', icon: Building2 },
  ]

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'suggestions': return <SuggestionsList />
      case 'amis': return <FriendsList />
      case 'demandes': return <RequestsList />
      case 'envoyees': return <SentRequestsList />
      case 'mentors': return <MentorsList />
      case 'relations': return <RelationsList />
      case 'institutions': return <InstitutionsList />
      default: return <SuggestionsList />
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 sm:p-0 rounded-xl sm:bg-transparent border border-slate-200 dark:border-slate-800 sm:border-transparent w-full">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Réseau</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gérez vos connexions et opportunités.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un membre..." 
              className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-64 lg:w-80"
            />
          </div>
          <button className="flex items-center justify-center p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-colors shrink-0 active:scale-95">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto pb-0 hide-scrollbar border-b border-slate-200">
        <div className="flex gap-2 px-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg' 
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 rounded-t-lg'
              }`}
            >
              <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rendu Dynamique des Composants */}
      <div className="mt-2">
        {renderActiveTab()}
      </div>
    </div>
  )
}
