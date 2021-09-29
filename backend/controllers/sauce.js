const fs = require('fs');  // Importation du package fs de Node permettant de modifier le système de fichiers

const Sauce = require('../models/Sauce');


exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {res.status(200).json(sauces);
        })
        .catch((error) => {res.status(400).json({error: error});
        });
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {res.status(200).json(sauce);
        })
        .catch((error) => {res.status(404).json({error: error});
        });
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);  // Récupération des valeurs du model de sauce dans le corp de requete et mise en objet JS avec JSON.parse
    const sauce = new Sauce({
        ...sauceObject,  // L'opérateur spread va permettre de faire une copie de toutes les valeurs du model de sauce
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  // Génère une url complète pour l'image téléchargé par l'utilisateur
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Nouvelle sauce crée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?  // Condition qui va déterminer l'action a effectué lors de la modification (nouvelle image ou image non changé)
    {
        ...JSON.parse(req.body.sauce),  // Si une nouvelle image est télécharger par l'utiliateur meme condition que pour la route POST (Commenter)
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };  // Si l'image n'est pas changer lors de la modification on récupère le corp de la réquète
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(403).json({ error }));
};


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];  // Récupération du nom du fichier uniquement
            fs.unlink(`images/${filename}`, () => {  // Apel de la fonction de suppression de fs pour supprimer l'image du back-end
        Sauce.deleteOne({ _id: req.params.id })  // Dans la callback on supprime la sauce de la base de données avec la méthode deleteOne 
            .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
        .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {

    const like = req.body.like  // Récupération des valeurs pour géré les likes et dislikes de l'API
    const userId = req.body.userId 
    const sauceId = req.params.id 

    if (like === 1) { // SI like de l'utilisateur (+1)
        Sauce.updateOne({ _id: sauceId }, {  // On apel la méthode udapteOne afin de modifier le model de la sauce
            $push: { usersLiked: userId },  // Push de l'userId dans le tableau déstiné usersLiked (garde une trace des préférences utilisateur)
            $inc: { likes: +1 } // Incrémentation de 1 avec l'opérateur d'incrémentation $inc de MongoDB
        })

        .then(() => res.status(200).json({ message: 'Sauce liké !' }))
        .catch(error => res.status(400).json({ error }));
    }

    if (like === -1) { // SI dislike de l'utilisateur
        Sauce.updateOne({ _id: sauceId }, {
            $push: { usersDisliked: userId },
            $inc: { dislikes: +1 }
        })

        .then(() => res.status(200).json({ message: 'Sauce Disliké !' }))
        .catch(error => res.status(400).json({ error }));
    }

    if (like === 0) { // SI l'utilisateur annule son like ou son dislike
        Sauce.findOne({ _id: sauceId })  // Apel de la méthode findOne pour trouver la sauce par son ID
            .then((sauce) => {
                if (sauce.usersLiked.find(user => user === userId)) { // L'utilisateur annule un like
                    Sauce.updateOne({ _id: sauceId }, {
                        $pull: { usersLiked: userId }, // Supression de l'id utilisateur du tableau usersLiked
                        $inc: { likes: -1 } // Décrémentation de 1
                    })

                    .then(() => res.status(200).json({ message: "Like annulé !" }))
                    .catch(error => res.status(400).json({ error }));
                }

                if (sauce.usersDisliked.find(user => user === userId)) { // L'utilisateur annule un dislike
                    Sauce.updateOne({ _id: sauceId }, {
                        $pull: { usersDisliked: userId },
                        $inc: { dislikes: -1 } 
                    })

                    .then(() => res.status(200).json({ message: "Dislike annulé !" }))
                    .catch(error => res.status(400).json({ error }));
                }

            })
            .catch((error) => res.status(404).json({ error }))
    }
};