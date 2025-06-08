import { useNavigate } from "react-router-dom";
import { PlusCircle, Users, FileBarChart2 } from "lucide-react";

export const OperationsCommerciales = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Opérations Commerciales</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OperationCard
          icon={<PlusCircle className="h-10 w-10 text-blue-600" />}
          title="Enregistrer une Vente"
          description="Créer une nouvelle transaction commerciale"
          buttonText="Commencer"
          onClick={() => navigate("/commerciaux/operations/nouvelle-vente")}
        />
        
        <OperationCard
          icon={<Users className="h-10 w-10 text-green-600" />}
          title="Fiche Clients"
          description="Consulter l'historique des achats clients"
          buttonText="Voir liste"
          variant="outline"
          onClick={() => navigate("/commerciaux/operations/fiche-clients")}
        />
        
        <OperationCard
          icon={<FileBarChart2 className="h-10 w-10 text-purple-600" />}
          title="Rapport de Ventes"
          description="Générer des rapports d'activité commerciale"
          buttonText="Générer"
          variant="outline"
          onClick={() => navigate("/commerciaux/operations/rapport-ventes")}
        />
      </div>
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
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center text-center">
        {icon}
        <h3 className="text-lg font-semibold mt-3 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <button
          onClick={onClick}
          className={`px-4 py-2 rounded-md ${
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