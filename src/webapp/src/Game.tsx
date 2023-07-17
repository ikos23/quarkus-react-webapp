import { useGameState } from "./GameStateContext";
import GameBoard from "./components/GameBoard";
import GameStatus from "./components/GameStatus";
import { useNextPlayerMove } from "./gameplay";
import { useQuery } from "@tanstack/react-query";

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

export default function Game() {
  const newGameQuery = useNewGameQuery();

  const { moves, winner, gameOver, firstPlayerTurn } = useGameState();
  const doNextMove = useNextPlayerMove(newGameQuery.data);

  return (
    <div className="container">
      <GameBoard moves={moves} doNextMove={doNextMove} gameOver={gameOver} winner={winner} />
      <GameStatus gameOver={gameOver} firstTurn={firstPlayerTurn} winner={!!winner} />
    </div>
  );
}

function useNewGameQuery() {
  return useQuery(
    ["newGame"],
    async () => {
      const resp = await fetch("/api/games/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        throw new Error("Something went wrong!");
      }

      return resp.json() as Promise<IGame>;
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
}
