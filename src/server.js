const Server = require('boardgame.io/server').Server;
const Spades = require('./game').Spades;
const server = Server({ games: [Spades] });
server.run(8000);