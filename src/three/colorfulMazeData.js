// Authentic Colorful Arrows Maze Data
// Matches the user's uploaded image (Cyan, Magenta, Yellow, Lime Green, Coral Orange)
// Each arrow has: id, color, dir ('UP'|'DOWN'|'LEFT'|'RIGHT'), exitVector [vx, vy],
// blockedBy: array of arrow ids that must exit before this arrow can slide out ("surut kore ber hoye jabe")
// points: 2D waypoints [x, y] in range [-1.8, 1.8]

export const COLOR_PALETTE = {
  CYAN: 0x00e5ff,
  MAGENTA: 0xff2a8d,
  YELLOW: 0xffd000,
  LIME: 0x76e026,
  CORAL: 0xff5733,
};

export const COLOR_EMISSIVES = {
  CYAN: 0x0099bb,
  MAGENTA: 0x990044,
  YELLOW: 0x997700,
  LIME: 0x448800,
  CORAL: 0x882200,
};

export const COLORFUL_MAZE_ARROWS = [
  // 1. Top-Left Outer Cyan (Outer boundary corridor, exits DOWN)
  {
    id: 'cyan_tl',
    colorKey: 'CYAN',
    color: '#00e5ff',
    dir: 'DOWN',
    exitVector: [0, -5.5],
    blockedBy: [], // Can escape right away!
    points: [
      [-0.1, 1.7],
      [-1.7, 1.7],
      [-1.7, 0.45],
    ],
  },

  // 2. Top-Right Magenta (Winding along top right, exits LEFT)
  {
    id: 'pink_tr',
    colorKey: 'MAGENTA',
    color: '#ff2a8d',
    dir: 'LEFT',
    exitVector: [-5.5, 0],
    blockedBy: [], // Can escape right away!
    points: [
      [0.05, 1.7],
      [1.7, 1.7],
      [1.7, 0.2],
      [1.25, 0.2],
    ],
  },

  // 3. Top Yellow Winding Snake (exits LEFT into top corridor)
  {
    id: 'yellow_tm',
    colorKey: 'YELLOW',
    color: '#ffd000',
    dir: 'LEFT',
    exitVector: [-5.5, 0],
    blockedBy: ['cyan_tl'], // Blocked by cyan_tl
    points: [
      [1.5, 1.45],
      [1.5, 1.25],
      [0.8, 1.25],
      [0.8, 1.45],
      [0.0, 1.45],
    ],
  },

  // 4. Top-Left Coral Snake (exits UP)
  {
    id: 'coral_tl',
    colorKey: 'CORAL',
    color: '#ff5733',
    dir: 'UP',
    exitVector: [0, 5.5],
    blockedBy: ['cyan_tl'], // Blocked by cyan_tl
    points: [
      [-1.45, 0.65],
      [-1.45, 1.45],
      [-0.95, 1.45],
      [-0.95, 0.75],
      [-0.2, 0.75],
      [-0.2, 1.55],
    ],
  },

  // 5. Top-Left Inner Cyan (exits DOWN)
  {
    id: 'cyan_tli',
    colorKey: 'CYAN',
    color: '#00e5ff',
    dir: 'DOWN',
    exitVector: [0, -5.5],
    blockedBy: ['coral_tl'],
    points: [
      [-0.45, 1.2],
      [-0.45, 0.95],
      [-1.2, 0.95],
      [-1.2, 0.55],
    ],
  },

  // 6. Top Yellow Needle (exits DOWN)
  {
    id: 'yellow_tn',
    colorKey: 'YELLOW',
    color: '#ffd000',
    dir: 'DOWN',
    exitVector: [0, -5.5],
    blockedBy: ['coral_tl'],
    points: [
      [-0.68, 1.2],
      [-0.68, 0.95],
      [-0.42, 0.95],
      [-0.42, 0.85],
    ],
  },

  // 7. Mid-Right Pink Snake (exits LEFT)
  {
    id: 'pink_mr',
    colorKey: 'MAGENTA',
    color: '#ff2a8d',
    dir: 'LEFT',
    exitVector: [-5.5, 0],
    blockedBy: ['pink_tr'],
    points: [
      [1.3, 0.9],
      [0.9, 0.9],
      [0.9, 0.65],
      [0.45, 0.65],
    ],
  },

  // 8. Bottom-Left Lime Green (Outer border, exits RIGHT)
  {
    id: 'lime_bl',
    colorKey: 'LIME',
    color: '#76e026',
    dir: 'RIGHT',
    exitVector: [5.5, 0],
    blockedBy: [], // Can escape right away!
    points: [
      [-1.7, 0.2],
      [-1.7, -1.7],
      [-0.65, -1.7],
    ],
  },

  // 9. Mid-Left Coral (exits RIGHT)
  {
    id: 'coral_ml',
    colorKey: 'CORAL',
    color: '#ff5733',
    dir: 'RIGHT',
    exitVector: [5.5, 0],
    blockedBy: ['lime_bl'],
    points: [
      [-1.45, -0.9],
      [-1.45, -0.05],
      [-0.45, -0.05],
    ],
  },

  // 10. Center Pink Winding Snake (exits RIGHT)
  {
    id: 'pink_c',
    colorKey: 'MAGENTA',
    color: '#ff2a8d',
    dir: 'RIGHT',
    exitVector: [5.5, 0],
    blockedBy: ['coral_ml'],
    points: [
      [-1.0, 0.3],
      [-0.1, 0.3],
      [-0.1, 0.1],
      [0.2, 0.1],
    ],
  },

  // 11. Mid-Left Lime Hook (exits DOWN)
  {
    id: 'lime_ml',
    colorKey: 'LIME',
    color: '#76e026',
    dir: 'DOWN',
    exitVector: [0, -5.5],
    blockedBy: ['coral_ml'],
    points: [
      [-1.2, -0.25],
      [-0.8, -0.25],
      [-0.8, -0.65],
      [-1.2, -0.65],
      [-1.2, -0.5],
    ],
  },

  // 12. Bottom-Right Lime Green (Outer border, exits LEFT)
  {
    id: 'lime_br',
    colorKey: 'LIME',
    color: '#76e026',
    dir: 'LEFT',
    exitVector: [-5.5, 0],
    blockedBy: [], // Can escape right away!
    points: [
      [1.7, -0.05],
      [1.7, -1.7],
      [0.25, -1.7],
    ],
  },

  // 13. Bottom-Right Yellow Deep U-turn (exits UP)
  {
    id: 'yellow_br',
    colorKey: 'YELLOW',
    color: '#ffd000',
    dir: 'UP',
    exitVector: [0, 5.5],
    blockedBy: ['lime_br'],
    points: [
      [0.45, -1.0],
      [0.45, -1.45],
      [1.45, -1.45],
      [1.45, -0.2],
    ],
  },

  // 14. Bottom-Right Coral Snake (exits DOWN)
  {
    id: 'coral_br',
    colorKey: 'CORAL',
    color: '#ff5733',
    dir: 'DOWN',
    exitVector: [0, -5.5],
    blockedBy: ['lime_br'],
    points: [
      [0.7, 0.25],
      [0.7, -0.2],
      [0.25, -0.2],
      [0.25, -1.2],
    ],
  },

  // 15. Center Cyan S-Snake (Winding through middle, exits UP)
  {
    id: 'cyan_c',
    colorKey: 'CYAN',
    color: '#00e5ff',
    dir: 'UP',
    exitVector: [0, 5.5],
    blockedBy: ['yellow_tm', 'pink_mr'],
    points: [
      [0.1, -1.0],
      [0.1, -0.2],
      [0.45, -0.2],
      [0.45, 0.45],
    ],
  },

  // 16. Bottom-Left Yellow Zig-Zag (exits UP)
  {
    id: 'yellow_bl',
    colorKey: 'YELLOW',
    color: '#ffd000',
    dir: 'UP',
    exitVector: [0, 5.5],
    blockedBy: ['lime_bl'],
    points: [
      [-1.45, -1.45],
      [-1.45, -0.95],
    ],
  },

  // 17. Bottom Cyan Loop (exits RIGHT)
  {
    id: 'cyan_b',
    colorKey: 'CYAN',
    color: '#00e5ff',
    dir: 'RIGHT',
    exitVector: [5.5, 0],
    blockedBy: ['lime_bl'],
    points: [
      [-0.45, -1.45],
      [-0.45, -1.15],
      [0.1, -1.15],
      [0.1, -1.45],
      [0.2, -1.45],
    ],
  },

  // 18. Bottom Coral Hook (exits UP)
  {
    id: 'coral_b',
    colorKey: 'CORAL',
    color: '#ff5733',
    dir: 'UP',
    exitVector: [0, 5.5],
    blockedBy: ['cyan_b'],
    points: [
      [-0.25, -1.35],
      [0.0, -1.35],
      [0.0, -1.0],
    ],
  },
];
