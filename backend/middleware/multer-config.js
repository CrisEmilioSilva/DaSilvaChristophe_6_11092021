const multer = require('multer');

const MIME_TYPES = {  // Dictionnaire des extensions de fichiers pour les images
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => { // Indication a multer pour l'emplacement d'enregistrement des images
    callback(null, 'images');
  },
  filename: (req, file, callback) => {  // Générer un nom de fichier unique
    const name = file.originalname.split(' ').join('_'); // Remplacer les espaces qui peuvent créer des erreurs coté serveur et les remplacer par des underscores
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);  // Ajout d'un timestamp avec Date.now() pour appuyer l'unicité du nom de fichier
  }
});

module.exports = multer({storage: storage}).single('image');