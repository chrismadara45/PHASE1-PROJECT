import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx'; // Ajoute l'extension si nécessaire

// La syntaxe "() =>" est CRUCIALE ici
const useAuth = () => useContext(AuthContext); 

export default useAuth;