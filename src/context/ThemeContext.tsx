import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface ThemeState {
  isAlexisMode: boolean
  sparkleEnabled: boolean
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  currentTheme: string
}

type ThemeAction =
  | { type: 'TOGGLE_ALEXIS_MODE' }
  | { type: 'SET_SPARKLE_ENABLED'; payload: boolean }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'SET_CUSTOM_COLORS'; payload: Partial<ThemeState> }
  | { type: 'LOAD_SAVED_STATE'; payload: ThemeState }

const initialState: ThemeState = {
  isAlexisMode: true, // Default to Alexis mode ON for the gift!
  sparkleEnabled: true,
  primaryColor: '#ff69b4',
  secondaryColor: '#9370db',
  accentColor: '#00ced1',
  backgroundColor: '#1a1a2e',
  currentTheme: 'pink',
}

export const THEME_PRESETS: Record<string, Partial<ThemeState>> = {
  pink: {
    primaryColor: '#ff69b4',
    secondaryColor: '#ff1493',
    accentColor: '#ffb6c1',
    backgroundColor: '#1a1a2e',
  },
  purple: {
    primaryColor: '#9370db',
    secondaryColor: '#8a2be2',
    accentColor: '#dda0dd',
    backgroundColor: '#1a1a2e',
  },
  blue: {
    primaryColor: '#00bfff',
    secondaryColor: '#1e90ff',
    accentColor: '#87ceeb',
    backgroundColor: '#0d1b2a',
  },
  rainbow: {
    primaryColor: '#ff6b6b',
    secondaryColor: '#4ecdc4',
    accentColor: '#ffe66d',
    backgroundColor: '#1a1a2e',
  },
  mint: {
    primaryColor: '#98fb98',
    secondaryColor: '#00fa9a',
    accentColor: '#7fffd4',
    backgroundColor: '#0a1a14',
  },
  gold: {
    primaryColor: '#ffd700',
    secondaryColor: '#ffb347',
    accentColor: '#fff8dc',
    backgroundColor: '#1a1510',
  },
}

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'TOGGLE_ALEXIS_MODE':
      return { ...state, isAlexisMode: !state.isAlexisMode }
    case 'SET_SPARKLE_ENABLED':
      return { ...state, sparkleEnabled: action.payload }
    case 'SET_THEME':
      return { ...state, currentTheme: action.payload, ...THEME_PRESETS[action.payload] }
    case 'SET_CUSTOM_COLORS':
      return { ...state, ...action.payload, currentTheme: 'custom' }
    case 'LOAD_SAVED_STATE':
      return action.payload
    default:
      return state
  }
}

interface ThemeContextValue {
  state: ThemeState
  toggleAlexisMode: () => void
  setSparkleEnabled: (enabled: boolean) => void
  setTheme: (theme: string) => void
  setCustomColors: (colors: Partial<ThemeState>) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, initialState)

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('alexis-calc-theme')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        dispatch({ type: 'LOAD_SAVED_STATE', payload: parsed })
      } catch (e) {
        console.error('Failed to load saved theme:', e)
      }
    }
  }, [])

  // Save preferences on change
  useEffect(() => {
    localStorage.setItem('alexis-calc-theme', JSON.stringify(state))
  }, [state])

  // Apply CSS custom properties and body class
  useEffect(() => {
    const root = document.documentElement

    if (state.isAlexisMode) {
      document.body.classList.add('alexis-mode')
      root.style.setProperty('--primary-color', state.primaryColor)
      root.style.setProperty('--secondary-color', state.secondaryColor)
      root.style.setProperty('--accent-color', state.accentColor)
      root.style.setProperty('--background-color', state.backgroundColor)
    } else {
      document.body.classList.remove('alexis-mode')
      root.style.setProperty('--primary-color', '#333')
      root.style.setProperty('--secondary-color', '#555')
      root.style.setProperty('--accent-color', '#777')
      root.style.setProperty('--background-color', '#1a1a1a')
    }
  }, [state])

  const value: ThemeContextValue = {
    state,
    toggleAlexisMode: () => dispatch({ type: 'TOGGLE_ALEXIS_MODE' }),
    setSparkleEnabled: (enabled) => dispatch({ type: 'SET_SPARKLE_ENABLED', payload: enabled }),
    setTheme: (theme) => dispatch({ type: 'SET_THEME', payload: theme }),
    setCustomColors: (colors) => dispatch({ type: 'SET_CUSTOM_COLORS', payload: colors }),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
