// Authentic Arrow Maze Puzzle Level Data
// Matched directly to the mobile game "ARROWS: PUZZLE ESCAPE"
// Each arrow has:
// - id: unique identifier
// - dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
// - path: array of [x, y] coordinates forming the continuous winding body
// - exitVector: [vx, vy] direction the arrow flies when escaping
// - blockedBy: array of arrow ids that physically block this arrow's exit path

export const AUTHENTIC_MAZE_ARROWS = [
  // -------------------------------------------------------------
  // TOP ROW & UPPER CORRIDORS
  // -------------------------------------------------------------
  {
    id: 'T1_UP',
    dir: 'UP',
    path: [
      [-3.0, 1.8],
      [-3.0, 2.6],
    ],
    exitVector: [0, 8.0],
    blockedBy: [], // Free from the start!
  },
  {
    id: 'T2_SNAKE_RIGHT',
    dir: 'RIGHT',
    path: [
      [-0.4, 3.4],
      [0.2, 3.4],
      [0.2, 2.6],
      [1.8, 2.6],
      [1.8, 2.0],
      [2.8, 2.0],
    ],
    exitVector: [8.0, 0],
    blockedBy: [], // Free to escape right!
  },
  {
    id: 'T3_LONG_LEFT',
    dir: 'LEFT',
    path: [
      [2.8, 2.6],
      [-2.4, 2.6],
    ],
    exitVector: [-8.0, 0],
    blockedBy: ['T1_UP'], // Blocked by T1_UP on the left
  },
  {
    id: 'T4_TOP_SWEEP',
    dir: 'RIGHT',
    path: [
      [-2.6, 3.0],
      [-2.6, 2.0],
      [3.0, 2.0],
    ],
    exitVector: [8.0, 0],
    blockedBy: ['T2_SNAKE_RIGHT'],
  },

  // -------------------------------------------------------------
  // LEFT FLANK & CORNERS
  // -------------------------------------------------------------
  {
    id: 'L1_OUTER_UP',
    dir: 'UP',
    path: [
      [-3.6, -1.8],
      [-3.6, -0.6],
    ],
    exitVector: [0, 8.0],
    blockedBy: [], // Free to escape!
  },
  {
    id: 'L2_CORNER_LEFT',
    dir: 'LEFT',
    path: [
      [-2.4, 1.6],
      [-2.4, 1.0],
      [-3.6, 1.0],
    ],
    exitVector: [-8.0, 0],
    blockedBy: [], // Free to escape left!
  },
  {
    id: 'L3_VERTICAL_UP',
    dir: 'UP',
    path: [
      [-1.8, 0.4],
      [-1.8, 1.8],
    ],
    exitVector: [0, 8.0],
    blockedBy: ['T3_LONG_LEFT'],
  },
  {
    id: 'L4_HOOK_UP',
    dir: 'UP',
    path: [
      [-3.0, -0.4],
      [-3.0, 0.2],
      [-3.8, 0.2],
      [-3.8, 0.8],
    ],
    exitVector: [0, 8.0],
    blockedBy: ['L2_CORNER_LEFT'],
  },
  {
    id: 'L5_INNER_SQUARE_LEFT',
    dir: 'LEFT',
    path: [
      [-1.8, -0.2],
      [-2.6, -0.2],
      [-2.6, -0.8],
      [-1.8, -0.8],
      [-1.8, -0.5],
      [-2.4, -0.5],
    ],
    exitVector: [-8.0, 0],
    blockedBy: ['L4_HOOK_UP', 'L1_OUTER_UP'],
  },
  {
    id: 'L6_DOWN_CORRIDOR',
    dir: 'DOWN',
    path: [
      [-3.2, 0.0],
      [-3.2, -1.8],
    ],
    exitVector: [0, -8.0],
    blockedBy: ['B1_BASE_RIGHT'],
  },

  // -------------------------------------------------------------
  // CENTER & SPIRAL LABYRINTH
  // -------------------------------------------------------------
  {
    id: 'C1_UPPER_RUN_RIGHT',
    dir: 'RIGHT',
    path: [
      [-1.2, 1.8],
      [2.4, 1.8],
    ],
    exitVector: [8.0, 0],
    blockedBy: ['R1_LONG_UP'],
  },
  {
    id: 'C2_MINI_BOX_UP',
    dir: 'UP',
    path: [
      [1.0, 1.2],
      [2.2, 1.2],
      [2.2, 1.5],
    ],
    exitVector: [0, 8.0],
    blockedBy: ['C1_UPPER_RUN_RIGHT'],
  },
  {
    id: 'C3_WINDING_RIGHT',
    dir: 'RIGHT',
    path: [
      [-1.2, 0.6],
      [-1.2, 1.0],
      [1.8, 1.0],
    ],
    exitVector: [8.0, 0],
    blockedBy: ['R1_LONG_UP'],
  },
  {
    id: 'C4_SPIRAL_CORE',
    dir: 'RIGHT',
    path: [
      [-0.4, -1.4],
      [-0.4, -0.4],
      [0.6, -0.4],
      [0.6, -1.2],
      [0.0, -1.2],
      [0.0, -0.8],
      [0.4, -0.8],
    ],
    exitVector: [8.0, 0],
    blockedBy: ['C5_CENTER_SNAKE', 'R4_DOWN'],
  },
  {
    id: 'C5_CENTER_SNAKE',
    dir: 'LEFT',
    path: [
      [1.8, -0.4],
      [1.8, -0.8],
      [0.8, -0.8],
    ],
    exitVector: [-8.0, 0],
    blockedBy: ['C4_SPIRAL_CORE'],
  },
  {
    id: 'C6_LEFT_SPIRAL_BOX',
    dir: 'LEFT',
    path: [
      [-1.4, -1.4],
      [-1.4, -0.4],
      [-0.6, -0.4],
      [-0.6, -1.2],
      [-1.0, -1.2],
    ],
    exitVector: [-8.0, 0],
    blockedBy: ['L6_DOWN_CORRIDOR'],
  },

  // -------------------------------------------------------------
  // RIGHT FLANK & EAST CORRIDORS
  // -------------------------------------------------------------
  {
    id: 'R1_LONG_UP',
    dir: 'UP',
    path: [
      [2.8, -1.8],
      [2.8, 1.2],
    ],
    exitVector: [0, 8.0],
    blockedBy: ['T4_TOP_SWEEP'],
  },
  {
    id: 'R2_CORNER_RIGHT',
    dir: 'RIGHT',
    path: [
      [3.2, 0.4],
      [3.2, 1.0],
      [4.0, 1.0],
    ],
    exitVector: [8.0, 0],
    blockedBy: [], // Free to escape right!
  },
  {
    id: 'R3_HOOK_LEFT',
    dir: 'LEFT',
    path: [
      [3.6, 0.4],
      [3.9, 0.4],
      [3.9, 0.7],
      [3.5, 0.7],
    ],
    exitVector: [-8.0, 0],
    blockedBy: ['R2_CORNER_RIGHT'],
  },
  {
    id: 'R4_DOWN',
    dir: 'DOWN',
    path: [
      [2.2, 0.4],
      [2.2, -1.0],
    ],
    exitVector: [0, -8.0],
    blockedBy: ['B1_BASE_RIGHT'],
  },
  {
    id: 'R5_FAR_DOWN',
    dir: 'DOWN',
    path: [
      [3.2, -0.2],
      [3.2, -0.8],
    ],
    exitVector: [0, -8.0],
    blockedBy: [], // Free to escape!
  },
  {
    id: 'R6_U_TURN_DOWN',
    dir: 'DOWN',
    path: [
      [3.2, -1.8],
      [3.2, -1.4],
      [3.6, -1.4],
      [3.6, -1.8],
    ],
    exitVector: [0, -8.0],
    blockedBy: [], // Free to escape down!
  },

  // -------------------------------------------------------------
  // BOTTOM FOUNDATION & BASES
  // -------------------------------------------------------------
  {
    id: 'B1_BASE_RIGHT',
    dir: 'RIGHT',
    path: [
      [-2.0, -1.8],
      [1.4, -1.8],
    ],
    exitVector: [8.0, 0],
    blockedBy: ['B4_UP'],
  },
  {
    id: 'B2_STEPPED_RIGHT',
    dir: 'RIGHT',
    path: [
      [-1.8, -2.4],
      [-1.2, -2.4],
      [-1.2, -2.1],
      [0.4, -2.1],
    ],
    exitVector: [8.0, 0],
    blockedBy: ['B4_UP'],
  },
  {
    id: 'B3_UP_PIN',
    dir: 'UP',
    path: [
      [-1.2, -2.8],
      [-1.2, -2.5],
    ],
    exitVector: [0, 8.0],
    blockedBy: ['B2_STEPPED_RIGHT'],
  },
  {
    id: 'B4_UP',
    dir: 'UP',
    path: [
      [1.8, -2.8],
      [1.8, -2.0],
    ],
    exitVector: [0, 8.0],
    blockedBy: ['R4_DOWN'],
  },
  {
    id: 'B5_U_HOOK_LEFT',
    dir: 'LEFT',
    path: [
      [-0.8, -3.2],
      [-0.8, -2.8],
      [-0.4, -2.8],
      [-0.4, -3.2],
      [-0.7, -3.2],
    ],
    exitVector: [-8.0, 0],
    blockedBy: [], // Free to escape!
  },
  {
    id: 'B6_BOTTOM_CORNER_DOWN',
    dir: 'DOWN',
    path: [
      [0.8, -2.4],
      [1.4, -2.4],
      [1.4, -2.9],
    ],
    exitVector: [0, -8.0],
    blockedBy: [], // Free to escape down!
  },
];
