import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer'
import { Spades } from "./game";
import { Board } from "./board";
import React from 'react';

const GameClient = Client({ 
  game: Spades,
  board: Board,
  numPlayers: 4,
  multiplayer: Local(),  
});

const App = () => (
  <div>
    <GameClient playerID="0" />
    <GameClient playerID="1" />

    <GameClient playerID="2" />

    <GameClient playerID="3" />

  </div>
);

export default App;