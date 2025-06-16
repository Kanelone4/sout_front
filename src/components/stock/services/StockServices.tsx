import type { ProduitStock, MouvementStock } from '../types/stock';

// Produits initiaux
const produitsInitiaux: ProduitStock[] = [
  {
    id: '1',
    nom: 'Pocket WiFi 4G',
    categorie: 'physique',
    quantite: 50,
    seuilReappro: 10,
    prixUnitaire: 89900,
    derniereMaj: new Date()
  },
  {
      id: "2",
      nom: "Kit Fibre Optique",
      categorie: "physique",
      quantite: 30,
      seuilReappro: 5,
      prixUnitaire: 129900,
      derniereMaj: new Date()
  },
  {
      id: "3",
      nom: "Carte SIM Celtiis",
      categorie: "physique",
      quantite: 120,
      seuilReappro: 20,
      prixUnitaire: 100,
      derniereMaj: new Date()
  },
  {
        id: "4",
        nom: "Modem 4G LTE",
        categorie: "physique",
        quantite: 25,
        seuilReappro: 5,
        prixUnitaire: 49900,
        derniereMaj: new Date()
  },
    {
      id: "5",
      nom: "Mobile Money Celtiis",
      categorie: "numérique",
      quantite: 'Disponible' ,
      seuilReappro: 100,
      prixUnitaire: 0,
      derniereMaj: new Date()   
    },
    {
      id: "6",
      nom: "Recharge Électronique",
      categorie: "numérique",
      quantite: 'Disponible',
      seuilReappro: 100,
      prixUnitaire: 0,
      derniereMaj: new Date()
    },
    {
      id: "7",
      nom: "Abonnement Fibre 100Mbps",
      categorie: "numérique",
      quantite: 'Disponible',
      seuilReappro: 50,
      prixUnitaire: 15000,
      derniereMaj: new Date()
    },
    {
      id: "8",
      nom: "Forfait Illimité Appels",
      categorie: "numérique",
      quantite: 'Disponible',
      seuilReappro: 100,
      prixUnitaire: 20000,
      derniereMaj: new Date()
    },
  {
    id: "9",
    nom: "Modem ADSL Celtiis",
    categorie: "physique",
    quantite: 7,
    seuilReappro: 2,
    prixUnitaire: 29900,
    derniereMaj: new Date()
  }
];

// Charger le stock depuis localStorage
export const getStock = (): ProduitStock[] => {
  const stock = localStorage.getItem('stock');
  return stock ? JSON.parse(stock) : produitsInitiaux;
};

// Enregistrer le stock
const saveStock = (stock: ProduitStock[]) => {
  localStorage.setItem('stock', JSON.stringify(stock));
};

// Mettre à jour le stock après une vente
// Utilitaire pour normaliser la quantité en nombre
export function parseQuantite(val: number | string): number {
  if (typeof val === 'string') {
    const n = parseInt(val, 10);
    return isNaN(n) ? 0 : n;
  }
  return val;
}

export const mettreAJourStockVente = (
  produitId: string,
  quantiteVente: number,
  utilisateur: string
): boolean => {
  const stock = getStock();
  const idx = stock.findIndex(p => p.id === produitId);
  if (idx === -1) return false;

  // on convertit toujours en nombre avant de soustraire
  const actuel = parseQuantite(stock[idx].quantite);
  const nouveauStock = actuel - quantiteVente;

  stock[idx].quantite = nouveauStock;
  stock[idx].derniereMaj = new Date();

  saveStock(stock);
  enregistrerMouvement({
    produitId,
    type: 'vente',
    quantite: -quantiteVente,
    utilisateur
  });

  return true;
};

// Réapprovisionner le stock
export const reapprovisionnerStock = (
  produitId: string,
  quantite: number,
  utilisateur: string
): boolean => {
  const stock = getStock();
  const idx = stock.findIndex(p => p.id === produitId);
  if (idx === -1) return false;

  // on convertit l'ancienne valeur et on ajoute
  const actuel = parseQuantite(stock[idx].quantite);
  const nouveauStock = actuel + quantite;

  stock[idx].quantite = nouveauStock;
  stock[idx].derniereMaj = new Date();

  saveStock(stock);
  enregistrerMouvement({
    produitId,
    type: 'reappro',
    quantite,
    utilisateur,
    notes: `Réapprovisionnement de ${quantite} unités`
  });

  return true;
};

// Enregistrer un mouvement de stock
const enregistrerMouvement = (mouvement: Omit<MouvementStock, 'id' | 'date'>) => {
  const mouvements: MouvementStock[] = JSON.parse(localStorage.getItem('mouvementsStock') || '[]');
  const nouveauMouvement: MouvementStock = {
    ...mouvement,
    id: crypto.randomUUID(),
    date: new Date()
  };
  
  localStorage.setItem('mouvementsStock', JSON.stringify([nouveauMouvement, ...mouvements]));
};

// Obtenir l'historique des mouvements
export const getMouvementsStock = (): MouvementStock[] => {
  const mouvements = localStorage.getItem('mouvementsStock');
  return mouvements ? JSON.parse(mouvements) : [];
};