import apiClient from './config';

// Interfaces
export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  isActive: boolean;
  availableStock: number;
  totalEntries: number;
  totalTransferred: number;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  companyEntries?: CompanyEntry[];
  transferItems?: TransferItem[];
}

export interface CompanyEntry {
  id: string;
  qtyAdded: number;
  date: string;
  productId: string;
  companyId: string;
}

export interface TransferItem {
  id: string;
  qty: number;
  productId: string;
  transferId: string;
  transfer: {
    transferDate: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price?: number;
  initialQty: number;
}

export interface AddStockRequest {
  productId: string;
  qtyAdded: number;
  date?: string;
}

export interface TransferStockRequest {
  productId: string;
  pointOfSaleId: string;
  qty: number;
  transferDate?: string;
}

export interface StockHistoryItem {
  type: 'ENTRY' | 'TRANSFER';
  date: string;
  quantity: number;
  description: string;
}

export interface StockHistoryResponse {
  product: Product;
  availableStock: number;
  history: StockHistoryItem[];
}

export interface ApiResponse<T = any> {
  message?: string;
  product?: T;
  companyEntry?: T;
  transferItem?: T;
  availableStock?: number;
  error?: string;
  errors?: Array<{
    code: string;
    path: string[];
    message: string;
  }>;
}

class ProductService {
  // Créer un nouveau produit avec stock initial
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      const response = await apiClient.post<ApiResponse<Product>>('/products', productData);
      return response.data.product!;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur lors de la création du produit');
    }
  }

  // Récupérer tous les produits avec stock
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>('/products');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur lors de la récupération des produits');
    }
  }

  // Récupérer un produit par ID
  async getProductById(productId: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(`/products/${productId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur lors de la récupération du produit');
    }
  }

  // Mettre à jour un produit
  async updateProduct(productId: string, updateData: Partial<CreateProductRequest>): Promise<Product> {
    try {
      const response = await apiClient.put<ApiResponse<Product>>(`/products/${productId}`, updateData);
      return response.data.product!;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur lors de la mise à jour du produit');
    }
  }

  // Désactiver un produit
  async deactivateProduct(productId: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${productId}`);
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur lors de la désactivation du produit');
    }
  }

  // Ajouter du stock à un produit
  async addStock(stockData: AddStockRequest): Promise<{ availableStock: number; companyEntry: CompanyEntry }> {
    try {
      const response = await apiClient.post<ApiResponse>('/products/add-stock', stockData);
      return {
        availableStock: response.data.availableStock!,
        companyEntry: response.data.companyEntry!
      };
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur lors de l\'ajout de stock');
    }
  }

  // Transférer du stock vers un point de vente
  async transferStock(transferData: TransferStockRequest): Promise<{ availableStock: number; transferItem: TransferItem }> {
    try {
      const response = await apiClient.post<ApiResponse>('/products/transfer-stock', transferData);
      return {
        availableStock: response.data.availableStock!,
        transferItem: response.data.transferItem!
      };
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur lors du transfert de stock');
    }
  }

  // Obtenir l'historique des mouvements de stock
  async getStockHistory(productId: string): Promise<StockHistoryResponse> {
    try {
      const response = await apiClient.get<StockHistoryResponse>(`/products/${productId}/stock-history`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Erreur lors de la récupération de l\'historique');
    }
  }

  // Fonction utilitaire pour vérifier si un produit a un stock faible
  isLowStock(product: Product, threshold: number = 10): boolean {
    return product.availableStock <= threshold;
  }

  // Fonction utilitaire pour formater le prix
  formatPrice(price?: number): string {
    if (!price) return 'Prix non défini';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price / 100); // Divise par 100 si le prix est en centimes
  }

  // Fonction utilitaire pour calculer la valeur du stock
  calculateStockValue(product: Product): number {
    if (!product.price) return 0;
    return (product.availableStock * product.price) / 100; // Divise par 100 si le prix est en centimes
  }
}

export default new ProductService();