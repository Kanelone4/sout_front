const PerformanceChart = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance Mensuelle</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">CA</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Leads</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Conversions</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end justify-center">
        <div className="text-gray-500 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm">Graphique de performance</p>
          <p className="text-xs text-gray-400">Les données seront affichées ici</p>
        </div>
      </div>
    </div>
  )
}

import { TrendingUp } from "lucide-react"

export default PerformanceChart
