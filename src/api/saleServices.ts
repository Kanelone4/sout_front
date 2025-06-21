import apiClient from './config';

// Interfaces
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  companyId: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  assignedUserId: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SalePointOfSale {
  id: string;
  name: string;
  location: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  customerId: string;
  userId: string;
  pointOfSaleId: string;
  totalAmount: string;
  saleDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
  saleItems: SaleItem[];
  customer: Customer;
  user: SaleUser;
  pointOfSale: SalePointOfSale;
}

export interface CreateSaleItemRequest {
  productId: string;
  quantity: number;
  unitPrice: string;
}

export interface CreateSaleRequest {
  customerId: string;
  pointOfSaleId: string;
  totalAmount: string;
  saleDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  saleItems: CreateSaleItemRequest[];
}

export interface SalesResponse {
  data: Sale[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  error?: string;
  errors?: Array<{
    code: string;
    path: string[];
    message: string;
  }>;
}

export interface SalesByPOSStats {
  pointOfSaleId: string;
  pointOfSaleName: string;
  totalSales: number;
  totalAmount: number;
  completedSales: number;
  pendingSales: number;
  cancelledSales: number;
}

class SalesService {
  // Créer une nouvelle vente
  async createSale(saleData: CreateSaleRequest): Promise<Sale> {
    try {
      const response = await apiClient.post<Sale>('/sales', saleData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Erreur lors de la création de la vente');
    }
  }

  // Récupérer toutes les ventes avec pagination
  async getAllSales(page: number = 1, limit: number = 10): Promise<SalesResponse> {
    try {
      const response = await apiClient.get<SalesResponse>(`/sales?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Erreur lors de la récupération des ventes');
    }
  }

  // Récupérer une vente par ID
  async getSaleById(id: string): Promise<Sale> {
    try {
      const response = await apiClient.get<Sale>(`/sales/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Erreur lors de la récupération de la vente');
    }
  }

  // Fonctions utilitaires pour les statistiques
  getSalesByPOS(sales: Sale[]): SalesByPOSStats[] {
    const salesByPOS = new Map<string, SalesByPOSStats>();

    sales.forEach(sale => {
      const posId = sale.pointOfSaleId;
      const posName = sale.pointOfSale.name;
      
      if (!salesByPOS.has(posId)) {
        salesByPOS.set(posId, {
          pointOfSaleId: posId,
          pointOfSaleName: posName,
          totalSales: 0,
          totalAmount: 0,
          completedSales: 0,
          pendingSales: 0,
          cancelledSales: 0
        });
      }

      const posStats = salesByPOS.get(posId)!;
      posStats.totalSales += 1;
      posStats.totalAmount += parseFloat(sale.totalAmount);

      switch (sale.status) {
        case 'completed':
          posStats.completedSales += 1;
          break;
        case 'pending':
          posStats.pendingSales += 1;
          break;
        case 'cancelled':
          posStats.cancelledSales += 1;
          break;
      }
    });

    return Array.from(salesByPOS.values());
  }

  // Calculer le total des ventes
  getTotalSalesAmount(sales: Sale[]): number {
    return sales.reduce((total, sale) => total + parseFloat(sale.totalAmount), 0);
  }

  // Compter les ventes par statut
  getSalesCountByStatus(sales: Sale[]): { completed: number; pending: number; cancelled: number } {
    return sales.reduce(
      (counts, sale) => {
        counts[sale.status] += 1;
        return counts;
      },
      { completed: 0, pending: 0, cancelled: 0 }
    );
  }

  // Formater le montant en devise
  formatAmount(amount: string | number): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF', // Franc CFA
      minimumFractionDigits: 0
    }).format(numAmount);
  }

  // Formater la date de vente
  formatSaleDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Formater la date courte
  formatDateShort(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Obtenir le libellé du statut
  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'pending': 'En attente',
      'completed': 'Terminée',
      'cancelled': 'Annulée'
    };
    return statusLabels[status] || status;
  }

  // Obtenir la couleur du statut
  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }

  // Calculer le nombre total d'articles dans une vente
  getTotalItemsCount(sale: Sale): number {
    return sale.saleItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Valider les données de vente
  validateSaleData(data: CreateSaleRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.customerId) {
      errors.push('Le client est requis');
    }

    if (!data.pointOfSaleId) {
      errors.push('Le point de vente est requis');
    }

    if (!data.totalAmount || parseFloat(data.totalAmount) <= 0) {
      errors.push('Le montant total doit être supérieur à 0');
    }

    if (!data.saleDate) {
      errors.push('La date de vente est requise');
    }

    if (!data.saleItems || data.saleItems.length === 0) {
      errors.push('Au moins un article est requis');
    }

    if (data.saleItems) {
      data.saleItems.forEach((item, index) => {
        if (!item.productId) {
          errors.push(`Produit requis pour l'article ${index + 1}`);
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Quantité invalide pour l'article ${index + 1}`);
        }
        if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) {
          errors.push(`Prix unitaire invalide pour l'article ${index + 1}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new SalesService();