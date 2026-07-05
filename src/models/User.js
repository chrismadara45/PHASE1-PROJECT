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

//Hacher le mot de passe avant de le sauvergarder 
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(10); // on genere une 'clé sale' de puissance 10
    
        this.password= await bcrypt.hash(this.password, salt); // password calir -> haché
        next();
    }catch(err){
        next(err); // on passe au middleware suivant pour lock le save
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports= mongoose.model('User', userSchema); // export pour pouvoir l'utiliser ailleurs