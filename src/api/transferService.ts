import apiClient from './config';

// Interfaces pour les transferts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface TransferItem {
  id: string;
  transferId: string;
  productId: string;
  qty: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Transfer {
  id: string;
  companyId: string;
  userId: string;
  transferDate: string;
  createdAt: string;
  updatedAt: string;
  transferItems: TransferItem[];
  company: Company;
  user: User;
  destinationPointOfSale?: string;
  pointOfSaleId?: string;
  stockVerifications?: StockVerification[];
}

export interface CreateTransferItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateTransferRequest {
  companyId?: string;
  userId?: string;
  pointOfSaleId: string;
  transferDate?: string;
  notes?: string;
  transferItems: CreateTransferItemRequest[];
}

export interface TransfersResponse {
  data: Transfer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface StockProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  totalStock: number;
  transferredStock: number;
  availableStock: number;
  stockStatus: 'disponible' | 'épuisé';
}

export interface AvailableStockResponse {
  company: {
    id: string;
    name: string;
  };
  products: StockProduct[];
  summary: {
    totalProducts: number;
    productsWithStock: number;
    outOfStock: number;
  };
}

export interface StockVerification {
  productId: string;
  productName: string;
  requestedQty?: number;
  totalStock: number;
  transferredStock: number;
  availableStock: number;
  hasEnoughStock: boolean;
  quantitéTransférée?: number;
  stockRestant?: number;
}

export interface ApiError {
  error?: string;
  details?: Array<{
    productId: string;
    productName: string;
    demandé: number;
    disponible: number;
    stockTotal: number;
    déjàTransféré: number;
  }>;
  errors?: Array<{
    code: string;
    path: string[];
    message: string;
  }>;
}

export interface PointOfSale {
  id: string;
  name: string;
  location: string;
  companyId: string;
}

class TransferService {
  // Créer un nouveau transfert
  async createTransfer(transferData: CreateTransferRequest): Promise<Transfer> {
    try {
      const response = await apiClient.post<{
        message: string;
        data: Transfer;
      }>('/transfers', transferData);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Erreur lors de la création du transfert');
    }
  }

  // Récupérer tous les transferts avec pagination
  async getAllTransfers(
    page: number = 1,
    limit: number = 10,
    filters?: {
      companyId?: string;
      userId?: string;
      pointOfSaleId?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<TransfersResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
     
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const response = await apiClient.get<TransfersResponse>(`/transfers?${params}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Erreur lors de la récupération des transferts');
    }
  }

  // Récupérer un transfert par ID
  async getTransferById(id: string): Promise<Transfer> {
    try {
      const response = await apiClient.get<{ data: Transfer }>(`/transfers/${id}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Erreur lors de la récupération du transfert');
    }
  }

  // Récupérer le stock disponible pour transfert
  async getAvailableStock(companyId: string): Promise<AvailableStockResponse> {
    try {
      const response = await apiClient.get<{ data: AvailableStockResponse }>(`/transfers/stock/${companyId}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Erreur lors de la récupération du stock disponible');
    }
  }

  // Récupérer tous les points de vente d'une compagnie
async getPointsOfSale(): Promise<PointOfSale[]> {
  try {
    const response = await apiClient.get<{ data: PointOfSale[] }>('/pos');
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiError;
    }
    throw new Error('Erreur lors de la récupération des points de vente');
  }
}


  // Fonctions utilitaires pour les calculs
  getTotalQuantityTransferred(transfer: Transfer): number {
    return transfer.transferItems.reduce((total, item) => total + item.qty, 0);
  }

  getTotalItemsCount(transfer: Transfer): number {
    return transfer.transferItems.length;
  }

  // Calculer la valeur totale d'un transfert
  getTotalValue(transfer: Transfer): number {
    return transfer.transferItems.reduce((total, item) => {
      return total + (item.qty * item.product.price);
    }, 0);
  }

  // Calculer les statistiques d'un stock disponible
  calculateStockStats(stockData: AvailableStockResponse) {
    const totalValue = stockData.products.reduce((sum, product) => {
      return sum + (product.availableStock * product.price);
    }, 0);

    const lowStockProducts = stockData.products.filter(p => p.availableStock > 0 && p.availableStock < 10).length;
    
    const transferRate = stockData.products.reduce((sum, p) => sum + p.totalStock, 0) > 0 ?
      (stockData.products.reduce((sum, p) => sum + p.transferredStock, 0) /
       stockData.products.reduce((sum, p) => sum + p.totalStock, 0)) * 100 : 0;

    return {
      totalProducts: stockData.summary.totalProducts,
      productsWithStock: stockData.summary.productsWithStock,
      outOfStock: stockData.summary.outOfStock,
      lowStockProducts,
      totalAvailableStock: stockData.products.reduce((sum, p) => sum + p.availableStock, 0),
      totalValue,
      transferRate: Math.round(transferRate)
    };
  }

  // Formater les dates
  formatTransferDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateShort(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Formater les montants
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Obtenir le statut de stock avec couleur
  getStockStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'disponible': 'bg-green-100 text-green-800',
      'épuisé': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }

  // Obtenir le libellé du statut de stock
  getStockStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'disponible': 'Disponible',
      'épuisé': 'Épuisé'
    };
    return statusLabels[status] || status;
  }

  // Valider les données de transfert
  validateTransferData(data: CreateTransferRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // if (!data.companyId) {
    //   errors.push('L\'ID de l\'entreprise est requis');
    // }

    // if (!data.userId) {
    //   errors.push('L\'ID de l\'utilisateur est requis');
    // }

    if (!data.pointOfSaleId) {
      errors.push('Le point de vente de destination est requis');
    }

    if (!data.transferItems || data.transferItems.length === 0) {
      errors.push('Au moins un article est requis pour le transfert');
    }

    if (data.transferItems) {
      data.transferItems.forEach((item, index) => {
        if (!item.productId) {
          errors.push(`Produit requis pour l'article ${index + 1}`);
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Quantité invalide pour l'article ${index + 1}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Obtenir les transferts groupés par produit
  getTransfersByProduct(transfers: Transfer[]): { [productId: string]: {
    productName: string;
    totalQty: number;
    transferCount: number;
    totalValue: number;
  }} {
    const transfersByProduct: { [productId: string]: {
      productName: string;
      totalQty: number;
      transferCount: number;
      totalValue: number;
    }} = {};

    transfers.forEach(transfer => {
      transfer.transferItems.forEach(item => {
        if (!transfersByProduct[item.productId]) {
          transfersByProduct[item.productId] = {
            productName: item.product.name,
            totalQty: 0,
            transferCount: 0,
            totalValue: 0
          };
        }

        transfersByProduct[item.productId].totalQty += item.qty;
        transfersByProduct[item.productId].transferCount += 1;
        transfersByProduct[item.productId].totalValue += item.qty * item.product.price;
      });
    });

    return transfersByProduct;
  }

  // Obtenir les transferts par période
  getTransfersByPeriod(transfers: Transfer[], period: 'day' | 'week' | 'month' = 'month') {
    const transfersByPeriod: { [key: string]: {
      count: number;
      totalQty: number;
      totalValue: number;
      transfers: Transfer[];
    }} = {};

    transfers.forEach(transfer => {
      const date = new Date(transfer.transferDate);
      let key: string;

      switch (period) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!transfersByPeriod[key]) {
        transfersByPeriod[key] = {
          count: 0,
          totalQty: 0,
          totalValue: 0,
          transfers: []
        };
      }

      transfersByPeriod[key].count += 1;
      transfersByPeriod[key].totalQty += this.getTotalQuantityTransferred(transfer);
      transfersByPeriod[key].totalValue += this.getTotalValue(transfer);
      transfersByPeriod[key].transfers.push(transfer);
    });

    return transfersByPeriod;
  }

  // Obtenir les alertes de stock faible
  getStockAlerts(stockData: AvailableStockResponse): {
    outOfStock: StockProduct[];
    lowStock: StockProduct[];
    criticalAlerts: number;
  } {
    const outOfStock = stockData.products.filter(p => p.availableStock === 0);
    const lowStock = stockData.products.filter(p => p.availableStock > 0 && p.availableStock < 10);
   
    return {
      outOfStock,
      lowStock,
      criticalAlerts: outOfStock.length + lowStock.filter(p => p.availableStock < 5).length
    };
  }

  // Calculer le taux de rotation des stocks
  calculateStockTurnover(stockData: AvailableStockResponse): {
    averageTurnover: number;
    fastMoving: StockProduct[];
    slowMoving: StockProduct[];
  } {
    const fastMoving = stockData.products.filter(p => {
      const turnoverRate = p.totalStock > 0 ? (p.transferredStock / p.totalStock) * 100 : 0;
      return turnoverRate > 70;
    });

    const slowMoving = stockData.products.filter(p => {
      const turnoverRate = p.totalStock > 0 ? (p.transferredStock / p.totalStock) * 100 : 0;
      return turnoverRate < 30 && p.totalStock > 0;
    });

    const averageTurnover = stockData.products.length > 0 ?
      stockData.products.reduce((sum, p) => {
        const rate = p.totalStock > 0 ? (p.transferredStock / p.totalStock) * 100 : 0;
        return sum + rate;
      }, 0) / stockData.products.length : 0;

    return {
      averageTurnover: Math.round(averageTurnover),
      fastMoving,
      slowMoving
    };
  }

  // Préparer les données pour les graphiques
  prepareChartData(transfers: Transfer[], period: 'month' | 'week' = 'month') {
    const transfersByPeriod = this.getTransfersByPeriod(transfers, period);
   
    const chartData = Object.entries(transfersByPeriod)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, data]) => ({
        period,
        transferts: data.count,
        quantité: data.totalQty,
        valeur: data.totalValue,
        date: period
      }));

    return chartData;
  }

  // Générer un rapport de transfert
  generateTransferReport(transfers: Transfer[]): {
    summary: {
      totalTransfers: number;
      totalQuantity: number;
      totalValue: number;
      averageTransferValue: number;
      mostTransferredProduct: string;
    };
    details: {
      byProduct: ReturnType<TransferService['getTransfersByProduct']>;
      byPeriod: ReturnType<TransferService['getTransfersByPeriod']>;
    };
  } {
    const totalTransfers = transfers.length;
    const totalQuantity = transfers.reduce((sum, t) => sum + this.getTotalQuantityTransferred(t), 0);
    const totalValue = transfers.reduce((sum, t) => sum + this.getTotalValue(t), 0);
    const averageTransferValue = totalTransfers > 0 ? totalValue / totalTransfers : 0;

    const byProduct = this.getTransfersByProduct(transfers);
    const mostTransferredProduct = Object.entries(byProduct)
      .sort(([,a], [,b]) => b.totalQty - a.totalQty)[0]?.[1]?.productName || 'Aucun';

    return {
      summary: {
        totalTransfers,
        totalQuantity,
        totalValue,
        averageTransferValue,
        mostTransferredProduct
      },
      details: {
        byProduct,
        byPeriod: this.getTransfersByPeriod(transfers)
      }
    };
  }

  // Gestion des erreurs spécifiques aux transferts
  handleTransferError(error: any): string {
    if (error.details && Array.isArray(error.details)) {
      // Erreur de stock insuffisant
      const stockErrors = error.details.map((detail: any) => 
        `${detail.productName}: demandé ${detail.demandé}, disponible ${detail.disponible}`
      ).join(', ');
      return `Stock insuffisant - ${stockErrors}`;
    }

    if (error.errors && Array.isArray(error.errors)) {
      // Erreurs de validation Zod
      return error.errors.map((err: any) => err.message).join(', ');
    }

    if (error.error) {
      return error.error;
    }

    return error.message || 'Une erreur est survenue lors du transfert';
  }

  // Calculer les suggestions de réapprovisionnement
  getRestockSuggestions(stockData: AvailableStockResponse): {
    urgent: StockProduct[];
    recommended: StockProduct[];
    suggestions: Array<{
      product: StockProduct;
      suggestedQuantity: number;
      reason: string;
    }>;
  } {
    const urgent = stockData.products.filter(p => p.availableStock === 0);
    const recommended = stockData.products.filter(p => p.availableStock > 0 && p.availableStock < 5);

    const suggestions = stockData.products
      .filter(p => p.availableStock < 20)
      .map(product => {
        let suggestedQuantity = 0;
        let reason = '';

        if (product.availableStock === 0) {
          suggestedQuantity = Math.max(50, product.transferredStock);
          reason = 'Stock épuisé - Réapprovisionnement urgent';
        } else if (product.availableStock < 5) {
          suggestedQuantity = Math.max(30, product.transferredStock);
          reason = 'Stock critique - Réapprovisionnement recommandé';
        } else if (product.availableStock < 20) {
          suggestedQuantity = Math.max(20, Math.floor(product.transferredStock * 0.5));
          reason = 'Stock faible - Envisager le réapprovisionnement';
        }

        return {
          product,
          suggestedQuantity,
          reason
        };
      })
      .filter(s => s.suggestedQuantity > 0);

    return {
      urgent,
      recommended,
      suggestions
    };
  }
}

export default new TransferService();