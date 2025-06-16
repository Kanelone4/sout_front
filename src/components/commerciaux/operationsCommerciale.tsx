import { useState } from "react";
import { PlusCircle, FileBarChart2, X } from "lucide-react";
import { ajouterVente } from "../activites/activites"
import { ajouterRapport } from "../rapports/rapports";

// Données des produits avec leurs prix unitaires
const produits = [
  { id: "pocket_wifi", nom: "Pocket WiFi 4G", prix: 89900 },
  { id: "fibre_optique", nom: "Kit Fibre Optique", prix: 59900 },
  { id: "carte_sim", nom: "Carte SIM Celtiis", prix: 2500 },
  { id: "forfait_mobile", nom: "Forfait Mobile", prix: 15000 },
];

export const OperationsCommerciales = () => {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Données de formulaire de vente
  const [saleData, setSaleData] = useState({
    client: "",
    produit: "",
    quantite: 1,
    montant: 0,
    notes: ""
  });

  // Données de formulaire de rapport
  const [reportData, setReportData] = useState({
    commercial: "",
    date: "",
    dateRapport: new Date().toISOString().split('T')[0], // Date actuelle au format YYYY-MM-DD,
    produitsVendus: "",
    chiffreAffaires: "",
    observations: "",
    objectifsAtteints: ""
  });

  // Calcul du montant total lorsque le produit ou la quantité change
  const updateMontant = (produitId: string, quantite: number) => {
    const produitSelectionne = produits.find(p => p.id === produitId);
    if (produitSelectionne) {
      return produitSelectionne.prix * quantite;
    }
    return 0;
  };

 const handleSaleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const nouvelleVente = {
    client: saleData.client,
    produit: produits.find(p => p.id === saleData.produit)?.nom || saleData.produit,
    quantite: saleData.quantite,
    montant: saleData.montant,
    notes: saleData.notes
  };
  ajouterVente(nouvelleVente); 
  setShowSaleModal(false);
};

  const handleReportSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  ajouterRapport(reportData); // 
  setShowReportModal(false);
};

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">Opérations Commerciales</h1>
      
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <OperationCard
            icon={<PlusCircle className="h-10 w-10 text-blue-600" />}
            title="Enregistrer une Vente"
            description="Créer une nouvelle transaction commerciale"
            buttonText="Commencer"
            onClick={() => setShowSaleModal(true)}
          />
          
          <OperationCard
            icon={<FileBarChart2 className="h-10 w-10 text-purple-600" />}
            title="Rapport de Ventes"
            description="Générer des rapports d'activité commerciale"
            buttonText="Générer"
            variant="outline"
            onClick={() => setShowReportModal(true)}
          />
        </div>
      </div>

      {/* Modal Enregistrement Vente */}
      {showSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Nouvelle Vente</h2>
              <button onClick={() => setShowSaleModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Nom du client ou numéro"
                  value={saleData.client}
                  onChange={(e) => setSaleData({...saleData, client: e.target.value})}
                  required
                />
              </div>

              <div>
                <label htmlFor="produit" className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                <select
                id="produit"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={saleData.produit}
                  onChange={(e) => {
                    const newProduit = e.target.value;
                    const newMontant = updateMontant(newProduit, saleData.quantite);
                    setSaleData({
                      ...saleData,
                      produit: newProduit,
                      montant: newMontant
                    });
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
                  <label htmlFor="quantite" className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                  <input
                  id="quantite"
                    type="number"
                    min="1"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={saleData.quantite}
                    onChange={(e) => {
                      const newQuantite = parseInt(e.target.value) || 1;
                      const newMontant = updateMontant(saleData.produit, newQuantite);
                      setSaleData({
                        ...saleData,
                        quantite: newQuantite,
                        montant: newMontant
                      });
                    }}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-1">Montant Total (FCFA)</label>
                  <input
                  id="montant"
                    type="text"
                    className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50"
                    value={saleData.montant.toLocaleString()}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Informations supplémentaires..."
                  value={saleData.notes}
                  onChange={(e) => setSaleData({...saleData, notes: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSaleModal(false)}
                  className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Rapport Commercial</h2>
              <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Commercial</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Votre nom"
                  value={reportData.commercial}
                  onChange={(e) => setReportData({...reportData, commercial: e.target.value})}
                  required
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date du rapport</label>
                <input
                  id="date"
                  type="date"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={reportData.date}
                  onChange={(e) => setReportData({...reportData, date: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produits vendus</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Détail des produits vendus (quantités, références...)"
                  value={reportData.produitsVendus}
                  onChange={(e) => setReportData({...reportData, produitsVendus: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chiffre d'affaires (FCFA)</label>
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Montant total des ventes"
                  value={reportData.chiffreAffaires}
                  onChange={(e) => setReportData({...reportData, chiffreAffaires: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objectifs atteints</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Pourcentage d'objectif atteint, performances..."
                  value={reportData.objectifsAtteints}
                  onChange={(e) => setReportData({...reportData, objectifsAtteints: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Remarques, difficultés rencontrées, suggestions..."
                  value={reportData.observations}
                  onChange={(e) => setReportData({...reportData, observations: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
                >
                  Générer rapport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const OperationCard = ({
  icon,
  title,
  description,
  buttonText,
  variant = "default",
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  variant?: "default" | "outline";
  onClick: () => void;
}) => {
  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col items-center text-center h-full">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6 flex-grow">{description}</p>
        <button
          onClick={onClick}
          className={`px-4 py-2 rounded-md text-sm font-medium w-full max-w-xs ${
            variant === "default"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};