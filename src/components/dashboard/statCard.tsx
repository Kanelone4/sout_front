import { Euro, Users, TrendingUp, Handshake, ArrowUp, ArrowDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: "euro" | "users" | "chart" | "handshake"
}

const iconMap = {
  euro: Euro,
  users: Users,
  chart: TrendingUp,
  handshake: Handshake,
}

const colorMap = {
  euro: "bg-blue-100 text-blue-600",
  users: "bg-blue-100 text-blue-600",
  chart: "bg-purple-100 text-purple-600",
  handshake: "bg-yellow-100 text-yellow-600",
}

const StatsCard = ({ title, value, change, isPositive, icon }: StatsCardProps) => {
  const IconComponent = iconMap[icon]
  const iconColor = colorMap[icon]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColor}`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center">
          {isPositive ? (
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>{change}</span>
          <span className="text-sm text-gray-500 ml-1">vs mois précédent</span>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
