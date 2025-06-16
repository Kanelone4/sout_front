"use client"

import { useState, useEffect } from "react"
import { Calendar, User, Package, Hash, DollarSign, MessageSquare, Search, Clock } from "lucide-react"

type Vente = {
  id: string
  date: Date
  client: string
  produit: string
  quantite: number
  montant: number
  notes: string
}

// Déclaration de la fonction en dehors du composant pour pouvoir l'exporter
export const ajouterVente = (nouvelleVente: Omit<Vente, "id" | "date">) => {
  const venteComplete: Vente = {
    ...nouvelleVente,
    id: crypto.randomUUID(),
    date: new Date(),
  }

  const savedVentes = localStorage.getItem("historiqueVentes")
  const existingVentes = savedVentes ? JSON.parse(savedVentes) : []

  const nouvellesVentes = [venteComplete, ...existingVentes]
  localStorage.setItem("historiqueVentes", JSON.stringify(nouvellesVentes))

  return venteComplete
}

export const Activites = () => {
  const [ventes, setVentes] = useState<Vente[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  // Charger les ventes depuis le localStorage au montage
  useEffect(() => {
    const savedVentes = localStorage.getItem("historiqueVentes")
    if (savedVentes) {
      try {
        const parsedVentes = JSON.parse(savedVentes).map((v: { date: string }) => ({
          ...v,
          date: new Date(v.date),
        }))
        setVentes(parsedVentes)
      } catch (error) {
        console.error("Erreur lors du chargement des ventes:", error)
      }
    }
  }, [])

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Grouper les ventes par date
  const groupedVentes = ventes.reduce(
    (groups, vente) => {
      const dateKey = formatDate(vente.date)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(vente)
      return groups
    },
    {} as Record<string, Vente[]>,
  )

  // Filtrer les ventes
  const filteredGroups = Object.entries(groupedVentes).filter(([date, ventesOfDay]) => {
    const matchesDate = !selectedDate || date.includes(selectedDate)
    const matchesSearch = ventesOfDay.some(
      (vente) =>
        vente.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vente.produit.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    return matchesDate && (searchTerm === "" || matchesSearch)
  })

  const totalCA = ventes.reduce((sum, vente) => sum + vente.montant, 0)
  const totalVentes = ventes.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header flottant */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Journal des Ventes</h1>
              <p className="text-sm text-gray-600">
                {totalVentes} transactions • {totalCA.toLocaleString()} FCFA
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <input
                aria-label="Sélectionner une date"
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune vente trouvée</h3>
            <p className="text-gray-600">Commencez par enregistrer votre première vente</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Timeline des ventes */}
            {filteredGroups.map(([date, ventesOfDay]) => (
              <div key={date} className="relative">
                {/* Ligne de timeline */}
                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-blue-600"></div>

                {/* Date header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{date}</h2>
                    <p className="text-sm text-gray-600">
                      {ventesOfDay.length} vente{ventesOfDay.length > 1 ? "s" : ""} •{" "}
                      {ventesOfDay.reduce((sum, v) => sum + v.montant, 0).toLocaleString()} FCFA
                    </p>
                  </div>
                </div>

                {/* Ventes du jour */}
                <div className="ml-24 space-y-4">
                  {ventesOfDay.map((vente) => (
                    <div
                      key={vente.id}
                      className="relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group"
                    >
                      {/* Barre colorée */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600"></div>

                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{vente.client}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(vente.date)}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-700">{vente.produit}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-700">Qté: {vente.quantite}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-700 truncate">{vente.notes || "Aucune note"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">{vente.montant.toLocaleString()}</div>
                              <div className="text-sm text-gray-500">FCFA</div>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <DollarSign className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Effet hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
