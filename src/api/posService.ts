import apiClient from './config';

// Interfaces
export interface PointOfSale {
  id: string;
  name: string;
  location: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  users?: POSUser[];
  _count?: {
    users: number;
    sales: number;
  };
}

export interface POSUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface CreatePOSRequest {
  name: string;
  location: string;
}

export interface POSResponse {
  count: number;
  data: PointOfSale[];
}

export interface ApiError {
  error?: string;
  errors?: Array<{
    code: string;
    path: string[];
    message: string;
  }>;
}

class POSService {
  // Créer un nouveau point de vente
  async createPOS(posData: CreatePOSRequest): Promise<PointOfSale> {
    try {
      const response = await apiClient.post<PointOfSale>('/pos', posData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Erreur lors de la création du point de vente');
    }
  }

  // Récupérer tous les points de vente de l'entreprise
  async getAllPOS(): Promise<PointOfSale[]> {
    try {
      const response = await apiClient.get<POSResponse>('/pos');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Erreur lors de la récupération des points de vente');
    }
  }

  // Fonctions utilitaires
  formatAddress(location: string): string {
    return location.trim();
  }

  getUsersCount(pos: PointOfSale): number {
    return pos._count?.users || 0;
  }

  getSalesCount(pos: PointOfSale): number {
    return pos._count?.sales || 0;
  }

  getActiveUsersCount(pos: PointOfSale): number {
    return pos.users?.filter(user => user.isActive).length || 0;
  }

  formatCreatedDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Valider les données avant envoi
  validatePOSData(data: CreatePOSRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Le nom du point de vente doit contenir au moins 2 caractères');
    }

    if (!data.location || data.location.trim().length < 5) {
      errors.push('L\'adresse doit contenir au moins 5 caractères');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new POSService();