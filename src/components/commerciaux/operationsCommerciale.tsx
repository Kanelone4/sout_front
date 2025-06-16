
import type React from "react"

import { useState } from "react"
import { PlusCircle, FileBarChart2, X, ShoppingCart} from "lucide-react"
import { ajouterVente } from "../activites/activites"
import { ajouterRapport } from "../rapports/rapports"

// Données des produits avec leurs prix unitaires
const produits = [
  { id: "pocket_wifi", nom: "Pocket WiFi 4G", prix: 89900 },
  { id: "fibre_optique", nom: "Kit Fibre Optique", prix: 59900 },
  { id: "carte_sim", nom: "Carte SIM Celtiis", prix: 2500 },
  { id: "forfait_mobile", nom: "Forfait Mobile", prix: 15000 },
]

export const OperationsCommerciales = () => {
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  // Données de formulaire de vente
  const [saleData, setSaleData] = useState({
    client: "",
    produit: "",
    quantite: 1,
    montant: 0,
    notes: "",
  })

  // Données de formulaire de rapport
  const [reportData, setReportData] = useState({
    commercial: "",
    date: "",
    dateRapport: new Date().toISOString().split("T")[0],
    produitsVendus: "",
    chiffreAffaires: "",
    observations: "",
    objectifsAtteints: "",
  })

  // Calcul du montant total lorsque le produit ou la quantité change
  const updateMontant = (produitId: string, quantite: number) => {
    const produitSelectionne = produits.find((p) => p.id === produitId)
    if (produitSelectionne) {
      return produitSelectionne.prix * quantite
    }
    return 0
  }

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nouvelleVente = {
      client: saleData.client,
      produit: produits.find((p) => p.id === saleData.produit)?.nom || saleData.produit,
      quantite: saleData.quantite,
      montant: saleData.montant,
      notes: saleData.notes,
    }
    ajouterVente(nouvelleVente)
    setShowSaleModal(false)
    // Reset form
    setSaleData({
      client: "",
      produit: "",
      quantite: 1,
      montant: 0,
      notes: "",
    })
  }

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    ajouterRapport(reportData)
    setShowReportModal(false)
    // Reset form
    setReportData({
      commercial: "",
      date: "",
      dateRapport: new Date().toISOString().split("T")[0],
      produitsVendus: "",
      chiffreAffaires: "",
      observations: "",
      objectifsAtteints: "",
    })
  }

  const navigateToCatalogue = () => {
    console.log("Navigation vers le catalogue des produits")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header avec titre et bouton catalogue */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-lg shadow-sm border">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Opérations Commerciales</h1>
            <p className="text-gray-600 mt-1">Gérez vos ventes et générez vos rapports d'activité</p>
          </div>
          <button
            onClick={navigateToCatalogue}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            Voir le catalogue
          </button>
        </div>

       

        {/* Actions principales */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Actions Rapides</h2>
            <p className="text-gray-600 mt-1">Choisissez une action pour commencer</p>
          </div>
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <OperationCard
                icon={<PlusCircle className="h-12 w-12 text-blue-600" />}
                title="Enregistrer une Vente"
                description="Créer une nouvelle transaction commerciale avec calcul automatique du montant total"
                buttonText="Nouvelle Vente"
                onClick={() => setShowSaleModal(true)}
                variant="primary"
              />

              <OperationCard
                icon={<FileBarChart2 className="h-12 w-12 text-purple-600" />}
                title="Rapport de Ventes"
                description="Générer des rapports d'activité commerciale détaillés avec analyses de performance"
                buttonText="Créer Rapport"
                variant="secondary"
                onClick={() => setShowReportModal(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Enregistrement Vente */}
      {showSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Nouvelle Vente</h2>
                <p className="text-sm text-gray-600">Enregistrer une transaction commerciale</p>
              </div>
              <button
              title="Fermer"
                onClick={() => setShowSaleModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Nom du client ou numéro de téléphone"
                  value={saleData.client}
                  onChange={(e) => setSaleData({ ...saleData, client: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="produit" className="block text-sm font-medium text-gray-700 mb-2">
                  Produit *
                </label>
                <select
                  id="produit"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={saleData.produit}
                  onChange={(e) => {
                    const newProduit = e.target.value
                    const newMontant = updateMontant(newProduit, saleData.quantite)
                    setSaleData({
                      ...saleData,
                      produit: newProduit,
                      montant: newMontant,
                    })
                  }}
                  required
                >
                  <option value="">Sélectionner un produit</option>
                  {produits.map((produit) => (
                    <option key={produit.id} value={produit.id}>
                      {produit.nom} - {produit.prix.toLocaleString()} FCFA
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantite" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité *
                  </label>
                  <input
                    id="quantite"
                    type="number"
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={saleData.quantite}
                    onChange={(e) => {
                      const newQuantite = Number.parseInt(e.target.value) || 1
                      const newMontant = updateMontant(saleData.produit, newQuantite)
                      setSaleData({
                        ...saleData,
                        quantite: newQuantite,
                        montant: newMontant,
                      })
                    }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-2">
                    Montant Total
                  </label>
                  <input
                    id="montant"
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-gray-50 text-gray-700"
                    value={saleData.montant.toLocaleString() + " FCFA"}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows={3}
                  placeholder="Informations supplémentaires, mode de paiement, etc."
                  value={saleData.notes}
                  onChange={(e) => setSaleData({ ...saleData, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowSaleModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Enregistrer la vente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Génération Rapport */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Rapport Commercial</h2>
                <p className="text-sm text-gray-600">Générer un rapport d'activité détaillé</p>
              </div>
              <button
              title="Fermer"
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du Commercial *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  placeholder="Votre nom complet"
                  value={reportData.commercial}
                  onChange={(e) => setReportData({ ...reportData, commercial: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date du rapport *
                </label>
                <input
                  id="date"
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  value={reportData.date}
                  onChange={(e) => setReportData({ ...reportData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Produits vendus *</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  rows={3}
                  placeholder="Détail des produits vendus (quantités, références, etc.)"
                  value={reportData.produitsVendus}
                  onChange={(e) => setReportData({ ...reportData, produitsVendus: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chiffre d'affaires (FCFA) *</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  placeholder="Montant total des ventes"
                  value={reportData.chiffreAffaires}
                  onChange={(e) => setReportData({ ...reportData, chiffreAffaires: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Objectifs atteints</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  rows={2}
                  placeholder="Pourcentage d'objectif atteint, performances par rapport aux prévisions..."
                  value={reportData.objectifsAtteints}
                  onChange={(e) => setReportData({ ...reportData, objectifsAtteints: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observations</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  rows={3}
                  placeholder="Remarques, difficultés rencontrées, suggestions d'amélioration..."
                  value={reportData.observations}
                  onChange={(e) => setReportData({ ...reportData, observations: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Générer rapport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const OperationCard = ({
  icon,
  title,
  description,
  buttonText,
  variant = "primary",
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  buttonText: string
  variant?: "primary" | "secondary"
  onClick: () => void
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-200 bg-white h-full flex flex-col">
      <div className="flex flex-col items-center text-center flex-grow">
        <div className="mb-6 p-4 rounded-full bg-gray-50">{icon}</div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-8 flex-grow leading-relaxed">{description}</p>
        <button
          onClick={onClick}
          className={`px-8 py-4 rounded-lg text-sm font-medium w-full transition-colors ${
            variant === "primary"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}
