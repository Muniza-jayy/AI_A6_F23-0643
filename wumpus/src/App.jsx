import { useState } from "react";
import Grid from "./Grid";
import "./App.css";
import { getAdjacentCells, getCurrentPercepts } from "./worldLogic";
import { createInitialKB, addPerceptToKB, askIfSafe } from "./logicEngine";

function App() {
  const [rows, setRows] = useState(7);
  const [cols, setCols] = useState(4);
  const [agentPosition, setAgentPosition] = useState({ row: 0, col: 0 });
  const [hazards, setHazards] = useState({ pits: [], wumpus: null });
  const [kb, setKb] = useState(createInitialKB());
  const [inferenceSteps, setInferenceSteps] = useState(0);
  const [safeCells, setSafeCells] = useState([{ row: 0, col: 0 }]);

  const currentPercepts = getCurrentPercepts(
    agentPosition,
    hazards,
    rows,
    cols,
  );

  return (
    <div className="app">
      <header className="header">
        <div className="logo">☠️</div>

        <div>
          <h1>
            Dynamic Wumpus <span>Logic</span> Agent
          </h1>
          <p>Knowledge-Based Agent using Propositional Logic & Resolution</p>
        </div>

        <button className="about-btn">ⓘ About Project</button>
      </header>

      <main className="layout">
        <aside className="left-panel">
          <div className="card">
            <h2>Environment Setup</h2>

            <label>Rows</label>
            <select
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            >
              {[4, 5, 6, 7, 8].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>

            <label>Columns</label>
            <select
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
            >
              {[4, 5, 6, 7, 8].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>

            <button className="primary-btn" onClick={generateWorld}>
              🪄 Generate World
            </button>
            <button className="secondary-btn">↻ Reset World</button>
          </div>

          <div className="card cyan-border">
            <h2>Agent Controls</h2>
            <button className="green-btn" onClick={updateKnowledge}>
              🧠 Update Knowledge
            </button>
            <button className="disabled-btn">Step by Step »</button>
            <button className="disabled-btn">🤖 Auto Solve</button>
          </div>

          <div className="wood-sign">
            Find the Gold <br />
            Avoid Pits & Wumpus!
          </div>
          <div className="card cyan-border">
            <h2>Current Agent Status</h2>

            <p>
              <strong>Position:</strong> ({agentPosition.row + 1},{" "}
              {agentPosition.col + 1})
            </p>
            <p>
              <strong>Inference Steps:</strong> {inferenceSteps}
            </p>

            <p>
              <strong>KB Clauses:</strong> {kb.length}
            </p>
            <p>
              <strong>Percepts:</strong>{" "}
              {!currentPercepts.breeze && !currentPercepts.stench && "None"}
              {currentPercepts.breeze && "🌀 Breeze "}
              {currentPercepts.stench && "〰️ Stench"}
            </p>
          </div>
        </aside>

        <section className="grid-panel">
          <h2>▦ Wumpus World Grid</h2>
          <Grid
            rows={rows}
            cols={cols}
            agentPosition={agentPosition}
            hazards={hazards}
            safeCells={safeCells}
          />
        </section>

        <aside className="right-panel">
          <div className="card cyan-border">
            <h2>Legend</h2>

            <div className="legend-item">
              🤖 <span>Agent</span>
            </div>
            <div className="legend-item">
              🟢 <span>Safe Cell</span>
            </div>
            <div className="legend-item">
              ⚪ <span>Unknown Cell</span>
            </div>
            <div className="legend-item">
              🌀 <span>Breeze</span>
            </div>
            <div className="legend-item">
              〰️ <span>Stench</span>
            </div>
            <div className="legend-item">
              💀 <span>Pit</span>
            </div>
            <div className="legend-item">
              👾 <span>Wumpus</span>
            </div>
            <div className="legend-item">
              ⭐ <span>Gold</span>
            </div>
          </div>

          <div className="card cyan-border">
            <h2 className="yellow">How to Play</h2>
            <p>1. Click Generate World</p>
            <p>2. Agent explores the world</p>
            <p>3. Uses logic to stay safe</p>
            <p>4. Find the gold and win!</p>
          </div>

          <div className="wumpus-doodle">👾</div>
        </aside>
      </main>

      <footer>AI Assignment 6 • Knowledge-Based Agent • Wumpus World 💜</footer>
    </div>
  );


function generateWorld() {
  const pitCount = Math.max(1, Math.floor(rows * cols * 0.18));
  const usedCells = new Set(["0-0"]);

  const pits = [];

  while (pits.length < pitCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    const key = `${row}-${col}`;

    if (!usedCells.has(key)) {
      pits.push({ row, col });
      usedCells.add(key);
    }
  }

  let wumpus = null;

  while (!wumpus) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    const key = `${row}-${col}`;

    if (!usedCells.has(key)) {
      wumpus = { row, col };
      usedCells.add(key);
    }
  }

  // 🔥 Set hazards first
  setHazards({ pits, wumpus });

  // 🔥 Reset AI state AFTER world is ready
  const initialKB = createInitialKB();
  setKb(initialKB);
  setSafeCells([{ row: 0, col: 0 }]);
  setInferenceSteps(0);
  setAgentPosition({ row: 0, col: 0 });
}

function updateKnowledge() {
  const updatedKB = addPerceptToKB(
    kb,
    agentPosition,
    currentPercepts,
    rows,
    cols,
    getAdjacentCells,
  );

  const neighbors = getAdjacentCells(
    agentPosition.row,
    agentPosition.col,
    rows,
    cols,
  );

  let totalSteps = 0;
  const newlySafeCells = [...safeCells];

  neighbors.forEach((cell) => {
    const result = askIfSafe(updatedKB, cell.row, cell.col);
    totalSteps += result.inferenceSteps;

    if (result.safe) {
      const alreadyExists = newlySafeCells.some(
        (safe) => safe.row === cell.row && safe.col === cell.col,
      );

      if (!alreadyExists) {
        newlySafeCells.push(cell);
      }
    }
  });

  setKb(updatedKB);
  setSafeCells(newlySafeCells);
  setInferenceSteps((prev) => prev + totalSteps);
}

}

export default App;