const express = require('express');  // Importation du framework Express
const app = express();

const mongoose = require('mongoose'); // Importation du package Moongoose

const dotenv = require("dotenv").config(); // Importation du module Dotenv (variables d'environnement)

const helmet = require("helmet"); // Importation du package d'helmet (en-têtes HTTP sécurisés)

/* Importation des routes dans l'app */

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const path = require('path'); // Module de chemin Node.js qui est utilisé pour gérer et transformer les chemins de fichiers

/* Connection a la base de données */

mongoose.connect(`mongodb+srv://${process.env.MONGO_PROJECT}:${process.env.MONGO_CONNECT}@cluster0.1tqru.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Middleware qui va permettre de débloquer le CORS afin que les utilisateurs est accés a l'API */

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());

app.use(helmet());

/* Enregistrement des routes dans l'app */

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

/* Indique à Express qu'il faut gérer la ressource images de manière statique */

app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;