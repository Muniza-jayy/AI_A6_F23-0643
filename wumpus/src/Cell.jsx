function Cell({ row, col }) {
  return (
    <div className="cell">
      {row + 1},{col + 1}
    </div>
  );
}

export default Cell;
