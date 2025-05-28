import { MoreHorizontal } from "lucide-react"

const SalesByTeamChart = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Ventes par Équipe</h3>
        <button title="Options" className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="h-64 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
          <p className="text-sm">Graphique des ventes par équipe</p>
          <p className="text-xs text-gray-400">Les données seront affichées ici</p>
        </div>
      </div>
    </div>
  )
}

export default SalesByTeamChart
