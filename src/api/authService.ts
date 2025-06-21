import apiClient from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  company: {
    id: string;
    name: string;
    address?: string;
    industry?: string;
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

class AuthService {
  // Connexion utilisateur
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      
      // Sauvegarder le token et les infos utilisateur
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify({
          company: response.data.company,
          loginTime: new Date().toISOString()
        }));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw new Error('Erreur de connexion au serveur');
    }
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Récupérer les infos utilisateur
  getUserInfo(): any | null {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Vérifier la validité du token (optionnel)
  async verifyToken(): Promise<boolean> {
    try {
      await apiClient.get('/auth/verify'); // Si vous avez cette route
      return true;
    } catch {
      return false;
    }
  }
}

export default new AuthService();