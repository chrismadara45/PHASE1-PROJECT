require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Serveur IFT3225 en ligne ' });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}).catch((err) => {
  console.error('Erreur:', err.message);
});