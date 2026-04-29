import { useState } from "react";
import Grid from "./Grid";
import "./App.css";

function App() {
  const [rows, setRows] = useState(7);
  const [cols, setCols] = useState(4);

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
            <select value={rows} onChange={(e) => setRows(Number(e.target.value))}>
              {[4, 5, 6, 7, 8].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>

            <label>Columns</label>
            <select value={cols} onChange={(e) => setCols(Number(e.target.value))}>
              {[4, 5, 6, 7, 8].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>

            <button className="primary-btn">🪄 Generate World</button>
            <button className="secondary-btn">↻ Reset World</button>
          </div>

          <div className="card cyan-border">
            <h2>Agent Controls</h2>
            <button className="green-btn">▶ Start Agent</button>
            <button className="disabled-btn">Step by Step »</button>
            <button className="disabled-btn">🤖 Auto Solve</button>
          </div>

          <div className="wood-sign">
            Find the Gold <br />
            Avoid Pits & Wumpus!
          </div>
        </aside>

        <section className="grid-panel">
          <h2>▦ Wumpus World Grid</h2>
          <Grid rows={rows} cols={cols} />
        </section>

        <aside className="right-panel">
          <div className="card cyan-border">
            <h2>Legend</h2>

            <div className="legend-item">🤖 <span>Agent</span></div>
            <div className="legend-item">🟢 <span>Safe Cell</span></div>
            <div className="legend-item">⚪ <span>Unknown Cell</span></div>
            <div className="legend-item">🌀 <span>Breeze</span></div>
            <div className="legend-item">〰️ <span>Stench</span></div>
            <div className="legend-item">💀 <span>Pit</span></div>
            <div className="legend-item">👾 <span>Wumpus</span></div>
            <div className="legend-item">⭐ <span>Gold</span></div>
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

      <footer>
        AI Assignment 6 • Knowledge-Based Agent • Wumpus World 💜
      </footer>
    </div>
  );
}

export default App;