const mongoose = require('mongoose');

/* Le package de validation 'mongoose-unique-validator' + le mot clé "unique" 
dans le userShema va permettre de mettre en place l'unicité d'adresse mail pour la connexion a l'API */

const uniqueValidationUser = require('mongoose-unique-validator');

// Modèle de données utilisateur

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidationUser);

module.exports = mongoose.model('User', userSchema);