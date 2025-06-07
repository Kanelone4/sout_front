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
    name: "Ordinateur Portable Elite",
    category: "physique",
    price: 1299.99,
    stock: 15,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200",
  },
  {
    id: "2",
    name: "Mobile Money",
    category: "numérique",
    price: 499.99,
    stock: 0,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200",
  },
  {
    id: "3",
    name: "Smartphone Premium",
    category: "physique",
    price: 899.99,
    stock: 8,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200",
  },
  {
    id: "4",
    name: "Logiciel Sécurité",
    category: "numérique",
    price: 199.99,
    stock: 50,
    image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=200",
  },
  {
    id: "5",
    name: "Écran 4K 27\"",
    category: "physique",
    price: 349.99,
    stock: 12,
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=200",
  },
  {
    id: "6",
    name: "Formation en Ligne",
    category: "numérique",
    price: 149.99,
    stock: 100,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200",
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
        <h1 className="text-2xl font-bold">Catalogue Produits</h1>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
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
                <td className="px-6 py-4 whitespace-nowrap">{product.price.toFixed(2)} €</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.stock > 0 ? (
                    <span className="text-green-600">{product.stock} en stock</span>
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