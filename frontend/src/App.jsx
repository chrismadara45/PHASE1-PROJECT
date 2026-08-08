import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import LocationDetail from './pages/LocationDetail.jsx';
import useAuth from './hooks/useAuth.js'; // <-- Le hook pour savoir si on est connecté

// On prépare un espace pour la future page Profil (on la créera juste après)
const Account = () => <div><h2>👤 Mon Profil (En construction)</h2></div>;

function App() {
  const { user, logout } = useAuth(); // On récupère l'utilisateur et la fonction de déconnexion
  const navigate = useNavigate(); // Pour pouvoir rediriger après la déconnexion

  // Fonction appelée quand on clique sur "Déconnexion"
  const handleLogout = () => {
    logout(); // Vide le localStorage et le contexte
    navigate('/login'); // Ramène à la page de connexion
  };

  return (
    <div>
      {/* BARRE DE NAVIGATION DYNAMIQUE */}
      <nav style={{ padding: '1rem', background: '#2c3e50', color: 'white', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <strong>Ambiance API</strong>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Carte</Link>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Si l'utilisateur est connecté (user existe), on affiche Profil et Déconnexion */}
          {user ? (
            <>
              <Link to="/account" style={{ color: '#34db98', textDecoration: 'none', fontWeight: 'bold' }}>
                👤 {user.username}
              </Link>
              <button 
                onClick={handleLogout} 
                style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            /* Sinon, on affiche juste le lien de Connexion */
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Connexion</Link>
          )}
        </div>
      </nav>
      
      {/* ROUTEUR */}
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/location/:name" element={<LocationDetail />} />
          {/* La nouvelle route pour l'espace compte */}
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
