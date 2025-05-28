import type React from "react"
import {
  Zap,
  BarChart3,
  Users,
  Briefcase,
  TrendingUp,
  Calendar,
  Target,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react"

const Sidebar = () => {
  return (
    <div className="flex w-72 flex-shrink-0 flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">DigiSales</span>
        </div>
        <button title="Close" className="text-gray-400 hover:text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          <SidebarLink icon={<BarChart3 className="w-5 h-5" />} active>
            Tableau de bord
          </SidebarLink>
          <SidebarLink icon={<Users className="w-5 h-5" />}>Commerciaux</SidebarLink>
          <SidebarLink icon={<Briefcase className="w-5 h-5" />}>Opportunités</SidebarLink>
          <SidebarLink icon={<TrendingUp className="w-5 h-5" />}>Performance</SidebarLink>
          <SidebarLink icon={<Calendar className="w-5 h-5" />}>Activités</SidebarLink>
          <SidebarLink icon={<Target className="w-5 h-5" />}>Objectifs</SidebarLink>
          <SidebarLink icon={<FileText className="w-5 h-5" />}>Rapports</SidebarLink>
          <SidebarLink icon={<Settings className="w-5 h-5" />}>Paramètres</SidebarLink>
        </nav>
      </div>

      {/* User Profile */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Thomas Martin"
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">Thomas Martin</p>
            <p className="text-xs text-gray-500">Directeur Commercial</p>
          </div>
          <button title="Deconnexion" className="text-gray-400 hover:text-gray-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

const SidebarLink = ({
  icon,
  children,
  active = false,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
}) => (
  <a
    href="#"
    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <span className={`mr-3 ${active ? "text-blue-600" : "text-gray-400"}`}>{icon}</span>
    <span>{children}</span>
  </a>
)

export default Sidebar
