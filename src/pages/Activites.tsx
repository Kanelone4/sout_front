import { useState, useEffect } from "react"
import {
  ShoppingCart,
  TrendingUp,
  Users,
  Store,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  DollarSign,
  X
} from "lucide-react"
import salesService from "../api/saleServices"
import type { Sale, SalesByPOSStats } from "../api/saleServices"
import Layout from "../components/layout/layout";

export const Activites = () => {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [posFilter, setPosFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const limit = 10

  // Charger les données initiales
  useEffect(() => {
    loadSales()
  }, [currentPage])

  const loadSales = async () => {
    try {
      setLoading(true)
      const response = await salesService.getAllSales(currentPage, limit)
      setSales(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotalCount(response.pagination.totalCount)
    } catch (error) {
      console.error('Erreur lors du chargement des ventes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les ventes
  const filteredSales = sales.filter(sale => {
    const matchesSearch =
      sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.pointOfSale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || sale.status === statusFilter
    const matchesPOS = posFilter === "all" || sale.pointOfSaleId === posFilter

    return matchesSearch && matchesStatus && matchesPOS
  })

  // Calculer les statistiques
  const salesStats = salesService.getSalesByPOS(sales)
  const totalAmount = salesService.getTotalSalesAmount(sales)
  const statusCounts = salesService.getSalesCountByStatus(sales)
  const uniquePOS = [...new Set(sales.map(sale => ({ id: sale.pointOfSaleId, name: sale.pointOfSale.name })))]

  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale)
    setShowDetailModal(true)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedSale(null)
  }

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Chargement des ventes...</span>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ShoppingCart className="h-7 w-7 text-white" />
                  </div>
                  Gestion des Ventes
                </h1>
                <p className="text-gray-600 mt-2">Consultez et analysez les ventes de votre entreprise</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Barre de recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une vente..."
                    className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Actualiser */}
                <button
                  onClick={loadSales}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Statistiques générales */}
          <div className="grid gap-6 md:grid-cols-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Ventes</p>
                  <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
                  <p className="text-sm text-gray-500 mt-1">Transactions</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <ShoppingCart className="h-7 w-7 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Chiffre d'Affaires</p>
                  <p className="text-3xl font-bold text-green-600">{salesService.formatAmount(totalAmount)}</p>
                  <p className="text-sm text-gray-500 mt-1">Montant total</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-7 w-7 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Ventes Terminées</p>
                  <p className="text-3xl font-bold text-green-600">{statusCounts.completed}</p>
                  <p className="text-sm text-gray-500 mt-1">Ventes validées</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">En Attente</p>
                  <p className="text-3xl font-bold text-yellow-600">{statusCounts.pending}</p>
                  <p className="text-sm text-gray-500 mt-1">À traiter</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques par Point de Vente */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Store className="h-5 w-5 text-blue-600" />
                Ventes par Point de Vente
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {salesStats.map((posStats) => (
                  <div key={posStats.pointOfSaleId} className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{posStats.pointOfSaleName}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total ventes:</span>
                        <span className="font-medium text-gray-900">{posStats.totalSales}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Montant total:</span>
                        <span className="font-medium text-green-600">{salesService.formatAmount(posStats.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Terminées:</span>
                        <span className="font-medium text-green-600">{posStats.completedSales}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">En attente:</span>
                        <span className="font-medium text-yellow-600">{posStats.pendingSales}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filtres et Liste des ventes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Liste des Ventes ({filteredSales.length} résultat{filteredSales.length > 1 ? "s" : ""})
                </h2>

                {/* Filtres */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="pending">En attente</option>
                      <option value="completed">Terminée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </div>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    value={posFilter}
                    onChange={(e) => setPosFilter(e.target.value)}
                  >
                    <option value="all">Tous les points de vente</option>
                    {uniquePOS.map((pos) => (
                      <option key={pos.id} value={pos.id}>{pos.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filteredSales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || statusFilter !== "all" || posFilter !== "all"
                    ? "Aucune vente trouvée"
                    : "Aucune vente enregistrée"
                  }
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  {searchTerm || statusFilter !== "all" || posFilter !== "all"
                    ? "Aucune vente ne correspond à vos critères de recherche."
                    : "Les ventes de votre entreprise apparaîtront ici une fois créées."
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vente</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Point de Vente</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendeur</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                Vente #{sale.id.slice(-8)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {salesService.getTotalItemsCount(sale)} article{salesService.getTotalItemsCount(sale) > 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{sale.customer.name}</div>
                          <div className="text-sm text-gray-500">{sale.customer.contactPerson}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{sale.pointOfSale.name}</div>
                          <div className="text-sm text-gray-500">{sale.pointOfSale.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{sale.user.firstName} {sale.user.lastName}</div>
                          <div className="text-sm text-gray-500">{sale.user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {salesService.formatAmount(sale.totalAmount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${salesService.getStatusColor(sale.status)}`}>
                            {sale.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {sale.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {sale.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                            {salesService.getStatusLabel(sale.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {salesService.formatSaleDate(sale.saleDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleViewDetails(sale)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Affichage de {((currentPage - 1) * limit) + 1} à {Math.min(currentPage * limit, totalCount)} sur {totalCount} ventes
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
                        if (pageNum > totalPages) return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === pageNum
                                ? 'bg-green-600 text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
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

        {/* Modal de détails de vente */}
        {showDetailModal && selectedSale && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-gray-200 p-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Détails de la Vente #{selectedSale.id.slice(-8)}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {salesService.formatSaleDate(selectedSale.saleDate)}
                  </p>
                </div>
                <button
                  onClick={handleCloseDetailModal}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Informations Client
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Nom:</span> {selectedSale.customer.name}</div>
                      <div><span className="font-medium">Contact:</span> {selectedSale.customer.contactPerson}</div>
                      <div><span className="font-medium">Email:</span> {selectedSale.customer.email}</div>
                      <div><span className="font-medium">Téléphone:</span> {selectedSale.customer.phone}</div>
                      <div><span className="font-medium">Adresse:</span> {selectedSale.customer.address}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Store className="h-5 w-5 text-green-600" />
                      Point de Vente & Vendeur
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Point de vente:</span> {selectedSale.pointOfSale.name}</div>
                      <div><span className="font-medium">Localisation:</span> {selectedSale.pointOfSale.location}</div>
                      <div><span className="font-medium">Vendeur:</span> {selectedSale.user.firstName} {selectedSale.user.lastName}</div>
                      <div><span className="font-medium">Email vendeur:</span> {selectedSale.user.email}</div>
                    </div>
                  </div>
                </div>

                {/* Informations de vente */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    Détails de la Vente
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Statut:</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${salesService.getStatusColor(selectedSale.status)}`}>
                          {selectedSale.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {selectedSale.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {selectedSale.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                          {salesService.getStatusLabel(selectedSale.status)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Date de vente:</span>
                      <div className="mt-1 text-gray-900">{salesService.formatDateShort(selectedSale.saleDate)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Articles totaux:</span>
                      <div className="mt-1 text-gray-900">{salesService.getTotalItemsCount(selectedSale)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Montant total:</span>
                      <div className="mt-1 text-lg font-bold text-green-600">{salesService.formatAmount(selectedSale.totalAmount)}</div>
                    </div>
                  </div>
                  {selectedSale.notes && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-600">Notes:</span>
                      <div className="mt-1 text-gray-900">{selectedSale.notes}</div>
                    </div>
                  )}
                </div>

                {/* Articles vendus */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    Articles Vendus ({selectedSale.saleItems.length})
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedSale.saleItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                                <div className="text-sm text-gray-500">{item.product.description}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {salesService.formatAmount(item.unitPrice)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {salesService.formatAmount(parseFloat(item.unitPrice) * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            Total de la vente:
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-green-600">
                            {salesService.formatAmount(selectedSale.totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Informations techniques */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    Informations Techniques
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">ID de la vente:</span>
                      <div className="mt-1 font-mono text-xs bg-gray-200 px-2 py-1 rounded">{selectedSale.id}</div>
                    </div>
                    <div>
                      <span className="font-medium">Date de création:</span>
                      <div className="mt-1">{salesService.formatSaleDate(selectedSale.createdAt)}</div>
                    </div>
                    <div>
                      <span className="font-medium">Dernière modification:</span>
                      <div className="mt-1">{salesService.formatSaleDate(selectedSale.updatedAt)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-6 border-t border-gray-200">
                <button
                  onClick={handleCloseDetailModal}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Activites;