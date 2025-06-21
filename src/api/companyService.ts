import apiClient from './config';

// Types pour les réponses de l'API
export interface Company {
  id: string;
  name: string;
  address?: string;
  industry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  pointOfSale?: {
    id: string;
    name: string;
    location: string;
  };
}

export interface PointOfSale {
  id: string;
  name: string;
  location: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    users: number;
    sales: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  isActive: boolean;
  createdAt: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  address?: string;
  industry?: string;
  createdAt: string;
  updatedAt: string;
  users: User[];
  pointOfSales: PointOfSale[];
  products: Product[];
}

export interface CompanyStatistics {
  totalUsers: number;
  activeUsers: number;
  totalPointOfSales: number;
  totalProducts: number;
  activeProducts: number;
  usersByRole: {
    admin: number;
    manager: number;
    commercial: number;
  };
}

export interface CompanyProfileResponse {
  message: string;
  company: CompanyProfile;
  statistics: CompanyStatistics;
}

export interface CompanyInfoResponse {
  company: Company & {
    users: User[];
  };
}

export interface UpdateCompanyRequest {
  companyName: string;
  companyAddress: string;
  industry: string;
}

export interface UpdateCompanyResponse {
  message: string;
  company: Company;
}

export interface EmployeesResponse {
  message: string;
  employees: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalEmployees: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    role?: string;
    pointOfSaleId?: string;
    isActive?: boolean;
    search?: string;
  };
}

export interface AddUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'commercial';
  pointOfSaleId?: string;
}

export interface AddUserResponse {
  message: string;
  user: User;
}

class CompanyService {
  /**
   * Récupérer le profil complet de l'entreprise avec statistiques
   * Route: GET /api/auth/company-profile
   */
  async getCompanyProfile(): Promise<CompanyProfileResponse> {
    try {
      const response = await apiClient.get<CompanyProfileResponse>('/auth/company-profile');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur de connexion au serveur');
    }
  }

  /**
   * Récupérer les informations de base de l'entreprise
   * Route: GET /api/auth/company-info
   */
  async getCompanyInfo(): Promise<CompanyInfoResponse> {
    try {
      const response = await apiClient.get<CompanyInfoResponse>('/auth/company-info');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur de connexion au serveur');
    }
  }

  /**
   * Mettre à jour les informations de l'entreprise
   * Route: PUT /api/auth/updateCompany
   */
  async updateCompanyInfo(data: UpdateCompanyRequest): Promise<UpdateCompanyResponse> {
    try {
      const response = await apiClient.put<UpdateCompanyResponse>('/auth/updateCompany', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur de connexion au serveur');
    }
  }

  /**
   * Récupérer tous les employés avec filtres et pagination
   * Route: GET /api/auth/getAllEmployees
   */
  async getAllEmployees(params?: {
    role?: 'admin' | 'manager' | 'commercial';
    pointOfSaleId?: string;
    isActive?: 'true' | 'false';
    search?: string;
    page?: string;
    limit?: string;
  }): Promise<EmployeesResponse> {
    try {
      const response = await apiClient.get<EmployeesResponse>('/auth/getAllEmployees', { params });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur de connexion au serveur');
    }
  }

  /**
   * Ajouter un nouvel utilisateur à l'entreprise
   * Route: POST /api/auth/addUserToCompany
   */
  async addUserToCompany(userData: AddUserRequest): Promise<AddUserResponse> {
    try {
      const response = await apiClient.post<AddUserResponse>('/auth/addUserToCompany', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur de connexion au serveur');
    }
  }

  /**
   * Récupérer les statistiques de l'entreprise (version légère)
   */
  async getCompanyStatistics(): Promise<CompanyStatistics> {
    try {
      const response = await this.getCompanyProfile();
      return response.statistics;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Récupérer uniquement les utilisateurs actifs
   */
  async getActiveEmployees(): Promise<User[]> {
    try {
      const response = await this.getAllEmployees({ isActive: 'true' });
      return response.employees;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Récupérer les employés par rôle
   */
  async getEmployeesByRole(role: 'admin' | 'manager' | 'commercial'): Promise<User[]> {
    try {
      const response = await this.getAllEmployees({ role });
      return response.employees;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Rechercher des employés par nom ou email
   */
  async searchEmployees(searchTerm: string): Promise<User[]> {
    try {
      const response = await this.getAllEmployees({ search: searchTerm });
      return response.employees;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Vérifier si l'entreprise a des données complètes
   */
  isCompanyProfileComplete(company: Company): boolean {
    return !!(company.name && company.address && company.industry);
  }

  /**
   * Formater les données pour la mise à jour
   */
  formatUpdateData(company: Company): UpdateCompanyRequest {
    return {
      companyName: company.name,
      companyAddress: company.address || '',
      industry: company.industry || ''
    };
  }

  /**
   * Obtenir un résumé rapide de l'entreprise
   */
  async getCompanySummary(): Promise<{
    name: string;
    totalUsers: number;
    totalPointOfSales: number;
    totalProducts: number;
  }> {
    try {
      const response = await this.getCompanyProfile();
      return {
        name: response.company.name,
        totalUsers: response.statistics.totalUsers,
        totalPointOfSales: response.statistics.totalPointOfSales,
        totalProducts: response.statistics.totalProducts
      };
    } catch (error: any) {
      throw error;
    }
  }
}

// Export d'une instance unique
export default new CompanyService();