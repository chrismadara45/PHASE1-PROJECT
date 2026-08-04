import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import apiClient from '../api/client';

// ATTENTION : Ligne indispensable pour que la carte Leaflet s'affiche correctement !
import 'leaflet/dist/leaflet.css';

// Fonction magique pour créer des points colorés sur la carte
const createCustomIcon = (noiseLevel) => {
  let color = '#95a5a6'; // Gris par défaut (inconnu/erreur)
  if (noiseLevel === 'calme') color = '#2ecc71';      // Vert
  else if (noiseLevel === 'modere') color = '#f1c40f'; // Jaune
  else if (noiseLevel === 'anime') color = '#e67e22';  // Orange
  else if (noiseLevel === 'bruyant') color = '#e74c3c'; // Rouge

  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const Home = () => {
  const [locationsData, setLocationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        // 1. On récupère la liste de tous les lieux (avec leurs coordonnées GPS)
        const locRes = await apiClient.get('/locations');
        const locations = locRes.data;

        // 2. Pour chaque lieu, on va demander à l'API son ambiance actuelle
        const dataPromises = locations.map(async (loc) => {
          try {
            const ambRes = await apiClient.get(`/ambiance/${loc.name}/current`);
            // On fusionne les coordonnées avec les données d'ambiance
            return { ...loc, ambiance: ambRes.data };
          } catch (err) {
            // Si un lieu n'a pas de mesure, on le retourne quand même en "inconnu"
            return { ...loc, ambiance: { noiseLevel: 'inconnu' } };
          }
        });

        // On attend que toutes les requêtes soient terminées
        const fullData = await Promise.all(dataPromises);
        setLocationsData(fullData);
      } catch (err) {
        setError('Impossible de charger la carte.');
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}><h2>🗺️ Chargement de la carte...</h2></div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Ambiance en direct</h2>
      
      {/* Conteneur de la carte (Centré sur Montréal) */}
      <div style={{ height: '600px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
        <MapContainer 
          center={[45.5088, -73.5616]} // Coordonnées globales de Montréal / UQAM
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
        >
          {/* Le fond de carte classique (OpenStreetMap) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* On place les marqueurs pour chaque lieu */}
          {locationsData.map((loc) => (
            <Marker 
              key={loc._id} 
              position={[loc.coordinates.lat, loc.coordinates.lng]}
              icon={createCustomIcon(loc.ambiance.noiseLevel)}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{loc.name}</h3>
                  <p><strong>Niveau :</strong> {loc.ambiance.noiseLevel}</p>
                  {loc.ambiance.avgDecibels && (
                    <p>Moyenne : {loc.ambiance.avgDecibels} dB</p>
                  )}
                  {/* Bouton pour aller voir les détails */}
                  <Link 
                    to={`/location/${encodeURIComponent(loc.name)}`}
                    style={{ display: 'block', marginTop: '10px', padding: '5px', background: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '4px' }}
                  >
                    Voir l'historique 📊
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Légende en dessous de la carte */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
        <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>🟢 Calme</span>
        <span style={{ color: '#f1c40f', fontWeight: 'bold' }}>🟡 Modéré</span>
        <span style={{ color: '#e67e22', fontWeight: 'bold' }}>🟠 Animé</span>
        <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>🔴 Bruyant</span>
      </div>
    </div>
  );
};

export default Home;