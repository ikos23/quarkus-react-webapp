interface GameStatusProps {
  gameOver: boolean;
  firstTurn: boolean;
  winner: boolean;
}

export default function GameStatus(props: GameStatusProps) {
  if (props.gameOver) {
    return (
      <div>
        <div className="status">Game Over</div>
        {props.winner && <div className="status">Player {props.firstTurn ? "1 (x)" : "2 (o)"} won !</div>}
      </div>
    );
  } else if (props.firstTurn) {
    return <div className="status">Player 1 (x) Turn</div>;
  } else {
    return <div className="status">Player 2 (o) Turn</div>;
  }
}
