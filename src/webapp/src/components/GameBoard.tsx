import { isWinnerCell } from "../gameplay";
import Cells from "./Cells";
import { Overlay } from "./Overlay";

type Move = null | 1 | 0;

interface GameBoardProps {
  moves: Move[];
  doNextMove: (cell: number) => void;
  winner?: number[];
  gameOver: boolean;
}

export default function GameBoard({ moves, doNextMove, gameOver, winner }: GameBoardProps) {
  return (
    <div className="board">
      {moves.map((item, index) => {
        if (item === 1) {
          return <Cells.XMoveCell winCell={!!winner && isWinnerCell(winner, index)} key={index} />;
        } else if (item === 0) {
          return <Cells.OMoveCell winCell={!!winner && isWinnerCell(winner, index)} key={index} />;
        } else {
          return <Cells.EmptyCell onClick={() => doNextMove(index)} key={index} />;
        }
      })}
      {gameOver && <Overlay />}
    </div>
  );
}
