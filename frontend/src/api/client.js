import axios from 'axios';

// On configure l'adresse de base de ton API (ton backend local)
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur : Avant chaque requête, on vérifie si on a un token en mémoire
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Si oui, on l'attache automatiquement au header d'autorisation pour que le backend nous accepte
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;