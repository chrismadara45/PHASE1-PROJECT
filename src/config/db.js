const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('Tentative de connexion...');
  console.log('URI:', process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connecté');
  } catch (err) {
    console.error('Erreur de connexion MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;