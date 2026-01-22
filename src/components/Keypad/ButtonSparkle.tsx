import { useTheme } from '../../context/ThemeContext'
import styles from './ButtonSparkle.module.css'

export interface SparkleData {
  id: number
  x: number
  y: number
  angle: number
  delay: number
}

export function ButtonSparkle({ x, y, angle, delay }: SparkleData) {
  const { state } = useTheme()

  const style = {
    '--start-x': `${x}px`,
    '--start-y': `${y}px`,
    '--angle': angle,
    '--delay': `${delay}ms`,
    '--color-1': state.primaryColor,
    '--color-2': state.secondaryColor,
  } as React.CSSProperties

  return (
    <span className={styles.sparkle} style={style}>
      <svg viewBox="0 0 24 24" width="12" height="12">
        <path
          fill="currentColor"
          d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"
        />
      </svg>
    </span>
  )
}
