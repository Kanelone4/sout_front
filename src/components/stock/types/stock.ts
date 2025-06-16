export type ProduitStock = {
  id: string;
  nom: string;
  categorie: 'physique' | 'numérique';
  quantite: number | string;
  seuilReappro: number;
  prixUnitaire: number;
  derniereMaj: Date;
};

export type MouvementStock = {
  id: string;
  produitId: string;
  type: 'vente' | 'reappro' | 'ajustement';
  quantite: number;
  date: Date;
  utilisateur: string;
  notes?: string;
};