function Cell({ row, col, agentPosition }) {
  const isAgent = agentPosition.row === row && agentPosition.col === col;

  return (
    <div className={`cell ${isAgent ? "agent-cell" : ""}`}>
      {isAgent ? "🤖" : `${row + 1},${col + 1}`}
    </div>
  );
}

export default Cell;