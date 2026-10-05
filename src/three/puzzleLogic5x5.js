// 5x5 Arrow Grid Puzzle Engine
// Direction indices: 0 = UP, 1 = RIGHT, 2 = DOWN, 3 = LEFT

export const DIRS = [
  { r: -1, c: 0 }, // UP
  { r: 0, c: 1 },  // RIGHT
  { r: 1, c: 0 },  // DOWN
  { r: 0, c: -1 }, // LEFT
];

export const GRID_SIZE = 5;

// Initial 5x5 puzzle configuration
// Start is at (4, 0) [bottom-left, index 20]
// Exit is at (0, 4) [top-right, index 4]
// Pre-configured so 2-3 clicks align the complete path to freedom!
export const INITIAL_5X5_GRID = [
  // Row 0: indices 0..4 (Exit at index 4 pointing RIGHT)
  1, 1, 1, 1, 1,
  // Row 1: indices 5..9
  0, 2, 0, 0, 0,
  // Row 2: indices 10..14
  1, 1, 0, 3, 0,
  // Row 3: indices 15..19
  0, 3, 1, 2, 0,
  // Row 4: indices 20..24 (Start at index 20)
  0, 1, 0, 2, 3,
];

// Trace continuous path from START (row 4, col 0) towards EXIT (row 0, col 4)
export function traceGridPath(grid) {
  const startR = 4;
  const startC = 0;
  const exitR = 0;
  const exitC = 4;

  const path = [];
  const visited = new Set();

  let curR = startR;
  let curC = startC;

  while (curR >= 0 && curR < GRID_SIZE && curC >= 0 && curC < GRID_SIZE) {
    const idx = curR * GRID_SIZE + curC;
    if (visited.has(idx)) break; // cycle detected
    visited.add(idx);
    path.push(idx);

    if (curR === exitR && curC === exitC) {
      return { path, isSolved: true };
    }

    const dir = grid[idx];
    const delta = DIRS[dir];
    curR += delta.r;
    curC += delta.c;
  }

  return { path, isSolved: false };
}
