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
  if (board[x * SIZE + y] !== EMPTY) {
    throw new Error(
      "Cannot add piece because there's already a piece at that position!"
    );
  }
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
    if (
      board.pieces[i].x === fromX &&
      board.pieces[i].y === fromY &&
      !board.pieces[i].deleted
    ) {
      board.pieces[i].x = toX;
      board.pieces[i].y = toY;
      return;
    }
  }
  throw new Error("Cannot move piece because the original doesn't exist!");
}

function deletePiece(board, x, y) {
  board[x * SIZE + y] = EMPTY;
  for (let i = 0; i < board.pieces.length; ++i) {
    if (
      board.pieces[i].x === x &&
      board.pieces[i].y === y &&
      !board.pieces[i].deleted
    ) {
      board.pieces[i].deleted = true;
      return;
    }
  }
  throw new Error("Cannot delete piece because the original doesn't exist!");
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

function isAttackerStartingSquare(x, y) {
  return (
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
  );
}

function isDefenderStartingSquare(x, y) {
  return (
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
  );
}

function isKingSquare(x, y) {
  return x === 5 && y === 5;
}

function isExitSquare(x, y) {
  return (
    (x === 0 && y === 0) ||
    (x === 10 && y === 0) ||
    (x === 0 && y === 10) ||
    (x === 10 && y === 10)
  );
}

function isSpecialSquare(x, y) {
  return isKingSquare(x, y) || isExitSquare(x, y);
}

function getDarkness(x, y) {
  if (isAttackerStartingSquare(x, y)) {
    return DARK;
  }
  if (isDefenderStartingSquare(x, y)) {
    return DARK;
  }
  if (isSpecialSquare(x, y)) {
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

function check(board, x1, y1, x2, y2, turn) {
  const attackedPiece = getPiece(board, x1, y1);
  if (attackedPiece === KING) {
    return false;
  }
  return (
    isPieceForTurn(attackedPiece, !turn) &&
    (isExitSquare(x2, y2) ||
      isPieceForTurn(getPiece(board, x2, y2), turn) ||
      (isKingSquare(x2, y2) &&
        !(turn === ATTACKER_TURN && getPiece(board, x2, y2) === KING)))
  );
}

function executeMove(board, fromX, fromY, toX, toY) {
  const piece = getPiece(board, fromX, fromY);
  const newBoard = cloneBoard(board);
  movePiece(newBoard, fromX, fromY, toX, toY, EMPTY);
  const turn = isPieceForTurn(piece, true);

  const captures = [];
  if (toY - 2 >= 0 && check(board, toX, toY - 1, toX, toY - 2, turn)) {
    deletePiece(newBoard, toX, toY - 1);
    captures.push([toX, toY - 1]);
  }
  if (toY + 2 < SIZE && check(board, toX, toY + 1, toX, toY + 2, turn)) {
    deletePiece(newBoard, toX, toY + 1);
    captures.push([toX, toY + 1]);
  }
  if (toX - 2 >= 0 && check(board, toX - 1, toY, toX - 2, toY, turn)) {
    deletePiece(newBoard, toX - 1, toY);
    captures.push([toX - 1, toY]);
  }
  if (toX + 2 < SIZE && check(board, toX + 1, toY, toX + 2, toY, turn)) {
    deletePiece(newBoard, toX + 1, toY);
    captures.push([toX + 1, toY]);
  }

  return [newBoard, captures];
}

const GAME_CONTINUES = 0;
const ATTACKER_WIN = 1;
const DEFENDER_WIN = 2;
const DRAW = 3;

function endStateToString(endState) {
  if (endState === GAME_CONTINUES) {
    return "game continues";
  } else if (endState === ATTACKER_WIN) {
    return "attacker win";
  } else if (endState === DEFENDER_WIN) {
    return "defender win";
  } else if (endState === DRAW) {
    return "draw";
  }
  return "<unknown end condition>";
}

function areBoardEqual(boardA, boardB) {
  return boardA.toString() === boardB.toString();
}

function isRepetition(history) {
  let lastHistory = history[history.length - 1];
  for (let i = history.length - 2; i >= 0; i--) {
    if (areBoardEqual(history[i].board, lastHistory.board)) {
      return true;
    }
  }
  return false;
}

const VISITED = -1;

function getKingPosition(board) {
  for (let x = 0; x < SIZE; ++x) {
    for (let y = 0; y < SIZE; ++y) {
      if (getPiece(board, x, y) === KING) {
        return [x, y];
      }
    }
  }
}

function isKingCaptured(board) {
  const [x, y] = getKingPosition(board);
  return (
    x > 0 &&
    x < SIZE - 1 &&
    y > 0 &&
    y < SIZE - 1 &&
    getPiece(board, x - 1, y) === ATTACKER &&
    getPiece(board, x + 1, y) === ATTACKER &&
    getPiece(board, x, y - 1) === ATTACKER &&
    getPiece(board, x, y + 1) === ATTACKER
  );
}

function isDefenderSurrounded(board) {
  const [king_x, king_y] = getKingPosition(board);

  const flooded_board = board.slice();

  const queue = [[king_x, king_y]];
  const edges = [];

  // Return true if we run into an impossibility
  function checkAndAdd(x, y) {
    // If we run into an edge, this means we are not surrounded
    if (x < 0 || x > SIZE - 1 || y < 0 || y > SIZE - 1) {
      return true;
    }

    const piece = flooded_board[x * SIZE + y];
    if (piece === ATTACKER) {
      edges.push([x, y]);
      return false;
    }

    // We already visited them
    if (piece === VISITED || piece === KING) {
      return false;
    }
    queue.push([x, y]);
    flooded_board[x * SIZE + y] = VISITED;
    return false;
  }

  // Flood fill
  while (queue.length > 0) {
    const position = queue.pop();
    const [x, y] = position;
    if (
      checkAndAdd(x + 1, y) ||
      checkAndAdd(x - 1, y) ||
      checkAndAdd(x, y + 1) ||
      checkAndAdd(x, y - 1)
    ) {
      // We ran into an edge, we are not surrounded
      return false;
    }
  }

  function canPositionBeCaptured(x, y) {
    if (x < 0 || x > SIZE - 1 || y < 0 || y > SIZE - 1) {
      return false;
    }
    if (isSpecialSquare(x, y)) {
      return true;
    }
    const piece = flooded_board[x * SIZE + y];
    if (piece === VISITED || piece === DEFENDER || piece === KING) {
      return true;
    }
    return false;
  }

  // If we can capture a piece that forms the edge, we can still make progress
  // and maybe open the wall
  for (let i = 0; i < edges.length; ++i) {
    const [x, y] = edges[i];
    if (
      (canPositionBeCaptured(x - 1, y) && canPositionBeCaptured(x + 1, y)) ||
      (canPositionBeCaptured(x, y - 1) && canPositionBeCaptured(x, y + 1))
    ) {
      return false;
    }
  }

  // Check that there are no defenders outside of the walls
  for (let i = 0; i < flooded_board.length; ++i) {
    if (flooded_board[i] === DEFENDER) {
      return false;
    }
  }

  // We haven't run into any impossibility of being surrounded, so we must be surrounded
  return true;
}

function hasKingEscapedFort(board) {
  const [king_x, king_y] = getKingPosition(board);
  // King must be on the edge
  if (
    !(
      king_x === 0 ||
      king_x === SIZE - 1 ||
      king_y === 0 ||
      king_y === SIZE - 1
    )
  ) {
    return false;
  }

  const flooded_board = board.slice();

  const queue = [[king_x, king_y]];
  const edges = [];
  let has_seen_an_empty_space = false;

  // Return true if we run into an impossibility
  function checkAndAdd(x, y) {
    // If we run into an edge, if it's the king's edge we don't add it to the queue,
    // if it is not, we reached the outside and we don't have a fort.
    if (x < 0) {
      return king_x !== 0;
    }
    if (x > SIZE - 1) {
      return king_x !== SIZE - 1;
    }
    if (y < 0) {
      return king_y !== 0;
    }
    if (y > SIZE - 1) {
      return king_y !== SIZE - 1;
    }

    const piece = flooded_board[x * SIZE + y];
    // If we run into an attacker, we don't have a fort
    if (piece === ATTACKER) {
      return true;
    }

    if (piece === DEFENDER) {
      edges.push([x, y]);
      return false;
    }
    if (piece === EMPTY) {
      has_seen_an_empty_space = true;
    }

    // We already visited them
    if (piece === VISITED || piece === KING) {
      return false;
    }
    queue.push([x, y]);
    flooded_board[x * SIZE + y] = VISITED;
    return false;
  }

  // Flood fill
  while (queue.length > 0) {
    const position = queue.pop();
    const [x, y] = position;
    if (
      checkAndAdd(x + 1, y) ||
      checkAndAdd(x - 1, y) ||
      checkAndAdd(x, y + 1) ||
      checkAndAdd(x, y - 1)
    ) {
      // We ran into an impossibility of a fort existing, this is not a fort exit
      return false;
    }
  }

  function canPositionBeCaptured(x, y) {
    if (x < 0 || x > SIZE - 1 || y < 0 || y > SIZE - 1) {
      return false;
    }
    if (isSpecialSquare(x, y)) {
      return false;
    }
    const piece = flooded_board[x * SIZE + y];
    if (piece === EMPTY || piece === ATTACKER) {
      return true;
    }
    return false;
  }

  // There must be at least one empty space
  if (!has_seen_an_empty_space) {
    return false;
  }

  for (let i = 0; i < edges.length; ++i) {
    const [x, y] = edges[i];
    if (
      (canPositionBeCaptured(x - 1, y) && canPositionBeCaptured(x + 1, y)) ||
      (canPositionBeCaptured(x, y - 1) && canPositionBeCaptured(x, y + 1))
    ) {
      return false;
    }
  }

  // We haven't run into any impossibility of a fort existing, so it must exist
  return true;
}

function hasKingEscapedFromCorner(board) {
  const [x, y] = getKingPosition(board);
  return isExitSquare(x, y);
}

function isPlayerUnableToMove(board, turn) {
  for (let i = 0; i < board.pieces.length; ++i) {
    const piece = board.pieces[i];
    if (piece.deleted || !isPieceForTurn(piece.type, turn)) {
      continue;
    }
    const moves = getLegalMoves(board, piece.x, piece.y);
    if (moves.length > 0) {
      return false;
    }
  }
  return true;
}

function getEndState(board, history, turn) {
  if (isRepetition(history)) {
    return ATTACKER_WIN;
  }
  if (isDefenderSurrounded(board)) {
    return ATTACKER_WIN;
  }
  if (isKingCaptured(board)) {
    return ATTACKER_WIN;
  }
  if (hasKingEscapedFromCorner(board)) {
    return DEFENDER_WIN;
  }
  if (hasKingEscapedFort(board)) {
    return DEFENDER_WIN;
  }
  if (isPlayerUnableToMove(board, turn)) {
    if (turn === ATTACKER_TURN) {
      return DEFENDER_WIN;
    } else {
      return ATTACKER_WIN;
    }
  }

  return GAME_CONTINUES;
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

// https://github.com/jslater89/OpenTafl/blob/master/opentafl-notation-spec.txt
function boardToString(board) {
  let result = "/";
  for (let y = 0; y < SIZE; ++y) {
    let emptyCount = 0;
    for (let x = 0; x < SIZE; ++x) {
      const piece = getPiece(board, x, y);
      if (piece === EMPTY) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          result += emptyCount;
          emptyCount = 0;
        }
        if (piece === KING) {
          result += "K";
        } else if (piece === DEFENDER) {
          result += "T";
        } else {
          result += "t";
        }
      }
    }
    if (emptyCount > 0) {
      result += emptyCount;
      emptyCount = 0;
    }
    result += "/";
  }
  return result;
}

function parseBoard(string) {
  const board = Array(SIZE * SIZE).fill(EMPTY);
  board.pieces = [];

  string.split("/").forEach((line, y) => {
    let x = 0;
    for (let i = 0; i < line.length; ++i) {
      const numEmpty = +line[i];
      if (!isNaN(numEmpty)) {
        x += numEmpty;
      } else {
        const piece =
          line[i] === "T" ? DEFENDER : line[i] === "K" ? KING : ATTACKER;
        addPiece(board, x, y - 1, piece);
        x++;
      }
    }
  });

  return board;
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
            const darkness = getDarkness(x, y);
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
                  getDarkness(x, y) &&
                  !getDarkness(x + 1, y) &&
                  !getDarkness(x, y - 1)
                    ? " border-top-right"
                    : "") +
                  (x > 0 &&
                  y > 0 &&
                  getDarkness(x, y) &&
                  !getDarkness(x - 1, y) &&
                  !getDarkness(x, y - 1)
                    ? " border-top-left"
                    : "") +
                  (x < SIZE - 1 &&
                  y < SIZE - 1 &&
                  getDarkness(x, y) &&
                  !getDarkness(x + 1, y) &&
                  !getDarkness(x, y + 1)
                    ? " border-bottom-right"
                    : "") +
                  (x > 0 &&
                  y < SIZE - 1 &&
                  getDarkness(x, y) &&
                  !getDarkness(x - 1, y) &&
                  !getDarkness(x, y + 1)
                    ? " border-bottom-left"
                    : "")
                }
                key={"col-" + x}
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
            key={"piece-" + piece.id}
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
  board: parseBoard(
    "/3ttttt3/5t5/11/t4T4t/t3TTT3t/tt1TTKTT1tt/t3TTT3t/t4T4t/11/5t5/3ttttt3/"
  ),
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
        {endStateToString(
          getEndState(gameState.board, gameState.history, gameState.turn)
        )}
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
              const [nextBoard, captures] = executeMove(
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
                  captures,
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
        <button
          onClick={() => {
            setGameState(INITIAL_GAME_STATE);
          }}
        >
          Reset
        </button>
        <h3>History</h3>
        <button
          disabled={historyIndex === 0 || gameState.history.length === 0}
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
          disabled={historyIndex === 0 || gameState.history.length === 0}
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
              key={"move-" + i}
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
              <span
                className={
                  "move-count" + (i % 2 === 0 ? " attacker" : " defender")
                }
              >
                #{Math.floor((i + 2) / 2)}
              </span>{" "}
              {positionToString(historyMove.move[0], historyMove.move[1])}-
              {positionToString(historyMove.move[2], historyMove.move[3])}
              {historyMove.captures.length > 0
                ? historyMove.captures
                    .map((capture) => "x" + positionToString(...capture))
                    .join("")
                : ""}
            </li>
          ))}
        </ul>
        <ImportHistory
          onClick={(historyString) => {
            const moves = parseMoves(historyString);
            const initialBoard = INITIAL_GAME_STATE.board;
            let board = initialBoard;
            let history = [];
            let turn = ATTACKER_TURN;
            for (let i = 0; i < moves.length; i++) {
              const move = moves[i];
              let captures;
              [board, captures] = executeMove(board, ...move);
              history.push({ move, board, turn, captures });
              turn = !turn;
            }
            const move = history[history.length - 1];
            setGameState({
              board: move.board,
              selected: null,
              turn: move.turn,
              lastMove: move.move,
              history
            });
          }}
        />
        <ImportBoard
          currentBoardString={boardToString(gameState.board)}
          key={boardToString(gameState.board)}
          onClick={(boardString) => {
            setGameState({
              board: parseBoard(boardString),
              selected: null,
              turn: ATTACKER_TURN,
              lastMove: null,
              history: []
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
      <button onClick={() => onClick(historyString)}>Import History</button>
    </div>
  );
}

function ImportBoard({ onClick, currentBoardString }) {
  const [boardString, setBoardString] = useState(currentBoardString);
  return (
    <div>
      <input
        type="text"
        value={boardString}
        onChange={(e) => setBoardString(e.target.value)}
      />
      <button onClick={() => onClick(boardString)}>Import Board</button>
    </div>
  );
}
