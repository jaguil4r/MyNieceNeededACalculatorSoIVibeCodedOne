import { useCalculator } from '../../context/CalculatorContext'
import { Display } from '../Display/Display'
import { Keypad } from '../Keypad/Keypad'
import { GraphScreen } from '../Graph/GraphScreen'
import { TableScreen } from '../Table/TableScreen'
import { YEditor } from '../Graph/YEditor'
import { WindowSettings } from '../Graph/WindowSettings'
import { AlexisToggle } from '../AlexisMode/AlexisToggle'
import { ColorPicker } from '../AlexisMode/ColorPicker'
import { useTheme } from '../../context/ThemeContext'
import styles from './Calculator.module.css'

export function Calculator() {
  const { state } = useCalculator()
  const { state: themeState } = useTheme()

  const renderScreen = () => {
    switch (state.mode) {
      case 'graph':
        return <GraphScreen />
      case 'table':
        return <TableScreen />
      case 'y-editor':
        return <YEditor />
      case 'window':
        return <WindowSettings />
      case 'calc':
      default:
        return <Display />
    }
  }

  return (
    <div
      className={`${styles.calculator} ${themeState.isAlexisMode ? styles.alexisMode : ''}`}
    >
      <div className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandName}>ALEXIS</span>
          <span className={styles.modelNumber}>TI-84 Plus</span>
        </div>
        <AlexisToggle />
      </div>

      {themeState.isAlexisMode && <ColorPicker />}

      <div className={styles.screenContainer}>{renderScreen()}</div>

      <Keypad />
    </div>
  )
}
