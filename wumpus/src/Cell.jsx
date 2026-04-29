function Cell({ row, col, agentPosition, hazards }) {
  const isAgent = agentPosition.row === row && agentPosition.col === col;

  const hasPit = hazards.pits.some(
    (pit) => pit.row === row && pit.col === col
  );

  const hasWumpus =
    hazards.wumpus &&
    hazards.wumpus.row === row &&
    hazards.wumpus.col === col;

  let cellClass = "cell";
  let content = `${row + 1},${col + 1}`;

  if (hasPit) {
    cellClass += " pit-cell";
    content = "💀";
  }

  if (hasWumpus) {
    cellClass += " wumpus-cell";
    content = "👾";
  }

  if (isAgent) {
    cellClass += " agent-cell";
    content = "🤖";
  }

  return <div className={cellClass}>{content}</div>;
}

export default Cell;