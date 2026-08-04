import React, { createContext, useState, useEffect } from 'react';

// On crée le contexte
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Au démarrage de l'app, on vérifie si le navigateur a déjà sauvegardé un token (si on a rafraîchi la page)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ username, token });
    }
  }, []);

  // Fonction pour se connecter : sauvegarde dans React ET dans le navigateur
  const login = (username, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUser({ username, token });
  };

  // Fonction pour se déconnecter : on nettoie tout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};