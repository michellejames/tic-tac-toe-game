import { useState } from "react";

import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import Log from "./components/Log.jsx";
import GameOver from "./components/GameOver.jsx";
import { WINNING_COMBINATIONS } from "./winning-combinations.js";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);

  const [gameTurns, setGameTurns] = useState([]);
  //const [activePlayer, setActivePlayer] = useState("X");
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  function deriveGameBoard(gameTurns) {
    //here we are creating a copy of the initialGameBoard. This is necessary because when we restart the game, we need to start with a new gameBoard
    let gameBoard = [
      ...INITIAL_GAME_BOARD.map((innerArray) => [...innerArray]),
    ];

    gameTurns.forEach((gameTurn) => {
      const { square, player } = gameTurn;
      const { row, col } = square;
      //here we are overwriting the initialGameBoard with the new turn
      gameBoard[row][col] = player;
    });
    return gameBoard;
  }

  function deriveWinner(gameBoard, players) {
    let winner;

    for (const combination of WINNING_COMBINATIONS) {
      const firstSquareSymbol =
        gameBoard[combination[0].row][combination[0].column];
      const secondSquareSymbol =
        gameBoard[combination[1].row][combination[1].column];
      const thirdSquareSymbol =
        gameBoard[combination[2].row][combination[2].column];

      if (
        firstSquareSymbol &&
        firstSquareSymbol === secondSquareSymbol &&
        firstSquareSymbol === thirdSquareSymbol
      ) {
        //here we are using the firstSquareSymbol to get the name of the player who won
        //this is possible because we are storing the player names in the players object
        //so dynamically we can get the name of the player who won
        winner = players[firstSquareSymbol];
      }
    }
    return winner;
  }

  function handleSelectSquare(rowIndex, colIndex) {
    //setActivePlayer((curActivePlayer) => (curActivePlayer === "X" ? "O" : "X"));
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const newTurn = {
        square: { row: rowIndex, col: colIndex },
        player: currentPlayer,
      };
      const updatedTurns = [newTurn, ...prevTurns];
      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        {/* Players */}
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          ></Player>
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          ></Player>
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        {/* Game Board */}
        <GameBoard
          // turns={gameTurns}
          board={gameBoard}
          activePlayerSymbol={activePlayer}
          onSelectSquare={handleSelectSquare}
        />
      </div>

      {/* Log */}
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
