require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const devicesRouter = require('./src/routes/devices');
const measurementsRouter = require('./src/routes/measurements');
const observationsRouter = require('./src/routes/observations');
const ambianceRouter = require('./src/routes/ambiance');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Serveur IFT3225 en ligne ' });
});

app.use('/devices', devicesRouter);
app.use('/measurements', measurementsRouter);
app.use('/observations', observationsRouter);
app.use('/ambiance', ambianceRouter);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}).catch((err) => {
  console.error('Erreur:', err.message);
});