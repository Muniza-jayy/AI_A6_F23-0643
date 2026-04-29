import Cell from "./Cell";

function Grid({ rows, cols }) {
  const grid = [];

  for (let row = 0; row < rows; row++) {
    const currentRow = [];

    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
      });
    }

    grid.push(currentRow);
  }

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 60px)`,
      }}
    >
      {grid.map((row) =>
        row.map((cell) => (
          <Cell key={`${cell.row}-${cell.col}`} row={cell.row} col={cell.col} />
        ))
      )}
    </div>
  );
}

export default Grid;