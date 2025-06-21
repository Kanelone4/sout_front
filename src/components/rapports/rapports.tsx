"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  User,
  DollarSign,
  Target,
  Search,
  FileText,
  TrendingUp,
  Award,
  Eye,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react"

type Rapport = {
  id: string
  dateCreation: Date
  dateRapport: string
  commercial: string
  produitsVendus: string
  chiffreAffaires: string
  observations: string
  objectifsAtteints: string
}

// Déclaration de la fonction en dehors du composant pour pouvoir l'exporter
export const ajouterRapport = (nouveauRapport: Omit<Rapport, "id" | "dateCreation">) => {
  const rapportComplete: Rapport = {
    ...nouveauRapport,
    id: crypto.randomUUID(),
    dateCreation: new Date(),
  }

  const savedRapports = localStorage.getItem("historiqueRapports")
  const existingRapports = savedRapports ? JSON.parse(savedRapports) : []

  const nouveauxRapports = [rapportComplete, ...existingRapports]
  localStorage.setItem("historiqueRapports", JSON.stringify(nouveauxRapports))

  return rapportComplete
}

export const Rapports = () => {
  const [rapports, setRapports] = useState<Rapport[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRapport, setExpandedRapport] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "ca" | "commercial">("date")

  // Charger les rapports depuis le localStorage au montage
  useEffect(() => {
    const savedRapports = localStorage.getItem("historiqueRapports")
    if (savedRapports) {
      try {
        const parsedRapports = JSON.parse(savedRapports).map((r: { dateCreation: string }) => ({
          ...r,
          dateCreation: new Date(r.dateCreation),
        }))
        setRapports(parsedRapports)
      } catch (error) {
        console.error("Erreur lors du chargement des rapports:", error)
      }
    }
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  // Filtrer et trier les rapports
  const filteredRapports = rapports
    .filter(
      (rapport) =>
        rapport.commercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rapport.produitsVendus.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
        case "ca":
          return Number.parseFloat(b.chiffreAffaires) - Number.parseFloat(a.chiffreAffaires)
        case "commercial":
          return a.commercial.localeCompare(b.commercial)
        default:
          return 0
      }
    })

  const toggleExpand = (id: string) => {
    setExpandedRapport(expandedRapport === id ? null : id)
  }

  const getPerformanceLevel = (ca: string) => {
    const montant = Number.parseFloat(ca)
    if (montant >= 1000000) return "excellent"
    if (montant >= 500000) return "tres-bien"
    if (montant >= 100000) return "bien"
    return "standard"
  }

  const getPerformanceIcon = (ca: string) => {
    const level = getPerformanceLevel(ca)
    switch (level) {
      case "excellent":
        return <Award className="h-5 w-5 text-blue-600" />
      case "tres-bien":
        return <TrendingUp className="h-5 w-5 text-blue-500" />
      case "bien":
        return <Target className="h-5 w-5 text-blue-400" />
      default:
        return <BarChart3 className="h-5 w-5 text-gray-500" />
    }
  }

  const getPerformanceBadge = (ca: string) => {
    const level = getPerformanceLevel(ca)
    switch (level) {
      case "excellent":
        return { text: "Excellent", color: "bg-blue-100 text-blue-800 border-blue-200" }
      case "tres-bien":
        return { text: "Très bien", color: "bg-blue-50 text-blue-700 border-blue-100" }
      case "bien":
        return { text: "Bien", color: "bg-gray-100 text-gray-700 border-gray-200" }
      default:
        return { text: "Standard", color: "bg-gray-50 text-gray-600 border-gray-100" }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                Centre de Rapports
              </h1>
              <p className="text-gray-600 mt-2">Tableau de bord des performances commerciales</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un rapport..."
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                aria-label="Trier les rapports"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "ca" | "commercial")}
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="date">Trier par date</option>
                <option value="ca">Trier par CA</option>
                <option value="commercial">Trier par commercial</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredRapports.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun rapport disponible</h3>
            <p className="text-gray-600">Créez votre premier rapport commercial</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredRapports.map((rapport) => {
              const badge = getPerformanceBadge(rapport.chiffreAffaires)

              return (
                <div
                  key={rapport.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* Header de la carte */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          {getPerformanceIcon(rapport.chiffreAffaires)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{rapport.commercial}</h3>
                          <p className="text-sm text-gray-500">{formatDate(rapport.dateCreation)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
                          {badge.text}
                        </span>
                        <button
                          onClick={() => toggleExpand(rapport.id)}
                          className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          {expandedRapport === rapport.id ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Métriques principales */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                          <span className="text-xs text-gray-600 font-medium">Montant produit</span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {Number.parseFloat(rapport.chiffreAffaires).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">FCFA</div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-xs text-gray-600 font-medium">Période</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{rapport.dateRapport}</div>
                      </div>
                    </div>
                  </div>

                  {/* Contenu étendu */}
                  {expandedRapport === rapport.id && (
                    <div className="p-6 bg-gray-50 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          Produits vendus
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-700 leading-relaxed">{rapport.produitsVendus}</p>
                        </div>
                      </div>

                      {rapport.objectifsAtteints && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-600" />
                            Objectifs atteints
                          </h4>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-700 leading-relaxed">{rapport.objectifsAtteints}</p>
                          </div>
                        </div>
                      )}

                      {rapport.observations && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-600" />
                            Observations
                          </h4>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-700 leading-relaxed">{rapport.observations}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer de la carte */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Rapport #{rapport.id.slice(0, 8)}</span>
                      </div>
                      <button
                        onClick={() => toggleExpand(rapport.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        {expandedRapport === rapport.id ? "Réduire" : "Voir plus"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
