import { useState, useEffect } from "react"
import { Package, PlusCircle, History, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import { getStock, reapprovisionnerStock, getMouvementsStock, parseQuantite } from "../stock/services/StockServices"
import type { ProduitStock, MouvementStock } from "../stock/types/stock"

export const Stock = () => {
  const [stock, setStock] = useState<ProduitStock[]>([])
  const [mouvements, setMouvements] = useState<MouvementStock[]>([])
  const [quantiteReappro, setQuantiteReappro] = useState<Record<string, number>>({})

  const [filteredStock, setFilteredStock] = useState<ProduitStock[]>([])

  useEffect(() => {
    const initialStock = getStock()
    setStock(initialStock)
    setMouvements(getMouvementsStock())
    setFilteredStock(initialStock)
  }, [])

 

  const handleReappro = (produitId: string) => {
    if (!quantiteReappro[produitId] || quantiteReappro[produitId] <= 0) return

    if (reapprovisionnerStock(produitId, quantiteReappro[produitId], "Manager")) {
      const updatedStock = getStock()
      setStock(updatedStock)
      setMouvements(getMouvementsStock())
      setQuantiteReappro((prev) => ({ ...prev, [produitId]: 0 }))
    }
  }

  // Statistiques
  const totalProduits = stock.length
  const produitsEnRupture = stock.filter((p) => parseQuantite(p.quantite) <= p.seuilReappro).length
  const totalMouvements = mouvements.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                Gestion du Stock
              </h1>
              <p className="text-gray-600 mt-2">Surveillez et gérez vos niveaux de stock en temps réel</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total produits</p>
                <p className="text-2xl font-bold text-gray-900">{totalProduits}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock faible</p>
                <p className="text-2xl font-bold text-red-600">{produitsEnRupture}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mouvements</p>
                <p className="text-2xl font-bold text-gray-900">{totalMouvements}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <History className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Grille des produits */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Produits en stock ({filteredStock.length} résultat{filteredStock.length > 1 ? "s" : ""})
              </h2>
              
            </div>
          </div>

          {filteredStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600 text-center max-w-md">
                Aucun produit ne correspond à vos critères de recherche.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStock.map((produit) => {
                  const qteNum = parseQuantite(produit.quantite)
                  const isLowStock = qteNum <= produit.seuilReappro

                  return (
                    <div
                      key={produit.id}
                      className={`border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-md ${
                        isLowStock ? "border-red-200 bg-red-50/50" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{produit.nom}</h3>
                          <p className="text-sm text-gray-600">{produit.categorie}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isLowStock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {produit.quantite} en stock
                        </span>
                      </div>

                      {isLowStock && (
                        <div className="mb-4 flex items-center gap-2 p-3 bg-red-100 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                          <span className="text-sm text-red-700">Stock faible - Seuil: {produit.seuilReappro}</span>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min="1"
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={quantiteReappro[produit.id] || ""}
                            onChange={(e) =>
                              setQuantiteReappro((prev) => ({
                                ...prev,
                                [produit.id]: Number.parseInt(e.target.value) || 0,
                              }))
                            }
                            placeholder="Quantité à ajouter"
                          />
                          <button
                            onClick={() => handleReappro(produit.id)}
                            disabled={!quantiteReappro[produit.id] || quantiteReappro[produit.id] <= 0}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <PlusCircle className="h-4 w-4" />
                            Réapprovisionnement
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Historique des mouvements */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <History className="h-5 w-5 text-blue-600" />
              Historique des mouvements
            </h2>
          </div>

          {mouvements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <History className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun mouvement enregistré</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsable
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mouvements.map((mvt) => (
                    <tr key={mvt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(mvt.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {stock.find((p) => p.id === mvt.produitId)?.nom || mvt.produitId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            mvt.type === "vente" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {mvt.type === "vente" ? (
                            <TrendingDown className="h-3 w-3" />
                          ) : (
                            <TrendingUp className="h-3 w-3" />
                          )}
                          {mvt.type === "vente" ? "Vente" : "Réappro"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${mvt.type === "vente" ? "text-red-600" : "text-green-600"}`}
                        >
                          {mvt.type === "vente" ? "-" : "+"}
                          {mvt.quantite}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mvt.utilisateur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
