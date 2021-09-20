const jsonWebToken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]; // Récupération du token
      const decodedToken = jsonWebToken.verify(token, 'TOKEN_RANDOM'); // Décodage du token avec la fonction verify de 'jsonwebtoken'
      const userId = decodedToken.userId;
      if (req.body.userId && req.body.userId !== userId) { // Comparaison pour l'authentification
        throw 'Utilisateur non valide !';
      } else {
        next();
      }
    } catch {
      res.status(401).json({ error: 'Requète non valide !'});
    }
  };