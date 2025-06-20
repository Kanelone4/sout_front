import { useState, useEffect } from "react"
import { Store, MapPin, Users, TrendingUp, Plus, X, RefreshCw, Search, Calendar, ShoppingBag } from "lucide-react"
import type { PointOfSale } from "../api/posService";
import type { CreatePOSRequest } from "../api/posService"; 
import posService from "../api/posService";
import Layout from "../components/layout/layout";


export const POSManagement = () => {
    const [pointsOfSale, setPointsOfSale] = useState<PointOfSale[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [creating, setCreating] = useState(false)

    // Données du formulaire de création
    const [formData, setFormData] = useState<CreatePOSRequest>({
        name: "",
        location: "",
    })

    const [formErrors, setFormErrors] = useState<string[]>([])

    // Charger les données initiales
    useEffect(() => {
        loadPOS()
    }, [])

    const loadPOS = async () => {
        try {
            setLoading(true)
            const posList = await posService.getAllPOS()
            setPointsOfSale(posList)
        } catch (error) {
            console.error('Erreur lors du chargement des points de vente:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreatePOS = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        const validation = posService.validatePOSData(formData)
        if (!validation.isValid) {
            setFormErrors(validation.errors)
            return
        }

        try {
            setCreating(true)
            setFormErrors([])

            await posService.createPOS(formData)

            // Recharger la liste
            await loadPOS()

            // Fermer le modal et réinitialiser le formulaire
            setShowCreateModal(false)
            setFormData({ name: "", location: "" })
        } catch (error: any) {
            console.error('Erreur lors de la création:', error)
            if (error.errors) {
                setFormErrors(error.errors.map((e: any) => e.message))
            } else {
                setFormErrors([error.message || 'Erreur lors de la création du point de vente'])
            }
        } finally {
            setCreating(false)
        }
    }

    const handleCloseModal = () => {
        setShowCreateModal(false)
        setFormData({ name: "", location: "" })
        setFormErrors([])
    }

    // Filtrer les points de vente
    const filteredPOS = pointsOfSale.filter(pos =>
        pos.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pos.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Statistiques
    const totalPOS = pointsOfSale.length
    const totalUsers = pointsOfSale.reduce((sum, pos) => sum + posService.getUsersCount(pos), 0)
    const totalSales = pointsOfSale.reduce((sum, pos) => sum + posService.getSalesCount(pos), 0)
    const averageUsersPerPOS = totalPOS > 0 ? Math.round(totalUsers / totalPOS) : 0

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
        <Layout>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Store className="h-7 w-7 text-white" />
                                    </div>
                                    Points de Vente
                                </h1>
                                <p className="text-gray-600 mt-2">Gérez vos points de vente et leur personnel</p>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Barre de recherche */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un point de vente..."
                                        className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Bouton créer */}
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
                                >
                                    <Plus className="h-5 w-5" />
                                    Nouveau Point de Vente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                    {/* Statistiques */}
                    <div className="grid gap-6 md:grid-cols-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Points de Vente</p>
                                    <p className="text-3xl font-bold text-gray-900">{totalPOS}</p>
                                    <p className="text-sm text-gray-500 mt-1">Sites actifs</p>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">
                                    <Store className="h-7 w-7 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Personnel Total</p>
                                    <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
                                    <p className="text-sm text-gray-500 mt-1">Utilisateurs assignés</p>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                                    <Users className="h-7 w-7 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Ventes Totales</p>
                                    <p className="text-3xl font-bold text-purple-600">{totalSales}</p>
                                    <p className="text-sm text-gray-500 mt-1">Transactions</p>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                                    <ShoppingBag className="h-7 w-7 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Moyenne Personnel</p>
                                    <p className="text-3xl font-bold text-orange-600">{averageUsersPerPOS}</p>
                                    <p className="text-sm text-gray-500 mt-1">Utilisateurs par site</p>
                                </div>
                                <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                                    <TrendingUp className="h-7 w-7 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des points de vente */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Points de Vente ({filteredPOS.length} résultat{filteredPOS.length > 1 ? "s" : ""})
                                </h2>
                                <button
                                    onClick={loadPOS}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Actualiser
                                </button>
                            </div>
                        </div>

                        {filteredPOS.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Store className="h-16 w-16 text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {searchTerm ? "Aucun point de vente trouvé" : "Aucun point de vente"}
                                </h3>
                                <p className="text-gray-600 text-center max-w-md mb-6">
                                    {searchTerm
                                        ? "Aucun point de vente ne correspond à votre recherche."
                                        : "Créez votre premier point de vente pour commencer à gérer vos sites de vente."
                                    }
                                </p>
                                {!searchTerm && (
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
                                    >
                                        <Plus className="h-5 w-5" />
                                        Créer le premier point de vente
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredPOS.map((pos) => (
                                        <div
                                            key={pos.id}
                                            className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-green-200 transition-all duration-200"
                                        >
                                            {/* Header du point de vente */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{pos.name}</h3>
                                                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                                        <span className="text-sm">{pos.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Statistiques du point de vente */}
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="text-center p-3 bg-blue-50 rounded-xl">
                                                    <div className="flex items-center justify-center gap-1 mb-1">
                                                        <Users className="h-4 w-4 text-blue-600" />
                                                        <span className="text-sm font-medium text-blue-600">Personnel</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-blue-900">{posService.getUsersCount(pos)}</p>
                                                    <p className="text-xs text-blue-600">
                                                        {posService.getActiveUsersCount(pos)} actifs
                                                    </p>
                                                </div>

                                                <div className="text-center p-3 bg-purple-50 rounded-xl">
                                                    <div className="flex items-center justify-center gap-1 mb-1">
                                                        <ShoppingBag className="h-4 w-4 text-purple-600" />
                                                        <span className="text-sm font-medium text-purple-600">Ventes</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-purple-900">{posService.getSalesCount(pos)}</p>
                                                    <p className="text-xs text-purple-600">Transactions</p>
                                                </div>
                                            </div>

                                            {/* Informations supplémentaires */}
                                            <div className="pt-4 border-t border-gray-100">
                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>Créé le {posService.formatCreatedDate(pos.createdAt)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span>Actif</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Liste du personnel (si disponible) */}
                                            {pos.users && pos.users.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Personnel assigné:</p>
                                                    <div className="space-y-1">
                                                        {pos.users.slice(0, 3).map((user) => (
                                                            <div key={user.id} className="flex items-center gap-2 text-sm">
                                                                <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                                <span className="text-gray-700">
                                                                    {user.firstName} {user.lastName}
                                                                </span>
                                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                    {user.role}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {pos.users.length > 3 && (
                                                            <p className="text-xs text-gray-500">
                                                                +{pos.users.length - 3} autre{pos.users.length - 3 > 1 ? 's' : ''}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal de création */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center border-b border-gray-200 p-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Nouveau Point de Vente</h2>
                                    <p className="text-sm text-gray-600 mt-1">Créer un nouveau site de vente</p>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Affichage des erreurs */}
                                {formErrors.length > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <h4 className="font-medium text-red-800 mb-2">Erreurs de validation :</h4>
                                        <ul className="text-sm text-red-700 space-y-1">
                                            {formErrors.map((error, index) => (
                                                <li key={index}>• {error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom du point de vente *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        placeholder="Ex: Magasin Centre-Ville"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Adresse / Localisation *
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        rows={3}
                                        placeholder="Ex: 123 Rue Principale, Centre-Ville, Abomey-Calavi"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Indiquez l'adresse complète du point de vente
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        disabled={creating}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCreatePOS}
                                        className="px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        disabled={creating}
                                    >
                                        {creating ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                Création...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4" />
                                                Créer le point de vente
                                            </>
                                        )}
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