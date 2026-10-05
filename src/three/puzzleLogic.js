// Interactive 3x3 Vector Grid Escape Logic

export const DIRECTIONS = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

export const DELTAS = [
  { r: -1, c: 0 }, // UP
  { r: 0, c: 1 },  // RIGHT
  { r: 1, c: 0 },  // DOWN
  { r: 0, c: -1 }, // LEFT
];

// Curated levels that require strategic rotations to reach the Escape Gate
export const PUZZLE_LEVELS = [
  {
    id: 1,
    name: "VECTOR INITIALIZATION",
    difficulty: "EASY",
    gridSize: 3,
    start: { r: 2, c: 0 }, // Bottom Left
    exit: { r: 0, c: 2 },  // Top Right
    // Initial arrow directions (0=UP, 1=RIGHT, 2=DOWN, 3=LEFT)
    initial: [
      1, 1, 1, // 0, 1, 2 (exit is at 2 pointing right to freedom)
      0, 2, 0, // 3, 4, 5
      2, 1, 0, // 6, 7, 8 (start is at 6)
    ],
  },
  {
    id: 2,
    name: "CIRCUIT OVERLOAD",
    difficulty: "MEDIUM",
    gridSize: 3,
    start: { r: 2, c: 0 },
    exit: { r: 0, c: 2 },
    initial: [
      2, 3, 1,
      1, 0, 0,
      1, 2, 3,
    ],
  },
  {
    id: 3,
    name: "QUANTUM DEFLECTION",
    difficulty: "EXPERT",
    gridSize: 3,
    start: { r: 2, c: 0 },
    exit: { r: 0, c: 2 },
    initial: [
      3, 2, 0,
      1, 3, 0,
      0, 1, 2,
    ],
  },
];

// Trace connected path from start
export function tracePath(grid, gridSize = 3, start = { r: 2, c: 0 }, exit = { r: 0, c: 2 }) {
  const path = [];
  const visited = new Set();

  let curR = start.r;
  let curC = start.c;

  while (curR >= 0 && curR < gridSize && curC >= 0 && curC < gridSize) {
    const idx = curR * gridSize + curC;
    if (visited.has(idx)) break; // Loop detected
    visited.add(idx);
    path.push(idx);

    // If we've reached the exit node
    if (curR === exit.r && curC === exit.c) {
      return { path, isSolved: true };
    }

    const dir = grid[idx];
    const delta = DELTAS[dir];
    curR += delta.r;
    curC += delta.c;
  }

  return { path, isSolved: false };
}
