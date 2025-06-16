import { useState, useEffect } from "react";
import { Calendar, User, Package, Hash, DollarSign, MessageSquare } from "lucide-react";

type Vente = {
  id: string;
  date: Date;
  client: string;
  produit: string;
  quantite: number;
  montant: number;
  notes: string;
};

// Déclaration de la fonction en dehors du composant pour pouvoir l'exporter
export const ajouterVente = (nouvelleVente: Omit<Vente, 'id' | 'date'>) => {
  const venteComplete: Vente = {
    ...nouvelleVente,
    id: crypto.randomUUID(),
    date: new Date()
  };

  const savedVentes = localStorage.getItem('historiqueVentes');
  const existingVentes = savedVentes ? JSON.parse(savedVentes) : [];
  
  const nouvellesVentes = [venteComplete, ...existingVentes];
  localStorage.setItem('historiqueVentes', JSON.stringify(nouvellesVentes));
  
  return venteComplete;
};

export const Activites = () => {
  const [ventes, setVentes] = useState<Vente[]>([]);

  // Charger les ventes depuis le localStorage au montage
  useEffect(() => {
    const savedVentes = localStorage.getItem('historiqueVentes');
    if (savedVentes) {
      try {
        const parsedVentes = JSON.parse(savedVentes).map((v: { date: string }) => ({
          ...v,
          date: new Date(v.date)
        }));
        setVentes(parsedVentes);
      } catch (error) {
        console.error("Erreur lors du chargement des ventes:", error);
      }
    }
  }, []);

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Historique des Ventes</h1>
      
      {ventes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune vente enregistrée
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium">
            <div className="col-span-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Client</span>
            </div>
            <div className="col-span-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Produit</span>
            </div>
            <div className="col-span-1 flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span>Qté</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Montant</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Notes</span>
            </div>
          </div>

          <div className="divide-y">
            {ventes.map((vente) => (
              <div key={vente.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
                <div className="col-span-2 text-sm">
                  {formatDate(vente.date)}
                </div>
                <div className="col-span-2 text-sm">
                  {vente.client}
                </div>
                <div className="col-span-3 text-sm">
                  {vente.produit}
                </div>
                <div className="col-span-1 text-sm">
                  {vente.quantite}
                </div>
                <div className="col-span-2 text-sm">
                  {vente.montant.toLocaleString()} FCFA
                </div>
                <div className="col-span-2 text-sm truncate">
                  {vente.notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};