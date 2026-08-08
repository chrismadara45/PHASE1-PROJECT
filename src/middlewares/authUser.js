const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authUser = async( req, res, next) =>{
    try{
        //extraction d'entete 
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Accès refusé. Token manquant ou mal formé.' });
        }
        //isolation du token pur en coupant les espaces
        const token = authHeader.split(' ')[1];

        //on decode et verife la validité du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key');
        
        //si le token est valide on decode, cherch user without the password
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé.' });
        }

        req.user = user;// lie la requete au user 
        next(); // on passe au code de la route suivante
    }catch(err){
        res.status(401).json({error:'Token invalide ou expiré.'});
    }
};
module.exports = authUser; // exportation pour pouvoir le greffer autre part