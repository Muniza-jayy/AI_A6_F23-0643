export function getAdjacentCells(row, col, rows, cols) {
  const possibleCells = [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ];

  return possibleCells.filter(
    (cell) =>
      cell.row >= 0 &&
      cell.row < rows &&
      cell.col >= 0 &&
      cell.col < cols
  );
}

export function getCurrentPercepts(agentPosition, hazards, rows, cols) {
  const adjacentCells = getAdjacentCells(
    agentPosition.row,
    agentPosition.col,
    rows,
    cols
  );

  const breeze = adjacentCells.some((cell) =>
    hazards.pits.some(
      (pit) => pit.row === cell.row && pit.col === cell.col
    )
  );

  const stench =
    hazards.wumpus &&
    adjacentCells.some(
      (cell) =>
        hazards.wumpus.row === cell.row &&
        hazards.wumpus.col === cell.col
    );

  return {
    breeze,
    stench,
  };
}