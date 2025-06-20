import { useState, useEffect } from "react"
import { Package, PlusCircle, History, AlertTriangle, TrendingDown, TrendingUp, Plus, Minus, RefreshCw, Search } from "lucide-react"
import productService from "../../api/productService"
import type { Product, StockHistoryItem } from "../../api/productService";

export const Stock = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>([])
  const [reapproQuantities, setReapproQuantities] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  // Charger les données initiales
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsList = await productService.getAllProducts()
      setProducts(productsList)
    } catch (error) {
      console.error('ErrXOF lors du chargement des produits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStock = async (productId: string) => {
    const quantity = reapproQuantities[productId]
    if (!quantity || quantity <= 0) return

    try {
      await productService.addStock({
        productId,
        qtyAdded: quantity
      })
      
      // Recharger les produits pour avoir les données à jour
      await loadProducts()
      
      // Réinitialiser la quantité
      setReapproQuantities(prev => ({ ...prev, [productId]: 0 }))
    } catch (error) {
      console.error('ErrXOF lors de l\'ajout de stock:', error)
    }
  }

  const loadStockHistory = async (productId: string) => {
    try {
      const history = await productService.getStockHistory(productId)
      setStockHistory(history.history)
      setSelectedProduct(productId)
    } catch (error) {
      console.error('ErrXOF lors du chargement de l\'historique:', error)
    }
  }

  // Filtrer les produits
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Statistiques
  const totalProducts = products.length
  const lowStockProducts = products.filter(p => productService.isLowStock(p)).length
  const totalStockValue = products.reduce((sum, p) => sum + productService.calculateStockValue(p), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Chargement...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="h-7 w-7 text-white" />
                </div>
                Gestion du Stock
              </h1>
              <p className="text-gray-600 mt-2">Surveillez et gérez vos niveaux de stock en temps réel</p>
            </div>
            
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Statistiques */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total produits</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                <p className="text-sm text-gray-500 mt-1">Produits actifs</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Package className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Stock faible</p>
                <p className="text-3xl font-bold text-red-600">{lowStockProducts}</p>
                <p className="text-sm text-gray-500 mt-1">Nécessite réapprovisionnement</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">ValXOF du stock</p>
                <p className="text-3xl font-bold text-green-600">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(totalStockValue)}
                </p>
                <p className="text-sm text-gray-500 mt-1">ValXOF totale</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Grille des produits */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Inventaire ({filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""})
              </h2>
              <button
                onClick={loadProducts}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600 text-center max-w-md">
                {searchTerm ? "Aucun produit ne correspond à votre recherche." : "Aucun produit n'a été trouvé dans votre inventaire."}
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isLowStock = productService.isLowStock(product)
                  const stockValue = productService.calculateStockValue(product)

                  return (
                    <div
                      key={product.id}
                      className={`relative bg-white border-2 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg ${
                        isLowStock 
                          ? "border-red-200 bg-gradient-to-br from-red-50 to-red-50/50" 
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                    >
                      {/* Badge stock faible */}
                      {isLowStock && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Stock faible
                          </div>
                        </div>
                      )}

                      {/* Header du produit */}
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h3>
                          <button
                            onClick={() => loadStockHistory(product.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir l'historique"
                          >
                            <History className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            isLowStock 
                              ? "bg-red-100 text-red-800" 
                              : product.availableStock > 50 
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {product.availableStock} en stock
                          </span>
                          
                          {product.price && (
                            <span className="text-sm font-semibold text-gray-700">
                              {productService.formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Informations détaillées */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-xl space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Entrées totales:</span>
                          <span className="font-medium text-green-600">+{product.totalEntries}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Transférés:</span>
                          <span className="font-medium text-blue-600">-{product.totalTransferred}</span>
                        </div>
                        {stockValue > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">ValXOF stock:</span>
                            <span className="font-medium text-gray-900">
                              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(stockValue)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Section réapprovisionnement */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Réapprovisionnement
                        </label>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReapproQuantities(prev => ({
                              ...prev,
                              [product.id]: Math.max(0, (prev[product.id] || 0) - 1)
                            }))}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <input
                            type="number"
                            min="0"
                            className="flex-1 text-center border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={reapproQuantities[product.id] || ""}
                            onChange={(e) =>
                              setReapproQuantities(prev => ({
                                ...prev,
                                [product.id]: parseInt(e.target.value) || 0,
                              }))
                            }
                            placeholder="Quantité"
                          />
                          
                          <button
                            onClick={() => setReapproQuantities(prev => ({
                              ...prev,
                              [product.id]: (prev[product.id] || 0) + 1
                            }))}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleAddStock(product.id)}
                          disabled={!reapproQuantities[product.id] || reapproQuantities[product.id] <= 0}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Ajouter au stock
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Historique des mouvements */}
        {selectedProduct && stockHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" />
                Historique des mouvements
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockHistory.map((movement, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(movement.date).toLocaleDateString("fr-FR", {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            movement.type === "TRANSFER" 
                              ? "bg-purple-100 text-purple-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {movement.type === "TRANSFER" ? (
                            <TrendingDown className="h-3 w-3" />
                          ) : (
                            <TrendingUp className="h-3 w-3" />
                          )}
                          {movement.type === "TRANSFER" ? "Transfert" : "Entrée"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-semibold ${
                            movement.type === "TRANSFER" ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {movement.type === "TRANSFER" ? "-" : "+"}
                          {Math.abs(movement.quantity)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {movement.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}