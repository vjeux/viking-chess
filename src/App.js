import "./styles.css";

import { useState } from "react";

const EMPTY = 0;
const KING = 1;
const DEFENDER = 2;
const ATTACKER = 3;

const SIZE = 11;

function cloneBoard(board) {
  const newBoard = board.slice();
  newBoard.pieces = board.pieces.map((piece) => ({ ...piece }));
  return newBoard;
}

function getPiece(board, x, y) {
  return board[x * SIZE + y];
}

function getPieces(board) {
  return board.pieces;
}

function addPiece(board, x, y, type) {
  board[x * SIZE + y] = type;
  board.pieces.push({
    x,
    y,
    type: type,
    id: board.pieces.length,
    deleted: false
  });
}

function movePiece(board, fromX, fromY, toX, toY) {
  board[toX * SIZE + toY] = board[fromX * SIZE + fromY];
  board[fromX * SIZE + fromY] = EMPTY;
  for (let i = 0; i < board.pieces.length; ++i) {
    if (board.pieces[i].x === fromX && board.pieces[i].y === fromY) {
      board.pieces[i].x = toX;
      board.pieces[i].y = toY;
      break;
    }
  }
}

function deletePiece(board, x, y) {
  board[x * SIZE + y] = EMPTY;
  for (let i = 0; i < board.pieces.length; ++i) {
    if (board.pieces[i].x === x && board.pieces[i].y === y) {
      board.pieces[i].deleted = true;
      break;
    }
  }
}

function initializeBoard() {
  const board = Array(SIZE * SIZE).fill(EMPTY);
  board.pieces = [];

  // Top attackers
  addPiece(board, 3, 0, ATTACKER);
  addPiece(board, 4, 0, ATTACKER);
  addPiece(board, 5, 0, ATTACKER);
  addPiece(board, 5, 1, ATTACKER);
  addPiece(board, 6, 0, ATTACKER);
  addPiece(board, 7, 0, ATTACKER);

  // Left attackers
  addPiece(board, 0, 3, ATTACKER);
  addPiece(board, 0, 4, ATTACKER);
  addPiece(board, 0, 5, ATTACKER);
  addPiece(board, 1, 5, ATTACKER);
  addPiece(board, 0, 6, ATTACKER);
  addPiece(board, 0, 7, ATTACKER);

  // Right attackers
  addPiece(board, 10, 3, ATTACKER);
  addPiece(board, 10, 4, ATTACKER);
  addPiece(board, 10, 5, ATTACKER);
  addPiece(board, 9, 5, ATTACKER);
  addPiece(board, 10, 6, ATTACKER);
  addPiece(board, 10, 7, ATTACKER);

  // Bottom attackers
  addPiece(board, 3, 10, ATTACKER);
  addPiece(board, 4, 10, ATTACKER);
  addPiece(board, 5, 10, ATTACKER);
  addPiece(board, 5, 9, ATTACKER);
  addPiece(board, 6, 10, ATTACKER);
  addPiece(board, 7, 10, ATTACKER);

  // Defenders
  addPiece(board, 3, 5, DEFENDER);
  addPiece(board, 4, 4, DEFENDER);
  addPiece(board, 4, 5, DEFENDER);
  addPiece(board, 4, 6, DEFENDER);
  addPiece(board, 5, 3, DEFENDER);
  addPiece(board, 5, 4, DEFENDER);
  addPiece(board, 5, 5, KING);
  addPiece(board, 5, 6, DEFENDER);
  addPiece(board, 5, 7, DEFENDER);
  addPiece(board, 6, 4, DEFENDER);
  addPiece(board, 6, 5, DEFENDER);
  addPiece(board, 6, 6, DEFENDER);
  addPiece(board, 7, 5, DEFENDER);

  return board;
}
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

const IMAGES = [];
IMAGES[EMPTY] = "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png";
IMAGES[KING] =
  "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png";
IMAGES[ATTACKER] =
  "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png";
IMAGES[DEFENDER] =
  "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png";

const LIGHT = 0;
const DARK = 1;
const DARKEST = 2;

function isDark(x, y) {
  if (
    // Top attackers
    (x === 3 && y === 0) ||
    (x === 4 && y === 0) ||
    (x === 5 && y === 0) ||
    (x === 5 && y === 1) ||
    (x === 6 && y === 0) ||
    (x === 7 && y === 0) ||
    // Left attackers
    (x === 0 && y === 3) ||
    (x === 0 && y === 4) ||
    (x === 0 && y === 5) ||
    (x === 1 && y === 5) ||
    (x === 0 && y === 6) ||
    (x === 0 && y === 7) ||
    // Right attackers
    (x === 10 && y === 3) ||
    (x === 10 && y === 4) ||
    (x === 10 && y === 5) ||
    (x === 9 && y === 5) ||
    (x === 10 && y === 6) ||
    (x === 10 && y === 7) ||
    // Bottom attackers
    (x === 3 && y === 10) ||
    (x === 4 && y === 10) ||
    (x === 5 && y === 10) ||
    (x === 5 && y === 9) ||
    (x === 6 && y === 10) ||
    (x === 7 && y === 10)
  ) {
    return DARK;
  }
  if (
    // Defenders
    (x === 3 && y === 5) ||
    (x === 4 && y === 4) ||
    (x === 4 && y === 5) ||
    (x === 4 && y === 6) ||
    (x === 5 && y === 3) ||
    (x === 5 && y === 4) ||
    (x === 5 && y === 6) ||
    (x === 5 && y === 7) ||
    (x === 6 && y === 4) ||
    (x === 6 && y === 5) ||
    (x === 6 && y === 6) ||
    (x === 7 && y === 5)
  ) {
    return DARK;
  }
  if (
    // King
    (x === 5 && y === 5) ||
    // Exit
    (x === 0 && y === 0) ||
    (x === 10 && y === 0) ||
    (x === 0 && y === 10) ||
    (x === 10 && y === 10)
  ) {
    return DARKEST;
  }
}

function getLegalMoves(board, x, y) {
  const piece = getPiece(board, x, y);
  const result = [];
  if (piece === EMPTY) {
    return result;
  }
  for (let x2 = x - 1; x2 >= 0 && getPiece(board, x2, y) === EMPTY; --x2) {
    result.push([x2, y]);
  }
  for (let y2 = y - 1; y2 >= 0 && getPiece(board, x, y2) === EMPTY; --y2) {
    result.push([x, y2]);
  }
  for (let x2 = x + 1; x2 < SIZE && getPiece(board, x2, y) === EMPTY; ++x2) {
    result.push([x2, y]);
  }
  for (let y2 = y + 1; y2 < SIZE && getPiece(board, x, y2) === EMPTY; ++y2) {
    result.push([x, y2]);
  }

  return result.filter(([x2, y2]) => {
    if (
      ((x2 === 5 && y2 === 5) ||
        (x2 === 0 && y2 === 0) ||
        (x2 === 10 && y2 === 0) ||
        (x2 === 0 && y2 === 10) ||
        (x2 === 10 && y2 === 10)) &&
      piece !== KING
    ) {
      return false;
    }
    return true;
  });
}

function isValidMove(board, fromX, fromY, toX, toY) {
  return Boolean(
    getLegalMoves(board, fromX, fromY).find(([x, y]) => x === toX && y === toY)
  );
}

function executeMove(board, fromX, fromY, toX, toY) {
  const piece = getPiece(board, fromX, fromY);
  const newBoard = cloneBoard(board);
  movePiece(newBoard, fromX, fromY, toX, toY, EMPTY);
  const turn = isPieceForTurn(piece, true);

  if (
    toY - 2 >= 0 &&
    isPieceForTurn(getPiece(board, toX, toY - 1), !turn) &&
    isPieceForTurn(getPiece(board, toX, toY - 2), turn)
  ) {
    deletePiece(newBoard, toX, toY - 1);
  }
  if (
    toY + 2 < SIZE &&
    isPieceForTurn(getPiece(board, toX, toY + 1), !turn) &&
    isPieceForTurn(getPiece(board, toX, toY + 2), turn)
  ) {
    deletePiece(newBoard, toX, toY + 1);
  }
  if (
    toX - 2 >= 0 &&
    isPieceForTurn(getPiece(board, toX - 1, toY), !turn) &&
    isPieceForTurn(getPiece(board, toX - 2, toY), turn)
  ) {
    deletePiece(newBoard, toX - 1, toY);
  }
  if (
    toX + 2 < SIZE &&
    isPieceForTurn(getPiece(board, toX + 1, toY), !turn) &&
    isPieceForTurn(getPiece(board, toX + 2, toY), turn)
  ) {
    deletePiece(newBoard, toX + 1, toY);
  }

  return newBoard;
}

function isPieceForTurn(piece, turn) {
  return (
    (turn === DEFENDER_TURN && (piece === DEFENDER || piece === KING)) ||
    (turn === ATTACKER_TURN && piece === ATTACKER)
  );
}

function positionToString(x, y) {
  return String.fromCharCode(97 + x) + (y + 1);
}

function DisplayBoard({ gameState, onClick }) {
  const { board, selected, turn, lastMove } = gameState;
  const legalMoves = selected
    ? getLegalMoves(board, selected[0], selected[1])
    : [];
  return (
    <div className="board">
      {range(0, SIZE).map((y) => (
        <div key={"row-" + y} className="row">
          {range(0, SIZE).map((x) => {
            const piece = getPiece(board, x, y);
            const darkness = isDark(x, y);
            return (
              <div
                className={
                  "spot " +
                  (darkness === DARK
                    ? "dark"
                    : darkness === DARKEST
                    ? "darkest"
                    : "light") +
                  ((selected !== null &&
                    selected[0] === x &&
                    selected[1] === y) ||
                  (lastMove !== null &&
                    ((lastMove[0] === x && lastMove[1] === y) ||
                      (lastMove[2] === x && lastMove[3] === y)))
                    ? " selected"
                    : "") +
                  ((turn === ATTACKER_TURN && piece === ATTACKER) ||
                  (turn === DEFENDER_TURN &&
                    (piece === DEFENDER || piece === KING))
                    ? " clickable"
                    : "") +
                  (legalMoves.find(([x2, y2]) => x === x2 && y === y2)
                    ? " legal-move"
                    : "") +
                  (y > 0 &&
                  x < SIZE - 1 &&
                  isDark(x, y) &&
                  !isDark(x + 1, y) &&
                  !isDark(x, y - 1)
                    ? " border-top-right"
                    : "") +
                  (x > 0 &&
                  y > 0 &&
                  isDark(x, y) &&
                  !isDark(x - 1, y) &&
                  !isDark(x, y - 1)
                    ? " border-top-left"
                    : "") +
                  (x < SIZE - 1 &&
                  y < SIZE - 1 &&
                  isDark(x, y) &&
                  !isDark(x + 1, y) &&
                  !isDark(x, y + 1)
                    ? " border-bottom-right"
                    : "") +
                  (x > 0 &&
                  y < SIZE - 1 &&
                  isDark(x, y) &&
                  !isDark(x - 1, y) &&
                  !isDark(x, y + 1)
                    ? " border-bottom-left"
                    : "")
                }
                key={"" + x}
                onClick={() => onClick(x, y)}
              />
            );
          })}
        </div>
      ))}
      {getPieces(board).map((piece) => {
        const className =
          "piece x" +
          piece.x +
          " y" +
          piece.y +
          (piece.deleted ? " deleted" : "");
        return (
          <div
            className={className}
            key={piece.id}
            style={{
              backgroundImage: "url(" + IMAGES[piece.type] + ")"
            }}
          />
        );
      })}
    </div>
  );
}

const ATTACKER_TURN = true;
const DEFENDER_TURN = false;

const INITIAL_GAME_STATE = {
  board: initializeBoard(),
  turn: ATTACKER_TURN,
  selected: null,
  lastMove: null,
  history: []
};

function parseMoves(movesString) {
  return movesString.split("/").map((moveString) =>
    moveString
      .split("-")
      .map((positionString) => [
        positionString.charCodeAt(0) - 97,
        parseInt(positionString.slice(1), 10) - 1
      ])
      .flat()
  );
}

export default function App() {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);

  let historyIndex = gameState.history.findIndex(
    (historyMove) => historyMove.board === gameState.board
  );

  return (
    <div className="App">
      <div className="main-column">
        <DisplayBoard
          gameState={gameState}
          onClick={(x, y) => {
            const piece = getPiece(gameState.board, x, y);
            if (isPieceForTurn(piece, gameState.turn)) {
              setGameState({
                ...gameState,
                selected: [x, y]
              });
            } else if (
              gameState.selected &&
              isValidMove(
                gameState.board,
                gameState.selected[0],
                gameState.selected[1],
                x,
                y
              )
            ) {
              const nextBoard = executeMove(
                gameState.board,
                gameState.selected[0],
                gameState.selected[1],
                x,
                y
              );
              const move = [gameState.selected[0], gameState.selected[1], x, y];
              setGameState({
                ...gameState,
                board: nextBoard,
                selected: null,
                turn: !gameState.turn,
                lastMove: move,
                history: gameState.history.concat({
                  move,
                  board: nextBoard,
                  turn: !gameState.turn
                })
              });
            } else if (gameState.selected) {
              setGameState({
                ...gameState,
                selected: null
              });
            }
          }}
        />
      </div>
      <div className="details-column">
        <h3>History</h3>
        <button
          disabled={historyIndex === 0}
          onClick={() => {
            const historyMove = gameState.history[0];
            setGameState({
              ...gameState,
              board: historyMove.board,
              turn: historyMove.turn,
              lastMove: historyMove.move,
              selected: null
            });
          }}
        >
          First
        </button>
        <button
          disabled={historyIndex === 0}
          onClick={() => {
            const historyMove = gameState.history[historyIndex - 1];
            setGameState({
              ...gameState,
              board: historyMove.board,
              turn: historyMove.turn,
              lastMove: historyMove.move,
              selected: null
            });
          }}
        >
          Prev
        </button>
        <button
          disabled={historyIndex === gameState.history.length - 1}
          onClick={() => {
            const historyMove = gameState.history[historyIndex + 1];
            setGameState({
              ...gameState,
              board: historyMove.board,
              turn: historyMove.turn,
              lastMove: historyMove.move,
              selected: null
            });
          }}
        >
          Next
        </button>
        <button
          disabled={historyIndex === gameState.history.length - 1}
          onClick={() => {
            const historyMove = gameState.history[gameState.history.length - 1];
            setGameState({
              ...gameState,
              board: historyMove.board,
              turn: historyMove.turn,
              lastMove: historyMove.move,
              selected: null
            });
          }}
        >
          Last
        </button>
        <ul>
          {gameState.history.map((historyMove, i) => (
            <li
              className={"move" + (historyIndex === i ? " active" : "")}
              onClick={() => {
                setGameState({
                  ...gameState,
                  board: historyMove.board,
                  turn: historyMove.turn,
                  lastMove: historyMove.move,
                  selected: null
                });
              }}
            >
              #{i + 1}{" "}
              {positionToString(historyMove.move[0], historyMove.move[1])}-
              {positionToString(historyMove.move[2], historyMove.move[3])}
            </li>
          ))}
        </ul>
        <ImportHistory
          onClick={(historyString) => {
            const moves = parseMoves(historyString);
            const initialBoard = initializeBoard();
            let board = initialBoard;
            let history = [];
            let turn = ATTACKER_TURN;
            for (let i = 0; i < moves.length; i++) {
              const move = moves[i];
              board = executeMove(board, ...move);
              history.push({ move, board, turn });
              turn = !turn;
            }
            setGameState({
              board: initialBoard,
              selected: null,
              turn: ATTACKER_TURN,
              lastMove: null,
              history
            });
          }}
        />
      </div>
    </div>
  );
}

function ImportHistory({ onClick }) {
  const [historyString, setHistoryString] = useState(
    "h1-h3/d6-d3/f2-c2/f4-i4/g1-i1/h6-h9/k7-j7/g7-g10/h11-h10xg10/g6-g10/k8-i8/e7-e10xf10/d11-d10/f8-f10/k6-k9/h9-c9/d10-c10/g5-g3/i1-i3/f5-f2/h3-h2/f6-f4/b6-b3/f7-b7/j7-c7xb7/f4-f9/a8-a9/d3-d11/c10-c11xd11/e10-b10/d1-d10/f9-i9/h10-i10/i4-i7xi8/j6-j9/e6-j6/k4-j4/f10-f8/a7-a8/f8-k8/f11-f3xf2/g3-g8/c11-c10/c9-f9/a5-d5/e5-h5/g11-h11/j6-k6/a9-a10xb10/i7-j7/d10-f10/f9-f8/a8-a9/g8-j8/h11-h10xg10/i9-i7/f1-i1/h5-h6/i10-i9/f8-i8/c7-g7/j7-j6/h10-h8/h6-i6/a6-h6/i7-j7/g7-i7xi8/j8-i8xi7/h8-h7/i8-g8/f10-f8/k8-h8/a9-h9xh8/g8-g6xh6/h2-h6xg6"
  );
  return (
    <div>
      <input
        type="text"
        value={historyString}
        onChange={(e) => setHistoryString(e.target.value)}
      />
      <button onClick={() => onClick(historyString)}>Import</button>
    </div>
  );
}
