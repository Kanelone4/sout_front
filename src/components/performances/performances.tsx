"use client"

import { useState } from "react"
import {
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Calendar,
  BarChart3,
  Target,
  Trophy,
  Star,
  ChevronDown,
  ChevronUp,
  Eye,
  Filter,
} from "lucide-react"

type Commercial = {
  id: string
  nom: string
  email: string
  telephone: string
  dateEmbauche: string
}

type VentePerformance = {
  id: string
  date: Date
  commercial: string
  client: string
  produit: string
  quantite: number
  montant: number

}

type PerformanceCommercial = {
  commercial: string
  nombreVentes: number
  chiffreAffaires: number
  produitsVendus: number
  clientsUniques: number
  moyenneVente: number
  objectifAtteint: number
}

export const Performances = () => {
  const [periode, setPeriode] = useState<"jour" | "semaine" | "mois">("jour")
  const [commerciaux] = useState<Commercial[]>([
    {
      id: "1",
      nom: "Marie Kouassi",
      email: "marie.kouassi@celtiis.com",
      telephone: "+225 07 12 34 56 78",
      dateEmbauche: "2023-01-15",
    },
    {
      id: "2",
      nom: "Jean Baptiste",
      email: "jean.baptiste@celtiis.com",
      telephone: "+225 05 98 76 54 32",
      dateEmbauche: "2023-03-20",
    },
    {
      id: "3",
      nom: "Fatou Traoré",
      email: "fatou.traore@celtiis.com",
      telephone: "+225 01 23 45 67 89",
      dateEmbauche: "2022-11-10",
    },
    {
      id: "4",
      nom: "Koffi Yao",
      email: "koffi.yao@celtiis.com",
      telephone: "+225 09 87 65 43 21",
      dateEmbauche: "2023-06-01",
    },
  ])

  const [ventes] = useState<VentePerformance[]>([
    {
      id: "1",
      date: new Date(2024, 0, 15, 10, 30),
      commercial: "Marie Kouassi",
      client: "Entreprise ABC",
      produit: "Pocket WiFi 4G",
      quantite: 5,
      montant: 449500,
    },
    {
      id: "2",
      date: new Date(2024, 0, 15, 14, 20),
      commercial: "Jean Baptiste",
      client: "SARL Tech Solutions",
      produit: "Kit Fibre Optique",
      quantite: 2,
      montant: 119800,
    },
    {
      id: "3",
      date: new Date(2024, 0, 15, 16, 45),
      commercial: "Marie Kouassi",
      client: "Restaurant Le Palmier",
      produit: "Forfait Mobile",
      quantite: 10,
      montant: 150000,
    },
    {
      id: "4",
      date: new Date(2024, 0, 14, 9, 15),
      commercial: "Fatou Traoré",
      client: "Boutique Mode",
      produit: "Carte SIM",
      quantite: 50,
      montant: 125000,
    },
    {
      id: "5",
      date: new Date(2024, 0, 14, 11, 30),
      commercial: "Koffi Yao",
      client: "Hôtel Ivoire",
      produit: "Abonnement Fibre",
      quantite: 3,
      montant: 45000,
    },
    {
      id: "6",
      date: new Date(2024, 0, 13, 15, 20),
      commercial: "Marie Kouassi",
      client: "Pharmacie Centrale",
      produit: "Pocket WiFi 4G",
      quantite: 3,
      montant: 269700,
    },
  ])

  const [expandedCommercial, setExpandedCommercial] = useState<string | null>(null)

  // Calculer les performances par commercial
  const calculerPerformances = (): PerformanceCommercial[] => {
    const now = new Date()
    let dateDebut: Date

    switch (periode) {
  case "jour":
    dateDebut = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    break;

  case "semaine": {
    const jourSemaine = now.getDay();
    dateDebut = new Date(now.getTime() - jourSemaine * 24 * 60 * 60 * 1000);
    dateDebut.setHours(0, 0, 0, 0);
    break;
  }

  case "mois":
    dateDebut = new Date(now.getFullYear(), now.getMonth(), 1);
    break;
}


    const ventesFiltered = ventes.filter((vente) => vente.date >= dateDebut)

    const performancesMap = new Map<string, PerformanceCommercial>()

    commerciaux.forEach((commercial) => {
      const ventesCommercial = ventesFiltered.filter((v) => v.commercial === commercial.nom)
      const clientsUniques = new Set(ventesCommercial.map((v) => v.client)).size
      const chiffreAffaires = ventesCommercial.reduce((sum, v) => sum + v.montant, 0)
      const nombreVentes = ventesCommercial.length
      const produitsVendus = ventesCommercial.reduce((sum, v) => sum + v.quantite, 0)

      // Objectifs fictifs pour la démonstration
      const objectifs = {
        jour: 200000,
        semaine: 1000000,
        mois: 4000000,
      }

      performancesMap.set(commercial.nom, {
        commercial: commercial.nom,
        nombreVentes,
        chiffreAffaires,
        produitsVendus,
        clientsUniques,
        moyenneVente: nombreVentes > 0 ? chiffreAffaires / nombreVentes : 0,
        objectifAtteint: (chiffreAffaires / objectifs[periode]) * 100,
      })
    })

    return Array.from(performancesMap.values()).sort((a, b) => b.chiffreAffaires - a.chiffreAffaires)
  }

  const performances = calculerPerformances()
  const totalCA = performances.reduce((sum, p) => sum + p.chiffreAffaires, 0)
  const totalVentes = performances.reduce((sum, p) => sum + p.nombreVentes, 0)
  const meilleurCommercial = performances[0]

  const getPeriodeLabel = () => {
    switch (periode) {
      case "jour":
        return "aujourd'hui"
      case "semaine":
        return "cette semaine"
      case "mois":
        return "ce mois"
    }
  }

  const getPerformanceColor = (objectifAtteint: number) => {
    if (objectifAtteint >= 100) return "text-green-600"
    if (objectifAtteint >= 75) return "text-blue-600"
    if (objectifAtteint >= 50) return "text-orange-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (objectifAtteint: number) => {
    if (objectifAtteint >= 100) return { text: "Excellent", color: "bg-green-100 text-green-800" }
    if (objectifAtteint >= 75) return { text: "Très bien", color: "bg-blue-100 text-blue-800" }
    if (objectifAtteint >= 50) return { text: "Bien", color: "bg-orange-100 text-orange-800" }
    return { text: "À améliorer", color: "bg-red-100 text-red-800" }
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
                Performance Commerciale
              </h1>
              <p className="text-gray-600 mt-2">Tableau de bord des performances de l'équipe commerciale</p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                aria-label="Sélectionner la période"
                value={periode}
                onChange={(e) => setPeriode(e.target.value as "jour" | "semaine" | "mois")}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="jour">Aujourd'hui</option>
                <option value="semaine">Cette semaine</option>
                <option value="mois">Ce mois</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Statistiques globales */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CA Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalCA.toLocaleString()}</p>
                <p className="text-xs text-gray-500">FCFA {getPeriodeLabel()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ventes</p>
                <p className="text-2xl font-bold text-gray-900">{totalVentes}</p>
                <p className="text-xs text-gray-500">Transactions {getPeriodeLabel()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meilleur Commercial</p>
                <p className="text-lg font-bold text-gray-900">{meilleurCommercial?.commercial || "N/A"}</p>
                <p className="text-xs text-gray-500">{meilleurCommercial?.chiffreAffaires.toLocaleString()} FCFA</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Équipe Active</p>
                <p className="text-2xl font-bold text-gray-900">{commerciaux.length}</p>
                <p className="text-xs text-gray-500">Commerciaux</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Classement des commerciaux */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Classement des Commerciaux - {getPeriodeLabel()}
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {performances.map((perf, index) => {
                const badge = getPerformanceBadge(perf.objectifAtteint)
                const commercial = commerciaux.find((c) => c.nom === perf.commercial)

                return (
                  <div
                    key={perf.commercial}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                  ? "bg-gray-400"
                                  : index === 2
                                    ? "bg-orange-500"
                                    : "bg-blue-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                          {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">{perf.commercial}</h3>
                          <p className="text-sm text-gray-600">{commercial?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {perf.chiffreAffaires.toLocaleString()} FCFA
                          </p>
                          <p className="text-sm text-gray-600">{perf.nombreVentes} ventes</p>
                        </div>

                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                            {badge.text}
                          </span>
                          <p className={`text-sm font-medium ${getPerformanceColor(perf.objectifAtteint)}`}>
                            {perf.objectifAtteint.toFixed(1)}% objectif
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            setExpandedCommercial(expandedCommercial === perf.commercial ? null : perf.commercial)
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {expandedCommercial === perf.commercial ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Détails étendus */}
                    {expandedCommercial === perf.commercial && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{perf.produitsVendus}</p>
                            <p className="text-sm text-gray-600">Produits vendus</p>
                          </div>

                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{perf.clientsUniques}</p>
                            <p className="text-sm text-gray-600">Clients uniques</p>
                          </div>

                          <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <BarChart3 className="h-6 w-6 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{perf.moyenneVente.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Moyenne/vente</p>
                          </div>

                          <div className="text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <Calendar className="h-6 w-6 text-orange-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                              {commercial ? new Date(commercial.dateEmbauche).getFullYear() : "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">Année d'embauche</p>
                          </div>
                        </div>

                        {/* Ventes récentes */}
                        <div className="mt-6">
                          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-600" />
                            Ventes récentes
                          </h4>
                          <div className="space-y-2">
                            {ventes
                              .filter((v) => v.commercial === perf.commercial)
                              .slice(0, 3)
                              .map((vente) => (
                                <div
                                  key={vente.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{vente.client}</p>
                                    <p className="text-xs text-gray-600">
                                      {vente.produit} × {vente.quantite}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">
                                      {vente.montant.toLocaleString()} FCFA
                                    </p>
                                    <p className="text-xs text-gray-500">{vente.date.toLocaleDateString("fr-FR")}</p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Objectifs et tendances */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Progression des Objectifs
            </h3>
            <div className="space-y-4">
              {performances.slice(0, 3).map((perf) => (
                <div key={perf.commercial}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{perf.commercial}</span>
                    <span className="text-sm text-gray-600">{perf.objectifAtteint.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        perf.objectifAtteint >= 100
                          ? "bg-green-500"
                          : perf.objectifAtteint >= 75
                            ? "bg-blue-500"
                            : perf.objectifAtteint >= 50
                              ? "bg-orange-500"
                              : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(perf.objectifAtteint, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              Top Performances
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-gray-900">Meilleur CA</span>
                </div>
                <span className="text-sm font-bold text-yellow-700">{meilleurCommercial?.commercial}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Plus de ventes</span>
                </div>
                <span className="text-sm font-bold text-blue-700">
                  {performances.sort((a, b) => b.nombreVentes - a.nombreVentes)[0]?.commercial}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Plus de clients</span>
                </div>
                <span className="text-sm font-bold text-green-700">
                  {performances.sort((a, b) => b.clientsUniques - a.clientsUniques)[0]?.commercial}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
