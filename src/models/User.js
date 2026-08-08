const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
},{ timestamps: true }); // genere automatiquement date de creation et de modif

//Hacher le mot de passe avant de le sauvegarder 
userSchema.pre('save', async function() {
    // Si le mot de passe n'a pas été modifié, on arrête la fonction ici
    if (!this.isModified('password')) return;
    
    // On génère le sel et on hache, pas besoin de next() !
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports= mongoose.model('User', userSchema); // export pour pouvoir l'utiliser ailleurs