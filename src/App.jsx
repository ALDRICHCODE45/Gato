import { useState } from "react";
import { Square } from "./components/Square";
import confetti from "canvas-confetti";

const TURNS = {
  X: "x",
  O: "o",
};

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const App = () => {
  const [board, setboard] = useState(Array(9).fill(null));
  const [turno, setTurno] = useState(TURNS.X);
  const [winner, setWinner] = useState(null); //null no hay ganador y false hay empate

  const checkWinner = (boardToCheck) => {
    //revisamos todas las combinaciones ganadoras para ver si X u O gano
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        boardToCheck[a] && //si es que hay 'x' u 'o' en la posicion a
        boardToCheck[a] === boardToCheck[b] && // si es que la posicion a y la b hay lo mismo
        boardToCheck[a] === boardToCheck[c] //si en la posicion a y c hay lo mismo
      ) {
        return boardToCheck[a];
      }
    }
    return null;
  };

  const checkEndGame = (newBoard) => {
    //revisamos si hay un empate
    //si no hay mas espacios vacios
    // en el tablero
    return newBoard.every((square) => square !== null);
  };

  const updateBoard = (index) => {
    //no actualizamos esta posicion si ya tiene algo
    if (board[index] || winner) return;

    //actualizar el tablero
    const newBoard = [...board];
    newBoard[index] = turno;
    setboard(newBoard);

    //cambiar el turno
    const newTurn = turno === TURNS.X ? TURNS.O : TURNS.X;
    setTurno(newTurn);
    //checar si hay un ganador
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };
  const resetGame = () => {
    setboard(Array(9).fill(null));
    setTurno(TURNS.X);
    setWinner(null);
  };

  return (
    <main className="board">
      <h1>Gato</h1>
      <button onClick={resetGame}>Reset del Juego</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square key={index} updateBoard={updateBoard} index={index}>
              {board[index]}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turno === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turno === TURNS.O}>{TURNS.O}</Square>
      </section>

      {winner !== null && (
        <section className="winner">
          <div className="text">
            <h2>{winner === false ? "Empate" : `Gano:`}</h2>
            <header className="win">
              {winner && <Square>{winner}</Square>}
            </header>
            <footer>
              <button onClick={resetGame}>Empezar de nuevo</button>
            </footer>
          </div>
        </section>
      )}
    </main>
  );
};
