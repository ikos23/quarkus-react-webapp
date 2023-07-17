import { useCallback } from "react";
import { useGameState, useUpdateState } from "./GameStateContext";
import { useMutation } from "@tanstack/react-query";

interface IGame {
  id: number;
  name: string;
  players: Array<{
    id: number;
    name: string;
    moves: Array<{
      cellIndex: number;
    }>;
  }>;
}

const WINNERS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function isWinnerCell(winner: number[], indexToCheck: number) {
  return winner.includes(indexToCheck);
}

export function useNextPlayerMove(game?: IGame) {
  const state = useGameState();
  const updateState = useUpdateState();

  const newMoveMutation = useMutation(
    ({ gameId, playerId, move }: { gameId: number; playerId: number; move: number }) => {
      return fetch(`/api/games/${gameId}/players/${playerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cellIndex: move }),
      });
    }
  );

  return useCallback(
    (cellIndex: number) => {
      const newMove = state.firstPlayerTurn ? 1 : 0;

      const movesUpdated = [...state.moves];
      movesUpdated[cellIndex] = newMove;

      const winner = tryFindWinner(movesUpdated);
      const noMoreMoves = canMakeMove(movesUpdated) === false;
      const gameOver = !!winner || noMoreMoves;

      if (game) {
        newMoveMutation.mutate({
          gameId: game.id,
          playerId: state.firstPlayerTurn ? game.players[0]!.id : game.players[1]!.id,
          move: cellIndex,
        });
      }

      updateState({
        firstPlayerTurn: gameOver ? state.firstPlayerTurn : !state.firstPlayerTurn,
        moves: movesUpdated,
        winner,
        gameOver: gameOver,
      });
    },
    [state.firstPlayerTurn, state.moves, game, updateState, newMoveMutation]
  );
}

function tryFindWinner(moves: Array<1 | 0 | null>) {
  return WINNERS.find(
    ([first, second, third]) =>
      moves[first] !== null && moves[first] === moves[second] && moves[second] === moves[third]
  );
}

function canMakeMove(moves: Array<1 | 0 | null>) {
  return moves.some((el) => el === null);
}
