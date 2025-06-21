"use client"

import type React from "react"

import { useState } from "react"
import { TrendingUp, Users, DollarSign,  Award, Download, Calendar, MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Layout from "../components/layout/layout"

type MetricCard = {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ReactNode
  color: string
}

type ChartDataPoint = {
  month: string
  ca: number
  leads: number
  conversions: number
}

type TeamData = {
  name: string
  value: number
  color: string
  percentage: number
}

export const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Ce mois")

  // Données des métriques principales
  const metrics: MetricCard[] = [
    {
      title: "Chiffre d'affaires",
      value: "1,245,800 FCFA",
      change: 12.5,
      changeLabel: "vs mois précédent",
      icon: <DollarSign className="h-6 w-6" />,
      color: "blue",
    },
    {
      title: "Nouveaux Clients",
      value: "245",
      change: 8.2,
      changeLabel: "vs mois précédent",
      icon: <Users className="h-6 w-6" />,
      color: "blue",
    },
    {
      title: "Taux de Conversion",
      value: "27.5%",
      change: -2.1,
      changeLabel: "vs mois précédent",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "purple",
    },
    {
      title: "Ventes Mensuelles",
      value: "156",
      change: 5.3,
      changeLabel: "vs mois précédent",
      icon: <Award className="h-6 w-6" />,
      color: "yellow",
    },
  ]

  // Données pour le graphique de performance mensuelle
  const chartData: ChartDataPoint[] = [
    { month: "Jan", ca: 800, leads: 120, conversions: 45 },
    { month: "Fév", ca: 900, leads: 140, conversions: 52 },
    { month: "Mar", ca: 950, leads: 160, conversions: 58 },
    { month: "Avr", ca: 980, leads: 180, conversions: 62 },
    { month: "Mai", ca: 1000, leads: 200, conversions: 68 },
    { month: "Juin", ca: 1050, leads: 220, conversions: 72 },
    { month: "Juil", ca: 1100, leads: 240, conversions: 78 },
    { month: "Août", ca: 1150, leads: 260, conversions: 82 },
    { month: "Sep", ca: 1200, leads: 280, conversions: 88 },
    { month: "Oct", ca: 1220, leads: 300, conversions: 92 },
    { month: "Nov", ca: 1250, leads: 320, conversions: 95 },
    { month: "Déc", ca: 1300, leads: 340, conversions: 98 },
  ]

  // Données pour le graphique en donut des équipes
  const teamData: TeamData[] = [
    { name: "POS Agla", value: 35, color: "#3B82F6", percentage: 35 },
    { name: "POS Gbégamey", value: 25, color: "#10B981", percentage: 25 },
    { name: "POS Mènontin", value: 20, color: "#F59E0B", percentage: 20 },
    { name: "POS Zogbo", value: 12, color: "#8B5CF6", percentage: 12 },
    { name: "POS Jonchet", value: 8, color: "#EF4444", percentage: 8 },
  ]

  const getMetricIconBg = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100"
      case "purple":
        return "bg-purple-100"
      case "yellow":
        return "bg-yellow-100"
      default:
        return "bg-gray-100"
    }
  }

  const getMetricIconColor = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-600"
      case "purple":
        return "text-purple-600"
      case "yellow":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }
  return (
    <Layout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2"></p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <select
                name="period-select"
                  id="period-select"
                  aria-label="Sélectionner la période"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="Ce mois">Ce mois</option>
                  <option value="Cette semaine">Cette semaine</option>
                  <option value="Cette année">Cette année</option>
                </select>
              </div>

              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                <Download className="h-4 w-4" />
                Télécharger
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Métriques principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${getMetricIconBg(metric.color)} flex items-center justify-center`}
                    >
                      <span className={getMetricIconColor(metric.color)}>{metric.icon}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-gray-600 mb-2">{metric.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-3">{metric.value}</p>

                  <div className="flex items-center gap-2">
                    {metric.change > 0 ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="text-sm font-medium">+{metric.change}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <ArrowDownRight className="h-4 w-4" />
                        <span className="text-sm font-medium">{metric.change}%</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-500">{metric.changeLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Performance Mensuelle */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Mensuelle</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">CA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-sm text-gray-600">Leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-sm text-gray-600">Conversions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphique linéaire amélioré */}
            <div className="relative h-80">
              <svg className="w-full h-full" viewBox="0 0 800 300">
                {/* Grille de fond */}
                <defs>
                  <pattern id="grid" width="80" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 80 0 L 0 0 0 50" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Lignes horizontales principales */}
                {[0, 50, 100, 150, 200, 250].map((y, index) => (
                  <line key={index} x1="60" y1={y + 25} x2="740" y2={y + 25} stroke="#e5e7eb" strokeWidth="1" />
                ))}

                {/* Axe Y - Labels */}
                {["1400k", "1200k", "1000k", "800k", "600k", "400k", "200k", "0"].map((label, index) => (
                  <text
                    key={index}
                    x="50"
                    y={30 + index * 35}
                    textAnchor="end"
                    className="text-xs fill-gray-400"
                    dominantBaseline="middle"
                  >
                    {label}
                  </text>
                ))}

                {/* Courbe principale CA */}
                <path
                  d="M 80,220 L 140,200 L 200,185 L 260,175 L 320,170 L 380,160 L 440,150 L 500,140 L 560,125 L 620,115 L 680,105 L 740,95"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points sur la courbe */}
                {[
                  { x: 80, y: 220 },
                  { x: 140, y: 200 },
                  { x: 200, y: 185 },
                  { x: 260, y: 175 },
                  { x: 320, y: 170 },
                  { x: 380, y: 160 },
                  { x: 440, y: 150 },
                  { x: 500, y: 140 },
                  { x: 560, y: 125 },
                  { x: 620, y: 115 },
                  { x: 680, y: 105 },
                  { x: 740, y: 95 },
                ].map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#3B82F6"
                    stroke="white"
                    strokeWidth="2"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                ))}

                {/* Courbe Leads (grise) */}
                <path
                  d="M 80,240 L 140,230 L 200,220 L 260,210 L 320,200 L 380,190 L 440,180 L 500,170 L 560,160 L 620,150 L 680,140 L 740,130"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="5,5"
                />

                {/* Courbe Conversions (gris clair) */}
                <path
                  d="M 80,250 L 140,245 L 200,240 L 260,235 L 320,230 L 380,225 L 440,220 L 500,215 L 560,210 L 620,205 L 680,200 L 740,195"
                  fill="none"
                  stroke="#D1D5DB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="3,3"
                />

                {/* Labels des mois */}
                {chartData.map((point, index) => (
                  <text key={index} x={80 + index * 60} y="290" textAnchor="middle" className="text-xs fill-gray-500">
                    {point.month}
                  </text>
                ))}
              </svg>

              {/* Tooltip au survol */}
              <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="text-xs text-gray-600">Décembre 2024</div>
                <div className="text-sm font-semibold text-blue-600">1,300k FCFA</div>
              </div>
            </div>
          </div>

          {/* Ventes par Équipe */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Ventes par POS</h3>
              <button title="Voir plus" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="flex items-center justify-center">
              {/* Graphique en donut simplifié */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {teamData.map((team, index) => {
                    const radius = 35
                    const circumference = 2 * Math.PI * radius
                    const strokeDasharray = `${(team.percentage / 100) * circumference} ${circumference}`
                    const strokeDashoffset = teamData
                      .slice(0, index)
                      .reduce((acc, t) => acc - (t.percentage / 100) * circumference, 0)

                    return (
                      <circle
                        key={index}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={team.color}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300"
                      />
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* Légende */}
            <div className="mt-6 space-y-3">
              {teamData.map((team, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }}></div>
                    <span className="text-sm text-gray-700">{team.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{team.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {[
                {
                  action: "Nouvelle vente enregistrée",
                  details: "Marie Kouassi - Pocket WiFi 4G × 3",
                  amount: "269,700 FCFA",
                  time: "Il y a 2 heures",
                  icon: <Award className="h-5 w-5 text-green-600" />,
                },
                {
                  action: "Nouveau client ajouté",
                  details: "Entreprise TechSolutions",
                  amount: "Lead qualifié",
                  time: "Il y a 6 heures",
                  icon: <Users className="h-5 w-5 text-purple-600" />,
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{activity.amount}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default Dashboard