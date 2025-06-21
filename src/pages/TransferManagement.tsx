import { useState, useEffect } from "react"
import { 
  TruckIcon, 
  Package, 
  Plus, 
  Eye, 
  Search, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  X,
  BarChart3,
  Warehouse,
  AlertCircle,
  Calendar,
  ChevronDown,
  Filter
} from "lucide-react"
import Layout from "../components/layout/layout"
import type { CreateTransferRequest, Transfer, PointOfSale, StockProduct, ApiError } from "../api/transferService"
import transferService from "../api/transferService"
import productService from "../api/productService";
import type { Product, StockHistoryItem } from "../api/productService";


export const TransferManagement = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [stockProducts, setStockProducts] = useState<Product[]>([])
  const [pointsOfSale, setPointsOfSale] = useState<PointOfSale[]>([])
  const [loading, setLoading] = useState(true)
  const [stockLoading, setStockLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [creating, setCreating] = useState(false)
  const [stockData, setStockData] = useState<any>(null)
  const [error, setError] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)


  const [transferData, setTransferData] = useState<CreateTransferRequest>({
    pointOfSaleId: '',
    transferDate: new Date().toISOString(),
    transferItems: [{ productId: '', quantity: 1 }]
  })
  const [formErrors, setFormErrors] = useState<string[]>([])

  const [filters, setFilters] = useState({
    pointOfSaleId: '',
    startDate: '',
    endDate: '',
    userId: ''
  })

  const limit = 10

  useEffect(() => {
    loadInitialData()
  }, [currentPage])

const loadInitialData = async () => {
  await Promise.all([
    loadTransfers(),
    loadPointsOfSale(),
    loadProducts()
  ]);
};

const loadProducts = async () => {
  try {
    const productsList = await productService.getAllProducts();
    setStockProducts(productsList);
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
  }
};


  const loadTransfers = async () => {
  try {
    setLoading(true);
    setError("");

    const queryFilters = {
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      )
    };

    const response = await transferService.getAllTransfers(currentPage, limit, queryFilters);
    setTransfers(response.data);
    console.log(response.data);
    
    setTotalPages(response.pagination.totalPages);
  } catch (error: any) {
    console.error('Erreur lors du chargement des transferts:', error);
    setError('Erreur lors du chargement des transferts');
  } finally {
    setLoading(false);
  }
};


const loadPointsOfSale = async () => {
  try {
    const points = await transferService.getPointsOfSale(); 
    setPointsOfSale(points);
  } catch (error: any) {
    console.error('Erreur lors du chargement des points de vente:', error);
  }
};

const handleCreateTransfer = async (e: React.FormEvent) => {
  e.preventDefault();

  const validation = transferService.validateTransferData(transferData);
  if (!validation.isValid) {
    setFormErrors(validation.errors);
    return;
  }

  try {
    setCreating(true);
    setFormErrors([]);
    setError("");

    await transferService.createTransfer(transferData);
    await loadTransfers();
    await loadProducts(); 

    setShowCreateModal(false);
    resetTransferForm();
  } catch (error: any) {
    console.error('Erreur lors de la création:', error);
    const errorMessage = transferService.handleTransferError(error);
    setFormErrors([errorMessage]);
  } finally {
    setCreating(false);
  }
};


  const resetTransferForm = () => {
    setTransferData({
      pointOfSaleId: '',
      transferDate: new Date().toISOString(),
      transferItems: [{ productId: '', quantity: 1 }]
    })
    setFormErrors([])
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    resetTransferForm()
  }

  const handleViewTransfer = async (transfer: Transfer) => {
    try {
      const fullTransfer = await transferService.getTransferById(transfer.id)
      setSelectedTransfer(fullTransfer)
      setShowTransferModal(true)
    } catch (error: any) {
      console.error('Erreur lors du chargement des détails:', error)
      setError('Erreur lors du chargement des détails du transfert')
    }
  }

  const addTransferItem = () => {
    setTransferData({
      ...transferData,
      transferItems: [...transferData.transferItems, { productId: '', quantity: 1 }]
    })
  }

  const removeTransferItem = (index: number) => {
    if (transferData.transferItems.length > 1) {
      const newItems = transferData.transferItems.filter((_, i) => i !== index)
      setTransferData({ ...transferData, transferItems: newItems })
    }
  }

  const updateTransferItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    const newItems = [...transferData.transferItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setTransferData({ ...transferData, transferItems: newItems })
  }

  const getAvailableQuantity = (productId: string): number => {
    const product = stockProducts.find(p => p.id === productId)
    return product?.availableStock || 0
  }

  const applyFilters = async () => {
    setCurrentPage(1)
    await loadTransfers()
    setShowFilters(false)
  }

  const clearFilters = async () => {
    setFilters({
      pointOfSaleId: '',
      startDate: '',
      endDate: '',
      userId: ''
    })
    setCurrentPage(1)
    await loadTransfers()
  }

  const filteredTransfers = transfers.filter(transfer =>
    transfer.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.transferItems.some(item => 
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const stats = stockData ? transferService.calculateStockStats(stockData) : {
    totalProducts: 0,
    productsWithStock: 0,
    outOfStock: 0,
    totalValue: 0
  }

  const stockAlerts = stockData ? transferService.getStockAlerts(stockData) : {
    outOfStock: [],
    lowStock: [],
    criticalAlerts: 0
  }

  if (loading && currentPage === 1) {
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
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TruckIcon className="h-7 w-7 text-white" />
                  </div>
                  Gestion des Transferts
                </h1>
                <p className="text-gray-600 mt-2">Transférez des produits de la maison mère vers les points de vente</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un transfert..."
                    className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filtres
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  Nouveau Transfert
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Point de vente</label>
                    <select
                      value={filters.pointOfSaleId}
                      onChange={(e) => setFilters({...filters, pointOfSaleId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Tous les points de vente</option>
                      {pointsOfSale.map((pos) => (
                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      onClick={applyFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Appliquer
                    </button>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Effacer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
              <button onClick={() => setError("")} className="ml-auto text-red-500 hover:text-red-700">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {stockAlerts.criticalAlerts > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3 className="text-yellow-800 font-semibold">Alertes Stock</h3>
              </div>
              <div className="text-yellow-700 text-sm space-y-1">
                {stockAlerts.outOfStock.length > 0 && (
                  <p>• {stockAlerts.outOfStock.length} produit(s) en rupture de stock</p>
                )}
                {stockAlerts.lowStock.length > 0 && (
                  <p>• {stockAlerts.lowStock.length} produit(s) avec stock faible</p>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Transferts</p>
                  <p className="text-3xl font-bold text-gray-900">{transfers.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Opérations</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <TruckIcon className="h-7 w-7 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Produits Disponibles</p>
                  <p className="text-3xl font-bold text-green-600">{stats.productsWithStock}</p>
                  <p className="text-sm text-gray-500 mt-1">En stock</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">
                  <Package className="h-7 w-7 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Valeur du Stock</p>
                  <p className="text-3xl font-bold text-purple-600">{transferService.formatAmount(stats.totalValue)}</p>
                  <p className="text-sm text-gray-500 mt-1">Stock disponible</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <Warehouse className="h-7 w-7 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Stock Épuisé</p>
                  <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
                  <p className="text-sm text-gray-500 mt-1">Produits à réapprovisionner</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-7 w-7 text-red-600" />
                </div>
              </div>
            </div>
          </div>


          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Historique des Transferts ({filteredTransfers.length} résultat{filteredTransfers.length > 1 ? "s" : ""})
                </h2>
                <button
                  onClick={loadTransfers}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
              </div>
            </div>
            {filteredTransfers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <TruckIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? "Aucun transfert trouvé" : "Aucun transfert effectué"}
                </h3>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  {searchTerm
                    ? "Aucun transfert ne correspond à votre recherche."
                    : "Créez votre premier transfert vers un point de vente."
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Créer le premier transfert
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Transfert</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Valeur</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransfers.map((transfer) => (
                      <tr key={transfer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <TruckIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                Transfert #{transfer.id.slice(-8)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {transfer.transferItems.length} type{transfer.transferItems.length > 1 ? 's' : ''} d'articles
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {transfer.user.firstName} {transfer.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{transfer.user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {pointsOfSale.find(pos => pos.id === transfer.pointOfSaleId)?.name || 'Point de vente'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {transfer.transferItems.slice(0, 2).map((item, index) => (
                              <div key={index} className="truncate max-w-xs">
                                {item.product.name} (x{item.qty})
                              </div>
                            ))}
                            {transfer.transferItems.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{transfer.transferItems.length - 2} autre{transfer.transferItems.length - 2 > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {transferService.getTotalQuantityTransferred(transfer)}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                          {transferService.formatAmount(transferService.getTotalValue(transfer))}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transferService.formatDateShort(transfer.transferDate)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewTransfer(transfer)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Voir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} sur {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1 || loading}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || loading}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Nouveau Transfert</h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateTransfer} className="p-6 space-y-6">
                {formErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <h3 className="text-red-800 font-semibold">Erreurs de validation</h3>
                    </div>
                    <ul className="text-red-700 text-sm space-y-1">
                      {formErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Point de vente de destination *
                  </label>
                  <select
                    value={transferData.pointOfSaleId}
                    onChange={(e) => setTransferData({ ...transferData, pointOfSaleId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner un point de vente</option>
                    {pointsOfSale.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.name} - {pos.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de transfert
                  </label>
                  <input
                    type="datetime-local"
                    value={transferData.transferDate ? new Date(transferData.transferDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setTransferData({ 
                      ...transferData, 
                      transferDate: e.target.value ? new Date(e.target.value).toISOString() : ''
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={transferData.notes || ''}
                    onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Notes sur ce transfert..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Articles à transférer</h3>
                    <button
                      type="button"
                      onClick={addTransferItem}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter
                    </button>
                  </div>

                  <div className="space-y-4">
                    {transferData.transferItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Produit *
                          </label>
                          <select
                            value={item.productId}
                            onChange={(e) => updateTransferItem(index, 'productId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Sélectionner un produit</option>
                            {stockProducts.filter(p => p.availableStock > 0).map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name} (Disponible: {product.availableStock})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-32">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantité *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={getAvailableQuantity(item.productId)}
                            value={item.quantity}
                            onChange={(e) => updateTransferItem(index, 'quantity', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        {transferData.transferItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTransferItem(index)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {creating && <RefreshCw className="h-4 w-4 animate-spin" />}
                    {creating ? 'Création...' : 'Créer le transfert'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showTransferModal && selectedTransfer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Détails du Transfert #{selectedTransfer.id.slice(-8)}
                  </h2>
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Date de transfert:</span>
                        <p className="text-gray-900">{transferService.formatTransferDate(selectedTransfer.transferDate)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Utilisateur:</span>
                        <p className="text-gray-900">{selectedTransfer.user.firstName} {selectedTransfer.user.lastName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Entreprise:</span>
                        <p className="text-gray-900">{selectedTransfer.company.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Destination:</span>
                        <p className="text-gray-900">{selectedTransfer.destinationPointOfSale || 'Point de vente'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Nombre d'articles:</span>
                        <p className="text-gray-900">{selectedTransfer.transferItems.length}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Quantité totale:</span>
                        <p className="text-gray-900 font-semibold">{transferService.getTotalQuantityTransferred(selectedTransfer)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Valeur totale:</span>
                        <p className="text-green-600 font-bold text-lg">{transferService.formatAmount(transferService.getTotalValue(selectedTransfer))}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles transférés</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sous-total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedTransfer.transferItems.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                                <div className="text-sm text-gray-500">{item.product.description}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {transferService.formatAmount(item.product.price)}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {item.qty}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-600">
                              {transferService.formatAmount(item.qty * item.product.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-900">
                            Total:
                          </td>
                          <td className="px-4 py-3 text-lg font-bold text-green-600">
                            {transferService.formatAmount(transferService.getTotalValue(selectedTransfer))}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {selectedTransfer.stockVerifications && selectedTransfer.stockVerifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vérifications de stock</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="space-y-2">
                        {selectedTransfer.stockVerifications.map((verification, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-green-800">
                              {verification.productName}: {verification.quantitéTransférée} transférés
                            </span>
                            <span className="text-green-600 font-medium">
                              Stock restant: {verification.stockRestant}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}