const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try{

        //on extrait le password et username
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'username et password requis' });
        }

        //on verifie si le username et password deja pris dans la BD
        const userExists = await User.findOne({ username });
        if (userExists) {
        return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
        }

        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès !' });

    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) =>{
    try{
        const{username, password} = req.body;

        const user = await User.findOne({ username });

        if (!user || !(await user.comparePassword(password))) {
            //c'est le nom ou le mot de passe qui est faux
            return res.status(401).json({ error: 'Identifiants incorrects' });
        }

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET || 'super_secret_key', // Clé secrète de cryptage du token
            { expiresIn: '24h' } // Le badge se détruira automatiquement après 24 heures
        );
        // On renvoie le token et le nom d'utilisateur au client. Le client React le conservera précieusement.
        res.json({ token, username: user.username });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});
// On exporte le routeur pour le brancher dans l'application principale
module.exports = router;