import { ReactNode, createContext, useCallback, useContext, useState } from "react";

type Move = null | 1 | 0;

const NEW_GAME = new Array(9).fill(null) as Move[];

interface GameState {
  moves: Move[];
  gameOver: boolean;
  firstPlayerTurn: boolean; // false means it's second player turn
  winner?: number[];
}

interface GameStateWithSetter extends GameState {
  setState: React.Dispatch<React.SetStateAction<GameState>>;
}

const INITIAL_GAME_STATE: GameState = {
  moves: NEW_GAME,
  gameOver: false,
  firstPlayerTurn: true,
};

const INITIAL_CONTEXT_STATE: GameStateWithSetter = {
  ...INITIAL_GAME_STATE,
  setState: () => {
    /* do nothing */
  },
};

const GameStateContext = createContext<GameStateWithSetter>(INITIAL_CONTEXT_STATE);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(INITIAL_GAME_STATE);

  return <GameStateContext.Provider value={{ ...state, setState }}>{children}</GameStateContext.Provider>;
}

export function useGameState() {
  const { moves, gameOver, winner, firstPlayerTurn } = useContext(GameStateContext);
  return {
    moves,
    gameOver,
    winner,
    firstPlayerTurn,
  };
}

export function useUpdateState() {
  const { setState } = useContext(GameStateContext);

  return useCallback(
    (newState: Partial<Omit<GameState, "setState">>) => {
      setState((state) => ({ ...state, ...newState }));
    },
    [setState]
  );
}
