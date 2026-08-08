require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./src/config/db');
const authRouter = require('./src/routes/auth');
const devicesRouter = require('./src/routes/devices');
const measurementsRouter = require('./src/routes/measurements');
const observationsRouter = require('./src/routes/observations');
const ambianceRouter = require('./src/routes/ambiance');
const locationsRouter = require('./src/routes/locations');

const app = express();
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Serveur IFT3225 en ligne ' });
});

// BRANCHEMENT : On déclare que toutes les requêtes commençant par "/auth" 
// (comme /auth/register ou /auth/login) basculent vers notre routeur d'authentification
app.use('/auth', authRouter);

app.use('/devices', devicesRouter);
app.use('/measurements', measurementsRouter);
app.use('/observations', observationsRouter);
app.use('/ambiance', ambianceRouter);
app.use('/locations', locationsRouter);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}).catch((err) => {
  console.error('Erreur:', err.message);
});