const http = require('http');  // Importation du package HTTP natif de Node 

const app = require('./app');  // Importation de l'app Express sur le serveur

const dotenv = require('dotenv').config(); // Importation du module Dotenv (variables d'environnement)

/* normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un nombre ou d'une chaîne */

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT);

app.set('port', port); // définition du port d'écoute de l'app Express

/* errorHandler recherche et gère les différentes erreurs puis les enregistre dans le serveur */

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); // Création du serveur Node rélié a l'app Express

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); // définition du port d'écoute du serveur
