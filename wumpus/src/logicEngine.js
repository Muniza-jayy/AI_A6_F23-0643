// ---------- Variable Helpers ----------

export function cellKey(row, col) {
  return `${row}_${col}`;
}

export function pitVar(row, col) {
  return `P_${row}_${col}`;
}

export function wumpusVar(row, col) {
  return `W_${row}_${col}`;
}

export function breezeVar(row, col) {
  return `B_${row}_${col}`;
}

export function stenchVar(row, col) {
  return `S_${row}_${col}`;
}

export function negate(literal) {
  return literal.startsWith("~") ? literal.slice(1) : `~${literal}`;
}

// ---------- Clause Helpers ----------

function normalizeClause(clause) {
  return [...new Set(clause)].sort();
}

function clauseKey(clause) {
  return normalizeClause(clause).join("|");
}

function isTautology(clause) {
  return clause.some((literal) => clause.includes(negate(literal)));
}

// ---------- Knowledge Base ----------

export function createInitialKB() {
  return [
    [negate(pitVar(0, 0))],
    [negate(wumpusVar(0, 0))],
  ];
}

export function addPerceptToKB(kb, agentPosition, percepts, rows, cols, getAdjacentCells) {
  const newKB = [...kb];

  const { row, col } = agentPosition;
  const neighbors = getAdjacentCells(row, col, rows, cols);

  const breeze = breezeVar(row, col);
  const stench = stenchVar(row, col);

  if (percepts.breeze) {
    newKB.push([breeze]);

    // B(x,y) -> P(neighbor1) OR P(neighbor2) ...
    newKB.push([
      negate(breeze),
      ...neighbors.map((cell) => pitVar(cell.row, cell.col)),
    ]);
  } else {
    newKB.push([negate(breeze)]);

    // No breeze means no adjacent pits
    neighbors.forEach((cell) => {
      newKB.push([negate(pitVar(cell.row, cell.col))]);
    });
  }

  if (percepts.stench) {
    newKB.push([stench]);

    // S(x,y) -> W(neighbor1) OR W(neighbor2) ...
    newKB.push([
      negate(stench),
      ...neighbors.map((cell) => wumpusVar(cell.row, cell.col)),
    ]);
  } else {
    newKB.push([negate(stench)]);

    // No stench means no adjacent Wumpus
    neighbors.forEach((cell) => {
      newKB.push([negate(wumpusVar(cell.row, cell.col))]);
    });
  }

  // Current cell is safe because agent is standing there
  newKB.push([negate(pitVar(row, col))]);
  newKB.push([negate(wumpusVar(row, col))]);

  return removeDuplicateClauses(newKB);
}

function removeDuplicateClauses(clauses) {
  const seen = new Set();
  const result = [];

  for (const clause of clauses) {
    const normalized = normalizeClause(clause);
    const key = clauseKey(normalized);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(normalized);
    }
  }

  return result;
}

// ---------- Resolution Refutation ----------

export function resolveClauses(clauseA, clauseB) {
  const resolvents = [];

  for (const literal of clauseA) {
    const opposite = negate(literal);

    if (clauseB.includes(opposite)) {
      const newClause = [
        ...clauseA.filter((item) => item !== literal),
        ...clauseB.filter((item) => item !== opposite),
      ];

      const normalized = normalizeClause(newClause);

      if (!isTautology(normalized)) {
        resolvents.push(normalized);
      }
    }
  }

  return resolvents;
}

export function resolutionRefutation(kb, queryLiteral) {
  let clauses = removeDuplicateClauses([
    ...kb,
    [negate(queryLiteral)], // assume opposite of query
  ]);

  const seen = new Set(clauses.map(clauseKey));
  let inferenceSteps = 0;

  while (true) {
    const newClauses = [];

    for (let i = 0; i < clauses.length; i++) {
      for (let j = i + 1; j < clauses.length; j++) {
        inferenceSteps++;

        const resolvents = resolveClauses(clauses[i], clauses[j]);

        for (const resolvent of resolvents) {
          if (resolvent.length === 0) {
            return {
              proven: true,
              inferenceSteps,
            };
          }

          const key = clauseKey(resolvent);

          if (!seen.has(key)) {
            seen.add(key);
            newClauses.push(resolvent);
          }
        }
      }
    }

    if (newClauses.length === 0) {
      return {
        proven: false,
        inferenceSteps,
      };
    }

    clauses = [...clauses, ...newClauses];
  }
}

// ---------- Ask Safety ----------

export function askIfSafe(kb, row, col) {
  const noPitQuery = negate(pitVar(row, col));
  const noWumpusQuery = negate(wumpusVar(row, col));

  const pitResult = resolutionRefutation(kb, noPitQuery);
  const wumpusResult = resolutionRefutation(kb, noWumpusQuery);

  return {
    safe: pitResult.proven && wumpusResult.proven,
    noPitProven: pitResult.proven,
    noWumpusProven: wumpusResult.proven,
    inferenceSteps: pitResult.inferenceSteps + wumpusResult.inferenceSteps,
  };
}