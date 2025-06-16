import type React from "react"

import { useState } from "react"
import { MoreHorizontal, FileDigit, Download, ShoppingCart, Search, Filter } from "lucide-react"
import './catalogueProduit.css'
type Product = {
  id: string
  name: string
  category: "physique" | "numérique"
  price: number
  stock: number
  image: string
}

export const CatalogueProduit = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"all" | "physique" | "numérique">("all")
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  const products: Product[] = [
    {
      id: "1",
      name: "Pocket WiFi 4G Celtiis",
      category: "physique",
      price: 14000,
      stock: 15,
      image: "https://i.imgur.com/JqYeZZn.jpg",
    },
    {
      id: "2",
      name: "Kit Fibre Optique Celtiis",
      category: "physique",
      price: 25000,
      stock: 8,
      image: "https://i.imgur.com/mX7TzGD.jpg",
    },
    {
      id: "3",
      name: "Carte SIM Celtiis",
      category: "physique",
      price: 100,
      stock: 120,
      image: "https://i.imgur.com/8z3qVQk.jpg",
    },
    {
      id: "6",
      name: "Mobile Money Celtiis",
      category: "numérique",
      price: 0,
      stock: 999,
      image: "https://i.imgur.com/5vZwK2G.jpg",
    },
    {
      id: "7",
      name: "Recharge Électronique",
      category: "numérique",
      price: 0,
      stock: 999,
      image: "https://i.imgur.com/9QZ6xWv.jpg",
    },
    {
      id: "8",
      name: "Abonnement Fibre 100Mbps",
      category: "numérique",
      price: 15000,
      stock: 200,
      image: "https://i.imgur.com/3sK5WQr.jpg",
    },
    {
      id: "9",
      name: "Forfait Illimité Appels",
      category: "numérique",
      price: 20000,
      stock: 500,
      image: "https://i.imgur.com/7bNqFfT.jpg",
    },
    {
      id: "10",
      name: "Modem ADSL Celtiis",
      category: "physique",
      price: 29900,
      stock: 7,
      image: "https://i.imgur.com/vKz4YhJ.jpg",
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as "all" | "physique" | "numérique")
  }

 

  const toggleDropdown = (productId: string) => {
    setDropdownOpen(dropdownOpen === productId ? null : productId)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catalogue Produits</h1>
            <p className="text-gray-600 mt-1">Visualisez l'ensemble des produits</p>
          </div>
          
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total produits</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produits physiques</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter((p) => p.category === "physique").length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <FileDigit className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produits numériques</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter((p) => p.category === "numérique").length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recherche et filtres */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recherche et filtres</h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
            title="Filtrer par catégorie"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">Toutes catégories</option>
              <option value="physique">Physique</option>
              <option value="numérique">Numérique</option>
            </select>
          </div>
        </div>

        {/* Tableau des produits */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Produits en stock ({filteredProducts.length})
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600 text-center max-w-md">
                Aucun produit ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix (FCFA)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-lg border border-gray-200">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                      
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            product.category === "physique"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {product.price > 0 ? (
                          <span>{product.price.toLocaleString()} FCFA</span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Gratuit
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.stock > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-green-600 font-medium">Disponible ({product.stock})</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span className="text-red-600 font-medium">Rupture</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(product.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Actions"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-600" />
                          </button>
                          {dropdownOpen === product.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                              <button
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                onClick={() => {
                                  console.log("Voir détails", product.id)
                                  setDropdownOpen(null)
                                }}
                              >
                                <FileDigit className="mr-2 h-4 w-4" />
                                Voir détails
                              </button>
                              <button
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                onClick={() => {
                                  console.log("Télécharger fiche", product.id)
                                  setDropdownOpen(null)
                                }}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger fiche
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
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

export default CatalogueProduit
