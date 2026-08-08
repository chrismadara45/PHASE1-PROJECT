import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../api/client.js';
import useAuth from '../hooks/useAuth.js';

const LocationDetail = () => {
  // useParams permet de récupérer le nom du lieu dans l'URL (ex: /location/McDo%20Berri)
  const { name } = useParams();
  const { user } = useAuth(); // On récupère l'utilisateur pour savoir s'il a le droit de poster

  const [history, setHistory] = useState([]);
  const [quietHours, setQuietHours] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour le formulaire d'observation
  const [vibe, setVibe] = useState('moderate');
  const [proximity, setProximity] = useState('medium');
  const [notes, setNotes] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  // 1. CHARGEMENT DES DONNÉES AU DÉMARRAGE
  useEffect(() => {
    const fetchData = async () => {
      try {
        // On lance les deux requêtes API en même temps pour aller plus vite
        const [historyRes, quietRes] = await Promise.all([
          apiClient.get(`/ambiance/${name}/history?last=24`), // Historique sur 24h
          apiClient.get(`/ambiance/${name}/quiet-hours`)      // Heures calmes
        ]);

        // On formate un peu les données pour le graphique Recharts
        const formattedHistory = historyRes.data.measurements.map(m => ({
          time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          decibels: m.value
        }));

        setHistory(formattedHistory);
        setQuietHours(quietRes.data.quietHours);
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name]);

  // 2. SOUMISSION D'UNE NOUVELLE OBSERVATION
  const handleObserve = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/observations', {
        location: name,
        vibe,
        proximity,
        notes
      });
      setSubmitMessage(' Observation ajoutée avec succès !');
      setNotes(''); // On vide le champ texte
    } catch (err) {
      setSubmitMessage('Erreur lors de l\'envoi.');
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center' }}>📊 Chargement des données de {name}...</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#3498db' }}>← Retour à la carte</Link>
      <h1 style={{ marginTop: '1rem' }}>📍 Détails : {name}</h1>

      {/* SECTION 1 : LE GRAPHIQUE D'HISTORIQUE */}
      <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>Historique sonore (24h)</h3>
        <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[-50, -10]} />
                <Tooltip />
                <Line type="monotone" dataKey="decibels" stroke="#e74c3c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>Aucune donnée d'historique récente.</p>
          )}
        </div>
      </div>

      {/* SECTION 2 : LES HEURES CALMES */}
      <div style={{ background: '#e8f6f3', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3> Créneaux calmes recommandés</h3>
        {quietHours.length > 0 ? (
          <ul>
            {quietHours.map((qh, index) => (
              <li key={index}>
                <strong>{qh.hour}h00</strong> : Moyenne de {qh.avgDecibels} dB
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun créneau calme détecté pour ce lieu.</p>
        )}
      </div>

      {/* SECTION 3 : LE FORMULAIRE PROTÉGÉ */}
      <div style={{ background: '#fff', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>📝 Ajouter une observation</h3>
        
        {/* On conditionne l'affichage : Si pas d'utilisateur connecté, on affiche un message */}
        {!user ? (
          <p>
            Vous devez être connecté pour soumettre une observation. <br/>
            <Link to="/login" style={{ color: '#3498db' }}>Se connecter</Link>
          </p>
        ) : (
          <form onSubmit={handleObserve} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <label>
              Ambiance ressentie (Vibe) :
              <select value={vibe} onChange={(e) => setVibe(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
                <option value="calm">Calme</option>
                <option value="moderate">Modérée</option>
                <option value="busy">Animée</option>
                <option value="chaotic">Chaotique</option>
              </select>
            </label>

            <label>
              Proximité de la source de bruit :
              <select value={proximity} onChange={(e) => setProximity(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
                <option value="low">Loin</option>
                <option value="medium">Moyenne</option>
                <option value="high">Très proche</option>
              </select>
            </label>

            <label>
              Notes additionnelles :
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                rows="3" 
                style={{ width: '100%', padding: '0.5rem' }} 
                placeholder="Ex: Un groupe d'étudiants discute fort..."
              />
            </label>

            <button type="submit" style={{ padding: '0.8rem', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Envoyer l'observation
            </button>
            {submitMessage && <p style={{ fontWeight: 'bold', color: submitMessage.includes('✅') ? 'green' : 'red' }}>{submitMessage}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default LocationDetail;