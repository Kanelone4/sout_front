import { useState, useEffect } from 'react';
import { Package, PlusCircle, History, AlertTriangle } from 'lucide-react';
import {
  getStock,
  reapprovisionnerStock,
  getMouvementsStock,
  parseQuantite
} from '../stock/services/StockServices';
import type { ProduitStock, MouvementStock } from '../stock/types/stock';

export const Stock = () => {
  const [stock, setStock] = useState<ProduitStock[]>([]);
  const [mouvements, setMouvements] = useState<MouvementStock[]>([]);
  const [quantiteReappro, setQuantiteReappro] = useState<Record<string, number>>({});

  useEffect(() => {
    setStock(getStock());
    setMouvements(getMouvementsStock());
  }, []);

  const handleReappro = (produitId: string) => {
    if (!quantiteReappro[produitId] || quantiteReappro[produitId] <= 0) return;

    if (reapprovisionnerStock(produitId, quantiteReappro[produitId], 'Manager')) {
      setStock(getStock());
      setMouvements(getMouvementsStock());
      setQuantiteReappro(prev => ({ ...prev, [produitId]: 0 }));
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" /> Gestion du stock
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stock.map(produit => {
            // Normaliser la quantité pour les comparaisons
            const qteNum = parseQuantite(produit.quantite);
            const isLowStock = qteNum <= produit.seuilReappro;

            return (
              <div key={produit.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{produit.nom}</h3>
                    <p className="text-sm text-gray-600">{produit.categorie}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    isLowStock
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {produit.quantite} en stock
                  </span>
                </div>

                {isLowStock && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Stock faible - Seuil: {produit.seuilReappro}</span>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    className="border rounded px-2 py-1 text-sm w-20"
                    value={quantiteReappro[produit.id] || ''}
                    onChange={(e) => setQuantiteReappro(prev => ({
                      ...prev,
                      [produit.id]: parseInt(e.target.value) || 0
                    }))}
                    placeholder="Quantité"
                  />
                  <button
                    onClick={() => handleReappro(produit.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Réappro
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <History className="h-5 w-5" /> Historique des mouvements
        </h2>

        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium">
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Produit</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Quantité</div>
            <div className="col-span-3">Responsable</div>
          </div>

          <div className="divide-y">
            {mouvements.map(mvt => (
              <div key={mvt.id} className="grid grid-cols-12 gap-4 p-4">
                <div className="col-span-2 text-sm">
                  {new Date(mvt.date).toLocaleDateString('fr-FR')}
                </div>
                <div className="col-span-3 text-sm">
                  {stock.find(p => p.id === mvt.produitId)?.nom || mvt.produitId}
                </div>
                <div className="col-span-2 text-sm">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    mvt.type === 'vente'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {mvt.type === 'vente' ? 'Vente' : 'Réappro'}
                  </span>
                </div>
                <div className={`col-span-2 text-sm ${
                  mvt.type === 'vente' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {mvt.type === 'vente' ? '-' : '+'}{mvt.quantite}
                </div>
                <div className="col-span-3 text-sm">
                  {mvt.utilisateur}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
