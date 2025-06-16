import StatsCard from "./statCard"
import PerformanceChart from "./performanceChart"
import SalesByTeamChart from "./salesByTeamChart"
import TopPerformers from "./topPerformance"
import PipelineTable from "./pipelineTable"
import { Download, Calendar } from "lucide-react"
import React from "react"



const Dashboard = () => {

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="mb-2 sm:mb-0">
          <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
          <p className="text-gray-600">Performances commerciales et suivi des objectifs</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Ce mois</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none">
            <Download className="w-4 h-4 mr-2" />
            <span>Télécharger</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard title="Chiffre d'affaires" value="1,245,800 FCFA" change="12.5%" isPositive icon="euro" />
        <StatsCard title="Nouveaux Clients" value="245" change="8.2%" isPositive icon="users" />
        <StatsCard title="Taux de Conversion" value="27.5%" change="2.1%" isPositive={false} icon="chart" />
        <StatsCard title="Opportunités" value="328" change="5.3%" isPositive icon="handshake" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PerformanceChart />
        <SalesByTeamChart />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TopPerformers />
        </div>
        <div className="lg:col-span-2">
          <PipelineTable />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
