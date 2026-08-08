import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client.js';
import useAuth from '../hooks/useAuth.js';

const Login = () => {
  // --- GESTION DES ÉTATS (STATES) ---
  const [isLogin, setIsLogin] = useState(true); // true = mode Connexion, false = mode Inscription
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');       // Pour afficher les messages d'erreur de l'API
  const [loading, setLoading] = useState(false); // Pour désactiver le bouton pendant la requête

  const { login } = useAuth(); // On récupère notre fonction login depuis le contexte
  const navigate = useNavigate(); // Pour rediriger l'utilisateur après la connexion

  // --- SOUMISSION DU FORMULAIRE ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche la page de recharger
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // 1. Cas : L'utilisateur se connecte
        const response = await apiClient.post('/auth/login', { username, password });
        // On sauvegarde le token et le nom dans notre contexte global
        login(response.data.username, response.data.token);
        // On le redirige vers la carte (l'accueil)
        navigate('/'); 
      } else {
        // 2. Cas : L'utilisateur s'inscrit
        await apiClient.post('/auth/register', { username, password });
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsLogin(true); // On rebascule sur le formulaire de connexion
        setPassword(''); // On vide le mot de passe par sécurité
      }
    } catch (err) {
      // S'il y a une erreur (ex: mauvais mot de passe), on l'affiche
      setError(err.response?.data?.error || 'Une erreur est survenue avec le serveur.');
    } finally {
      // Quoi qu'il arrive (succès ou erreur), on arrête le mode chargement
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', marginTop: '2rem' }}>
      <h2>{isLogin ? '🔐 Connexion' : '📝 Inscription'}</h2>
      
      {/* Affichage de l'erreur si elle existe */}
      {error && <div style={{ color: 'red', marginBottom: '1rem', background: '#ffe6e6', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Nom d'utilisateur" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        <button type="submit" disabled={loading} style={{ padding: '0.8rem', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '⏳ Chargement...' : (isLogin ? 'Se connecter' : "Créer mon compte")}
        </button>
      </form>

      {/* Bouton pour basculer entre Inscription et Connexion */}
      <p 
        style={{ marginTop: '1rem', cursor: 'pointer', color: '#2980b9', textDecoration: 'underline' }} 
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
      </p>
    </div>
  );
};

export default Login;