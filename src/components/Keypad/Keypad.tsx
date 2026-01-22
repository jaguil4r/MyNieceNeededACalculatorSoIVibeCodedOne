import { useCalculator } from '../../context/CalculatorContext'
import { Button } from './Button'
import { keypadLayout, KeyConfig } from './keypadLayout'
import styles from './Keypad.module.css'

export function Keypad() {
  const { input, clear, deleteChar, evaluate, setMode, setModifier, state } = useCalculator()

  const handleButtonClick = (config: KeyConfig) => {
    const { action, secondAction, alphaAction } = config

    // Determine which action to use based on modifier
    let activeAction = action
    if (state.modifier === '2nd' && secondAction) {
      activeAction = secondAction
    } else if (state.modifier === 'alpha' && alphaAction) {
      activeAction = alphaAction
    }

    // Handle different action types
    if (activeAction.startsWith('INSERT_')) {
      const value = activeAction.replace('INSERT_', '')
      input(value)
    } else if (activeAction.startsWith('FUNC_')) {
      const func = activeAction.replace('FUNC_', '').toLowerCase()
      input(`${func}(`)
    } else if (activeAction.startsWith('MODE_')) {
      const mode = activeAction.replace('MODE_', '').toLowerCase()
      switch (mode) {
        case 'y=':
          setMode('y-editor')
          break
        case 'graph':
          if (state.modifier === '2nd') {
            setMode('table')
          } else {
            setMode('graph')
          }
          break
        case 'window':
          if (state.modifier === '2nd') {
            setMode('table')
          } else {
            setMode('window')
          }
          break
        case 'trace':
          setMode('graph')
          break
        case 'zoom':
          setMode('graph')
          break
        default:
          setMode('calc')
      }
    } else if (activeAction.startsWith('MODIFIER_')) {
      const mod = activeAction.replace('MODIFIER_', '').toLowerCase() as '2nd' | 'alpha'
      setModifier(mod)
    } else {
      switch (activeAction) {
        case 'CLEAR':
          clear()
          setMode('calc')
          break
        case 'DELETE':
          deleteChar()
          break
        case 'EVALUATE':
          evaluate()
          break
        case 'STORE':
          input('→')
          break
        case 'POWER':
          // Could implement on/off, for now just clear
          clear()
          break
        case 'MENU_MATH':
          // Could show math menu, for now input common functions
          input('abs(')
          break
        case 'ANS':
          input('Ans')
          break
        default:
          // For any unhandled actions, try to input the primary label
          if (config.primary && config.primary.length === 1) {
            input(config.primary)
          }
      }
    }
  }

  return (
    <div className={styles.keypad}>
      {keypadLayout.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((config) => (
            <Button
              key={config.id}
              config={config}
              onClick={() => handleButtonClick(config)}
              modifier={state.modifier}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
