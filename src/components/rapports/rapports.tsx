import { useState, useEffect } from "react";
import { Calendar, User, DollarSign, Target, ChevronRight } from "lucide-react";

type Rapport = {
  id: string;
  dateCreation: Date;
  dateRapport: string;
  commercial: string;
  produitsVendus: string;
  chiffreAffaires: string;
  observations: string;
  objectifsAtteints: string;
};

// Déclaration de la fonction en dehors du composant pour pouvoir l'exporter
export const ajouterRapport = (nouveauRapport: Omit<Rapport, 'id' | 'dateCreation'>) => {
  const rapportComplete: Rapport = {
    ...nouveauRapport,
    id: crypto.randomUUID(),
    dateCreation: new Date()
  };

  const savedRapports = localStorage.getItem('historiqueRapports');
  const existingRapports = savedRapports ? JSON.parse(savedRapports) : [];
  
  const nouveauxRapports = [rapportComplete, ...existingRapports];
  localStorage.setItem('historiqueRapports', JSON.stringify(nouveauxRapports));
  
  return rapportComplete;
};

export const Rapports = () => {
  const [rapports, setRapports] = useState<Rapport[]>([]);

  // Charger les rapports depuis le localStorage au montage
  useEffect(() => {
    const savedRapports = localStorage.getItem('historiqueRapports');
    if (savedRapports) {
      try {
        const parsedRapports = JSON.parse(savedRapports).map((r: { dateCreation: string }) => ({
          ...r,
          dateCreation: new Date(r.dateCreation)
        }));
        setRapports(parsedRapports);
      } catch (error) {
        console.error("Erreur lors du chargement des rapports:", error);
      }
    }
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Historique des Rapports</h1>
      
      {rapports.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun rapport enregistré
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium">
            <div className="col-span-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Créé le</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Commercial</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Période</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>CA (FCFA)</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Objectifs</span>
            </div>
            <div className="col-span-2"></div>
          </div>

          <div className="divide-y">
            {rapports.map((rapport) => (
              <div key={rapport.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
                <div className="col-span-2 text-sm">
                  {formatDate(rapport.dateCreation)}
                </div>
                <div className="col-span-2 text-sm">
                  {rapport.commercial}
                </div>
                <div className="col-span-2 text-sm">
                  {rapport.dateRapport}
                </div>
                <div className="col-span-2 text-sm">
                  {rapport.chiffreAffaires}
                </div>
                <div className="col-span-2 text-sm">
                  {rapport.objectifsAtteints}
                </div>
                <div className="col-span-2 text-sm flex justify-end">
                  <button 
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    onClick={() => {
                      alert(`Détail du rapport:\n\nProduits vendus: ${rapport.produitsVendus}\n\nObservations: ${rapport.observations}`);
                    }}
                  >
                    <span>Voir</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};