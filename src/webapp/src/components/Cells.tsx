import { FC } from "react";
import OShape from "./OShape";
import XShape from "./XShape";

interface TakenCellProps {
  winCell: boolean;
  component: FC<{ winCell: boolean }>;
}

function TakenCell({ winCell, component: Component }: TakenCellProps) {
  const classes = "cell" + `${winCell ? " win" : ""}`;
  return (
    <div className={classes}>
      <Component winCell={winCell} />
    </div>
  );
}

function XMoveCell({ winCell }: { winCell: boolean }) {
  return <TakenCell winCell={winCell} component={XShape} />;
}

function OMoveCell({ winCell }: { winCell: boolean }) {
  return <TakenCell winCell={winCell} component={OShape} />;
}

function EmptyCell({ onClick }: { onClick: () => void }) {
  return <div className="cell" onClick={onClick}></div>;
}

export default {
  EmptyCell,
  XMoveCell,
  OMoveCell,
};
