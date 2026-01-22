export interface KeyConfig {
  id: string
  primary: string
  secondary?: string
  alpha?: string
  color: 'dark' | 'light' | 'blue' | 'yellow' | 'green'
  action: string
  secondAction?: string
  alphaAction?: string
  wide?: boolean
}

export const keypadLayout: KeyConfig[][] = [
  // Row 1: Y=, WINDOW, ZOOM, TRACE, GRAPH
  [
    { id: 'y=', primary: 'Y=', secondary: 'STAT', color: 'dark', action: 'MODE_Y=' },
    { id: 'window', primary: 'WINDOW', secondary: 'TBL SET', color: 'dark', action: 'MODE_WINDOW', secondAction: 'MODE_TABLE' },
    { id: 'zoom', primary: 'ZOOM', secondary: 'FORMAT', color: 'dark', action: 'MODE_ZOOM' },
    { id: 'trace', primary: 'TRACE', secondary: 'CALC', color: 'dark', action: 'MODE_TRACE' },
    { id: 'graph', primary: 'GRAPH', secondary: 'TABLE', color: 'dark', action: 'MODE_GRAPH', secondAction: 'MODE_TABLE' },
  ],
  // Row 2: 2nd, MODE, DEL, ALPHA, X,T,θ,n
  [
    { id: '2nd', primary: '2nd', color: 'yellow', action: 'MODIFIER_2ND' },
    { id: 'mode', primary: 'MODE', secondary: 'QUIT', alpha: 'A', color: 'dark', action: 'MODE_MENU', alphaAction: 'INSERT_A' },
    { id: 'del', primary: 'DEL', secondary: 'INS', alpha: 'B', color: 'dark', action: 'DELETE', alphaAction: 'INSERT_B' },
    { id: 'alpha', primary: 'ALPHA', secondary: 'A-LOCK', color: 'green', action: 'MODIFIER_ALPHA' },
    { id: 'xtn', primary: 'X', secondary: 'LINK', alpha: 'C', color: 'dark', action: 'INSERT_X', alphaAction: 'INSERT_C' },
  ],
  // Row 3: MATH, APPS, PRGM, VARS, CLEAR
  [
    { id: 'math', primary: 'MATH', secondary: 'TEST', alpha: 'D', color: 'dark', action: 'MENU_MATH', alphaAction: 'INSERT_D' },
    { id: 'apps', primary: 'APPS', secondary: 'ANGLE', alpha: 'E', color: 'dark', action: 'MENU_APPS', alphaAction: 'INSERT_E' },
    { id: 'prgm', primary: 'PRGM', secondary: 'DRAW', alpha: 'F', color: 'dark', action: 'MENU_PRGM', alphaAction: 'INSERT_F' },
    { id: 'vars', primary: 'VARS', secondary: 'DISTR', color: 'dark', action: 'MENU_VARS' },
    { id: 'clear', primary: 'CLEAR', color: 'dark', action: 'CLEAR' },
  ],
  // Row 4: x⁻¹, sin, cos, tan, ^
  [
    { id: 'inverse', primary: 'x⁻¹', secondary: 'MATRIX', alpha: 'G', color: 'dark', action: 'INSERT_^(-1)', secondAction: 'MENU_MATRIX', alphaAction: 'INSERT_G' },
    { id: 'sin', primary: 'sin', secondary: 'sin⁻¹', alpha: 'H', color: 'dark', action: 'FUNC_SIN', secondAction: 'FUNC_ASIN', alphaAction: 'INSERT_H' },
    { id: 'cos', primary: 'cos', secondary: 'cos⁻¹', alpha: 'I', color: 'dark', action: 'FUNC_COS', secondAction: 'FUNC_ACOS', alphaAction: 'INSERT_I' },
    { id: 'tan', primary: 'tan', secondary: 'tan⁻¹', alpha: 'J', color: 'dark', action: 'FUNC_TAN', secondAction: 'FUNC_ATAN', alphaAction: 'INSERT_J' },
    { id: 'power', primary: '^', secondary: 'π', alpha: 'K', color: 'dark', action: 'INSERT_^', secondAction: 'INSERT_π', alphaAction: 'INSERT_K' },
  ],
  // Row 5: x², ,, (, ), ÷
  [
    { id: 'square', primary: 'x²', secondary: '√', alpha: 'L', color: 'dark', action: 'INSERT_^2', secondAction: 'INSERT_√(', alphaAction: 'INSERT_L' },
    { id: 'comma', primary: ',', secondary: 'EE', alpha: 'M', color: 'dark', action: 'INSERT_,', secondAction: 'INSERT_E', alphaAction: 'INSERT_M' },
    { id: 'lparen', primary: '(', secondary: '{', alpha: 'N', color: 'dark', action: 'INSERT_(', secondAction: 'INSERT_{', alphaAction: 'INSERT_N' },
    { id: 'rparen', primary: ')', secondary: '}', alpha: 'O', color: 'dark', action: 'INSERT_)', secondAction: 'INSERT_}', alphaAction: 'INSERT_O' },
    { id: 'divide', primary: '÷', secondary: 'e', alpha: 'P', color: 'dark', action: 'INSERT_÷', secondAction: 'INSERT_e', alphaAction: 'INSERT_P' },
  ],
  // Row 6: log, 7, 8, 9, ×
  [
    { id: 'log', primary: 'log', secondary: '10^', alpha: 'Q', color: 'dark', action: 'FUNC_LOG', secondAction: 'INSERT_10^', alphaAction: 'INSERT_Q' },
    { id: '7', primary: '7', secondary: 'u', alpha: 'R', color: 'light', action: 'INSERT_7', alphaAction: 'INSERT_R' },
    { id: '8', primary: '8', secondary: 'v', alpha: 'S', color: 'light', action: 'INSERT_8', alphaAction: 'INSERT_S' },
    { id: '9', primary: '9', secondary: 'w', alpha: 'T', color: 'light', action: 'INSERT_9', alphaAction: 'INSERT_T' },
    { id: 'multiply', primary: '×', secondary: '[', alpha: 'U', color: 'dark', action: 'INSERT_×', secondAction: 'INSERT_[', alphaAction: 'INSERT_U' },
  ],
  // Row 7: ln, 4, 5, 6, -
  [
    { id: 'ln', primary: 'ln', secondary: 'e^', alpha: 'V', color: 'dark', action: 'FUNC_LN', secondAction: 'INSERT_e^', alphaAction: 'INSERT_V' },
    { id: '4', primary: '4', secondary: 'L4', alpha: 'W', color: 'light', action: 'INSERT_4', alphaAction: 'INSERT_W' },
    { id: '5', primary: '5', secondary: 'L5', alpha: 'X', color: 'light', action: 'INSERT_5', alphaAction: 'INSERT_X' },
    { id: '6', primary: '6', secondary: 'L6', alpha: 'Y', color: 'light', action: 'INSERT_6', alphaAction: 'INSERT_Y' },
    { id: 'subtract', primary: '−', secondary: ']', alpha: 'Z', color: 'dark', action: 'INSERT_-', secondAction: 'INSERT_]', alphaAction: 'INSERT_Z' },
  ],
  // Row 8: STO→, 1, 2, 3, +
  [
    { id: 'store', primary: 'STO→', secondary: 'RCL', alpha: '"', color: 'dark', action: 'STORE', alphaAction: 'INSERT_"' },
    { id: '1', primary: '1', secondary: 'L1', alpha: 'SPACE', color: 'light', action: 'INSERT_1', alphaAction: 'INSERT_ ' },
    { id: '2', primary: '2', secondary: 'L2', alpha: ':', color: 'light', action: 'INSERT_2', alphaAction: 'INSERT_:' },
    { id: '3', primary: '3', secondary: 'L3', alpha: '?', color: 'light', action: 'INSERT_3', alphaAction: 'INSERT_?' },
    { id: 'add', primary: '+', secondary: 'MEM', alpha: '"', color: 'dark', action: 'INSERT_+', alphaAction: 'INSERT_"' },
  ],
  // Row 9: ON, 0, ., (-), ENTER
  [
    { id: 'on', primary: 'ON', secondary: 'OFF', color: 'dark', action: 'POWER' },
    { id: '0', primary: '0', secondary: 'CATALOG', alpha: ' ', color: 'light', action: 'INSERT_0' },
    { id: 'decimal', primary: '.', secondary: 'i', alpha: ':', color: 'light', action: 'INSERT_.', secondAction: 'INSERT_i' },
    { id: 'negate', primary: '(−)', secondary: 'ANS', alpha: '?', color: 'dark', action: 'INSERT_(-)', secondAction: 'ANS' },
    { id: 'enter', primary: 'ENTER', secondary: 'ENTRY', alpha: 'SOLVE', color: 'blue', action: 'EVALUATE' },
  ],
]
