const mongoose = require('mongoose');

const locationSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    coordinates:{
        //objet pour stocker la latitude et la longitude
        lat:{
            type: Number,
            required: true,

        },
        long:{
            type: Number,
            required: true
        }
    }
},{
    //automatic addly mod et creations dates
    timestamps: true
})

module.exports = mongoose.model('Location', locationSchema);