import { useRef, useState, useCallback } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { ModifierState } from '../../context/CalculatorContext'
import { KeyConfig } from './keypadLayout'
import { ButtonSparkle, SparkleData } from './ButtonSparkle'
import styles from './Button.module.css'

interface ButtonProps {
  config: KeyConfig
  onClick: () => void
  modifier: ModifierState
}

export function Button({ config, onClick, modifier }: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { state: themeState } = useTheme()
  const [sparkles, setSparkles] = useState<SparkleData[]>([])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onClick()

      if (themeState.isAlexisMode && themeState.sparkleEnabled && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Generate sparkle particles
        const newSparkles: SparkleData[] = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x,
          y,
          angle: i * 45 * (Math.PI / 180),
          delay: i * 15,
        }))

        setSparkles((prev) => [...prev, ...newSparkles])

        // Clean up after animation
        setTimeout(() => {
          setSparkles((prev) => prev.filter((s) => !newSparkles.some((ns) => ns.id === s.id)))
        }, 600)
      }
    },
    [onClick, themeState.isAlexisMode, themeState.sparkleEnabled]
  )

  // Determine if this button's secondary/alpha is active
  const showSecondary = modifier === '2nd' && config.secondary
  const showAlpha = modifier === 'alpha' && config.alpha

  return (
    <button
      ref={buttonRef}
      className={`
        ${styles.button}
        ${styles[config.color]}
        ${config.wide ? styles.wide : ''}
        ${themeState.isAlexisMode ? styles.alexisMode : ''}
        ${showSecondary ? styles.secondActive : ''}
        ${showAlpha ? styles.alphaActive : ''}
      `}
      onClick={handleClick}
    >
      {/* Secondary label (2nd function) */}
      {config.secondary && (
        <span className={`${styles.secondary} ${showSecondary ? styles.active : ''}`}>
          {config.secondary}
        </span>
      )}

      {/* Alpha label */}
      {config.alpha && (
        <span className={`${styles.alpha} ${showAlpha ? styles.active : ''}`}>
          {config.alpha}
        </span>
      )}

      {/* Primary label */}
      <span className={styles.primary}>{config.primary}</span>

      {/* Sparkle effects */}
      {themeState.isAlexisMode &&
        sparkles.map((sparkle) => <ButtonSparkle key={sparkle.id} {...sparkle} />)}
    </button>
  )
}
