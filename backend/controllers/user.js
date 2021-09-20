const bcrypt = require('bcrypt'); // Importation du package de cryptage bcrypt qui va permettre de hasher le mdp de l'utilisateur dans la base de données

const jsonWebToken = require('jsonwebtoken'); // Package qui permet la création et la vérification de token d'authentification

const User = require('../models/User');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // Apel de la fonction de hachage "hash" de bcrypt et salage du mdp (10 fois)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save() // Enregistrement du nouvel utilisateur dans la base de données 
        .then(() => res.status(201).json({ message: 'Nouvel utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
      })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Recherche dans la base de données si l'adresse email est existante
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // Comparaison du mdp saisie par l'utilisateur avec le mdp hasher du user dans la base de données
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jsonWebToken.sign (  // Apel de la fonction sign de 'jsonwebtoken' pour encoder un nouveau token
              { userId: user._id },     // L'ID utilisateur est encodé dans le token et permet l'authentification pour les créations et/ou modifications produits uniquement par l'utilisateur autorisé)
              'TOKEN_RANDOM',        
              { expiresIn: '12h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
      })
    .catch(error => res.status(500).json({ error }));
};