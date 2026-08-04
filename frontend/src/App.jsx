import React from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import { Routes, Route, Link } from 'react-router-dom';
// import useAuth from './hooks/useAuth'; // On l'activera quand on créera le hook

// --- ESPACES RÉSERVÉS POUR NOS FUTURES PAGES ---
const LocationDetail = () => <div><h2>📊 Détails du lieu (En construction)</h2></div>;

function App() {
  return (
    <div>
      {/* Barre de navigation basique */}
      <nav style={{ padding: '1rem', background: '#2c3e50', color: 'white', display: 'flex', gap: '1rem' }}>
        <strong>Ambiance API</strong>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Carte</Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Connexion</Link>
      </nav>
      
      {/* Conteneur principal où les pages vont s'afficher selon l'URL */}
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/location/:name" element={<LocationDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
