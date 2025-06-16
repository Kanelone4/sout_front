import { useState } from "react";
import { MoreHorizontal, FileDigit, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

type Product = {
  id: string;
  name: string;
  category: "physique" | "numérique";
  price: number;
  stock: number;
  image: string;
};

export const CatalogueProduit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "physique" | "numérique">("all");

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
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as "all" | "physique" | "numérique");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Catalogue Produits </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full sm:w-64 border rounded-md px-3 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border rounded-md px-3 py-2 text-sm"
            title="Filtrer par catégorie"
          >
            <option value="all">Toutes catégories</option>
            <option value="physique">Physique</option>
            <option value="numérique">Numérique</option>
          </select>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix (FCFA)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-md mr-3 object-cover"
                    />
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.category === "physique" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.price > 0 ? product.price.toLocaleString() + ' FCFA' : 'Gratuit'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.stock > 0 ? (
                    <span className="text-green-600">Disponible</span>
                  ) : (
                    <span className="text-red-600">Rupture</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button title="Actions" className="p-1 rounded-md hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white shadow-lg rounded-md p-1 border">
                      <DropdownMenuItem className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                        <FileDigit className="mr-2 h-4 w-4" />
                        <span>Voir détails</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                        <Download className="mr-2 h-4 w-4" />
                        <span>Télécharger fiche</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};