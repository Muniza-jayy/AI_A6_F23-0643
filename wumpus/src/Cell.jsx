import { getAdjacentCells } from "./worldLogic";
function Cell({ row, col, agentPosition, hazards, safeCells, rows, cols ,visitedCells = []}) {
  const isVisited = visitedCells.some(
  (cell) => cell.row === row && cell.col === col
);
if (isVisited) {
  cellClass += " visited-cell";
}

  // STEP 1: compute conditions
  const isAgent = agentPosition.row === row && agentPosition.col === col;

  const isSafe = safeCells.some(
    (cell) => cell.row === row && cell.col === col
  );

  const hasGold =
  hazards.gold &&
  hazards.gold.row === row &&
  hazards.gold.col === col;

  const hasPit = hazards.pits.some(
    (pit) => pit.row === row && pit.col === col
  );

  const hasWumpus =
    hazards.wumpus &&
    hazards.wumpus.row === row &&
    hazards.wumpus.col === col;

  const neighbors = getAdjacentCells(row, col, rows, cols);

  const hasBreeze = neighbors.some((cell) =>
    hazards.pits.some(
      (pit) => pit.row === cell.row && pit.col === cell.col
    )
  );

  const hasStench =
    hazards.wumpus &&
    neighbors.some(
      (cell) =>
        hazards.wumpus.row === cell.row &&
        hazards.wumpus.col === cell.col
    );

  // STEP 2: default UI
  let cellClass = "cell";
  let content = `${row + 1},${col + 1}`;

  // STEP 3: apply rules (priority order)

  if (isSafe) {
    cellClass += " safe-cell";
  }

  if (hasPit) {
    cellClass += " pit-cell";
    content = "💀";
  } 
  else if (hasWumpus) {
    cellClass += " wumpus-cell";
    content = "👾";
  }
  else if (hasGold) {
  cellClass += " gold-cell";
  content = "⭐";
}
  else {
    let symbols = "";

    if (hasBreeze) symbols += "🌀";
    if (hasStench) symbols += "〰️";

    if (symbols !== "") content = symbols;
  }
  
  if (isAgent) {
    cellClass += " agent-cell";
    content = "🤖";
  }

  return <div className={cellClass}>{content}</div>;
}

export default Cell;