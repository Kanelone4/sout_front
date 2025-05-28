import { ArrowUp } from "lucide-react"

const PipelineTable = () => {
  const pipelineData = [
    {
      stage: "Qualification",
      deals: 128,
      value: "1,850,000 FCFA",
      conversion: "35%",
      evolution: "+12%",
      color: "bg-blue-500",
    },
    {
      stage: "Proposition",
      deals: 95,
      value: "1,280,000 FCFA",
      conversion: "42%",
      evolution: "+12%",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Pipeline de Ventes</h3>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md">Mois</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">Trimestre</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">Année</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ÉTAPE</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">DEALS</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">VALEUR</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                CONVERSION
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                ÉVOLUTION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pipelineData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-900">{item.stage}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">{item.deals}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{item.value}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{item.conversion}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">{item.evolution}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PipelineTable
