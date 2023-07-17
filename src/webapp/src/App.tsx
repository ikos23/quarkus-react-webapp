import { GameStateProvider } from "./GameStateContext";
import Game from "./Game";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameStateProvider>
        <Game />
      </GameStateProvider>
    </QueryClientProvider>
  );
}

export default App;
