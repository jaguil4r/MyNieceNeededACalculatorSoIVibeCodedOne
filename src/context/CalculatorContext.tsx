import { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react'
import { MathEngine } from '../engine/MathEngine'
import { GraphFunction } from '../engine/GraphEngine'

export type CalculatorMode = 'calc' | 'graph' | 'table' | 'window' | 'y-editor'
export type ModifierState = 'none' | '2nd' | 'alpha'

interface CalculatorState {
  mode: CalculatorMode
  display: string
  history: Array<{ input: string; result: string }>
  currentInput: string
  modifier: ModifierState
  error: string | null
  graphFunctions: GraphFunction[]
  graphWindow: {
    xMin: number
    xMax: number
    yMin: number
    yMax: number
    xScl: number
    yScl: number
  }
  tableSettings: {
    tblStart: number
    tblStep: number
  }
  activeGraphFunction: number
}

type CalculatorAction =
  | { type: 'SET_MODE'; payload: CalculatorMode }
  | { type: 'INPUT'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_ENTRY' }
  | { type: 'DELETE' }
  | { type: 'EVALUATE' }
  | { type: 'SET_MODIFIER'; payload: ModifierState }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_GRAPH_FUNCTION'; payload: { index: number; expression: string } }
  | { type: 'TOGGLE_GRAPH_FUNCTION'; payload: number }
  | { type: 'SET_GRAPH_WINDOW'; payload: Partial<CalculatorState['graphWindow']> }
  | { type: 'SET_TABLE_SETTINGS'; payload: Partial<CalculatorState['tableSettings']> }
  | { type: 'SET_ACTIVE_GRAPH_FUNCTION'; payload: number }
  | { type: 'STORE_VARIABLE'; payload: { name: string; value: number } }
  | { type: 'USE_ANS' }

const GRAPH_COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe']

const initialState: CalculatorState = {
  mode: 'calc',
  display: '',
  history: [],
  currentInput: '',
  modifier: 'none',
  error: null,
  graphFunctions: Array.from({ length: 10 }, (_, i) => ({
    id: `Y${i + 1}`,
    expression: '',
    color: GRAPH_COLORS[i % GRAPH_COLORS.length],
    enabled: true,
  })),
  graphWindow: {
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    xScl: 1,
    yScl: 1,
  },
  tableSettings: {
    tblStart: -5,
    tblStep: 1,
  },
  activeGraphFunction: 0,
}

// Math engine instance (singleton)
const mathEngine = new MathEngine()

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload, modifier: 'none' }

    case 'INPUT':
      return {
        ...state,
        currentInput: state.currentInput + action.payload,
        error: null,
        modifier: 'none',
      }

    case 'CLEAR':
      return {
        ...state,
        currentInput: '',
        error: null,
        modifier: 'none',
      }

    case 'CLEAR_ENTRY':
      return {
        ...state,
        currentInput: '',
        error: null,
      }

    case 'DELETE':
      return {
        ...state,
        currentInput: state.currentInput.slice(0, -1),
        error: null,
      }

    case 'EVALUATE': {
      if (!state.currentInput.trim()) {
        return state
      }
      const result = mathEngine.evaluate(state.currentInput)
      if (result.success) {
        const formattedResult = formatResult(result.value!)
        return {
          ...state,
          history: [
            ...state.history.slice(-9),
            { input: state.currentInput, result: formattedResult },
          ],
          currentInput: '',
          display: formattedResult,
          error: null,
          modifier: 'none',
        }
      } else {
        return {
          ...state,
          error: result.error || 'ERR:SYNTAX',
          modifier: 'none',
        }
      }
    }

    case 'SET_MODIFIER':
      return {
        ...state,
        modifier: state.modifier === action.payload ? 'none' : action.payload,
      }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'SET_GRAPH_FUNCTION':
      return {
        ...state,
        graphFunctions: state.graphFunctions.map((f, i) =>
          i === action.payload.index ? { ...f, expression: action.payload.expression } : f
        ),
      }

    case 'TOGGLE_GRAPH_FUNCTION':
      return {
        ...state,
        graphFunctions: state.graphFunctions.map((f, i) =>
          i === action.payload ? { ...f, enabled: !f.enabled } : f
        ),
      }

    case 'SET_GRAPH_WINDOW':
      return {
        ...state,
        graphWindow: { ...state.graphWindow, ...action.payload },
      }

    case 'SET_TABLE_SETTINGS':
      return {
        ...state,
        tableSettings: { ...state.tableSettings, ...action.payload },
      }

    case 'SET_ACTIVE_GRAPH_FUNCTION':
      return { ...state, activeGraphFunction: action.payload }

    case 'STORE_VARIABLE':
      mathEngine.storeVariable(action.payload.name, action.payload.value)
      return state

    case 'USE_ANS':
      return {
        ...state,
        currentInput: state.currentInput + 'Ans',
      }

    default:
      return state
  }
}

function formatResult(value: number): string {
  if (!isFinite(value)) {
    return value > 0 ? '∞' : '-∞'
  }
  if (Number.isNaN(value)) {
    return 'ERR:DOMAIN'
  }

  // Handle very small numbers
  if (Math.abs(value) < 1e-10 && value !== 0) {
    return value.toExponential(6)
  }

  // Handle very large numbers
  if (Math.abs(value) >= 1e10) {
    return value.toExponential(6)
  }

  // Regular formatting
  const str = value.toPrecision(10)
  const num = parseFloat(str)

  // Remove trailing zeros after decimal
  if (Number.isInteger(num)) {
    return num.toString()
  }

  return num.toString()
}

interface CalculatorContextValue {
  state: CalculatorState
  mathEngine: MathEngine
  dispatch: React.Dispatch<CalculatorAction>
  input: (value: string) => void
  clear: () => void
  clearEntry: () => void
  deleteChar: () => void
  evaluate: () => void
  setMode: (mode: CalculatorMode) => void
  setModifier: (modifier: ModifierState) => void
  setGraphFunction: (index: number, expression: string) => void
  toggleGraphFunction: (index: number) => void
  setGraphWindow: (window: Partial<CalculatorState['graphWindow']>) => void
  setTableSettings: (settings: Partial<CalculatorState['tableSettings']>) => void
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null)

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState)

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const key = e.key

      // Numbers
      if (/^[0-9]$/.test(key)) {
        dispatch({ type: 'INPUT', payload: key })
        return
      }

      // Operators
      const keyMap: Record<string, string> = {
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷',
        '^': '^',
        '(': '(',
        ')': ')',
        '.': '.',
      }

      if (keyMap[key]) {
        dispatch({ type: 'INPUT', payload: keyMap[key] })
        return
      }

      // Special keys
      if (key === 'Enter') {
        e.preventDefault()
        dispatch({ type: 'EVALUATE' })
      } else if (key === 'Backspace') {
        dispatch({ type: 'DELETE' })
      } else if (key === 'Escape') {
        dispatch({ type: 'CLEAR' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const input = useCallback((value: string) => {
    dispatch({ type: 'INPUT', payload: value })
  }, [])

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const clearEntry = useCallback(() => {
    dispatch({ type: 'CLEAR_ENTRY' })
  }, [])

  const deleteChar = useCallback(() => {
    dispatch({ type: 'DELETE' })
  }, [])

  const evaluate = useCallback(() => {
    dispatch({ type: 'EVALUATE' })
  }, [])

  const setMode = useCallback((mode: CalculatorMode) => {
    dispatch({ type: 'SET_MODE', payload: mode })
  }, [])

  const setModifier = useCallback((modifier: ModifierState) => {
    dispatch({ type: 'SET_MODIFIER', payload: modifier })
  }, [])

  const setGraphFunction = useCallback((index: number, expression: string) => {
    dispatch({ type: 'SET_GRAPH_FUNCTION', payload: { index, expression } })
  }, [])

  const toggleGraphFunction = useCallback((index: number) => {
    dispatch({ type: 'TOGGLE_GRAPH_FUNCTION', payload: index })
  }, [])

  const setGraphWindow = useCallback((window: Partial<CalculatorState['graphWindow']>) => {
    dispatch({ type: 'SET_GRAPH_WINDOW', payload: window })
  }, [])

  const setTableSettings = useCallback((settings: Partial<CalculatorState['tableSettings']>) => {
    dispatch({ type: 'SET_TABLE_SETTINGS', payload: settings })
  }, [])

  const value: CalculatorContextValue = {
    state,
    mathEngine,
    dispatch,
    input,
    clear,
    clearEntry,
    deleteChar,
    evaluate,
    setMode,
    setModifier,
    setGraphFunction,
    toggleGraphFunction,
    setGraphWindow,
    setTableSettings,
  }

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>
}

export function useCalculator() {
  const context = useContext(CalculatorContext)
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
}
