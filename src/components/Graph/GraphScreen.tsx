import { useRef, useEffect, useCallback, useState } from 'react'
import { useCalculator } from '../../context/CalculatorContext'
import { useTheme } from '../../context/ThemeContext'
import { GraphEngine } from '../../engine/GraphEngine'
import styles from './GraphScreen.module.css'

export function GraphScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { state, mathEngine, setMode } = useCalculator()
  const { state: themeState } = useTheme()
  const [traceX, setTraceX] = useState<number>(0)
  const [showTrace, setShowTrace] = useState(false)
  const graphEngineRef = useRef(new GraphEngine(mathEngine))

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    const { xMin, xMax, yMin, yMax, xScl, yScl } = state.graphWindow

    // Clear canvas
    if (themeState.isAlexisMode) {
      ctx.fillStyle = '#1a1a2e'
    } else {
      ctx.fillStyle = '#9EAD86' // TI-84 green
    }
    ctx.fillRect(0, 0, width, height)

    // Convert graph coordinates to canvas coordinates
    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height

    // Draw grid
    ctx.strokeStyle = themeState.isAlexisMode
      ? `color-mix(in srgb, ${themeState.primaryColor} 20%, #1a1a2e)`
      : '#7E8D66'
    ctx.lineWidth = 0.5

    // Vertical grid lines
    for (let x = Math.ceil(xMin / xScl) * xScl; x <= xMax; x += xScl) {
      ctx.beginPath()
      ctx.moveTo(toCanvasX(x), 0)
      ctx.lineTo(toCanvasX(x), height)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let y = Math.ceil(yMin / yScl) * yScl; y <= yMax; y += yScl) {
      ctx.beginPath()
      ctx.moveTo(0, toCanvasY(y))
      ctx.lineTo(width, toCanvasY(y))
      ctx.stroke()
    }

    // Draw axes
    ctx.strokeStyle = themeState.isAlexisMode
      ? `color-mix(in srgb, ${themeState.primaryColor} 50%, white)`
      : '#4E5D36'
    ctx.lineWidth = 1.5

    // X-axis
    if (yMin <= 0 && yMax >= 0) {
      ctx.beginPath()
      ctx.moveTo(0, toCanvasY(0))
      ctx.lineTo(width, toCanvasY(0))
      ctx.stroke()
    }

    // Y-axis
    if (xMin <= 0 && xMax >= 0) {
      ctx.beginPath()
      ctx.moveTo(toCanvasX(0), 0)
      ctx.lineTo(toCanvasX(0), height)
      ctx.stroke()
    }

    // Draw functions
    state.graphFunctions.forEach((func) => {
      if (!func.enabled || !func.expression.trim()) return

      const points = graphEngineRef.current.generatePoints(
        func.expression,
        state.graphWindow,
        width
      )
      if (points.length === 0) return

      ctx.strokeStyle = themeState.isAlexisMode ? themeState.primaryColor : func.color
      ctx.lineWidth = 2

      if (themeState.isAlexisMode) {
        ctx.shadowColor = themeState.primaryColor
        ctx.shadowBlur = 4
      }

      ctx.beginPath()
      let drawing = false

      points.forEach((point, i) => {
        const cx = toCanvasX(point.x)
        const cy = toCanvasY(point.y)

        // Only draw if point is within visible area (with margin)
        if (cy >= -100 && cy <= height + 100) {
          if (!drawing) {
            ctx.moveTo(cx, cy)
            drawing = true
          } else {
            // Check for discontinuity
            const prevPoint = points[i - 1]
            if (prevPoint && Math.abs(point.y - prevPoint.y) > (yMax - yMin) * 0.8) {
              ctx.stroke()
              ctx.beginPath()
              ctx.moveTo(cx, cy)
            } else {
              ctx.lineTo(cx, cy)
            }
          }
        } else {
          if (drawing) {
            ctx.stroke()
            ctx.beginPath()
            drawing = false
          }
        }
      })

      ctx.stroke()
      ctx.shadowBlur = 0
    })

    // Draw trace point
    if (showTrace) {
      const activeFunc = state.graphFunctions[state.activeGraphFunction]
      if (activeFunc?.expression) {
        const y = mathEngine.evaluateAt(activeFunc.expression, traceX)
        if (y !== null && isFinite(y)) {
          const cx = toCanvasX(traceX)
          const cy = toCanvasY(y)

          ctx.fillStyle = themeState.isAlexisMode ? themeState.accentColor : '#ff0000'
          ctx.beginPath()
          ctx.arc(cx, cy, 5, 0, Math.PI * 2)
          ctx.fill()

          // Draw trace info
          ctx.fillStyle = themeState.isAlexisMode ? themeState.primaryColor : '#000'
          ctx.font = '12px monospace'
          ctx.fillText(`X=${traceX.toFixed(3)}`, 10, height - 25)
          ctx.fillText(`Y=${y.toFixed(3)}`, 10, height - 10)
        }
      }
    }
  }, [state.graphWindow, state.graphFunctions, state.activeGraphFunction, themeState, traceX, showTrace, mathEngine])

  useEffect(() => {
    drawGraph()
  }, [drawGraph])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas) {
        const container = canvas.parentElement
        if (container) {
          canvas.width = container.clientWidth
          canvas.height = container.clientHeight
          drawGraph()
        }
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawGraph])

  // Handle trace movement
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const { xMin, xMax } = state.graphWindow

    const graphX = xMin + (x / canvas.width) * (xMax - xMin)
    setTraceX(graphX)
    setShowTrace(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showTrace) return

    const { xMin, xMax } = state.graphWindow
    const step = (xMax - xMin) / 100

    if (e.key === 'ArrowLeft') {
      setTraceX((prev) => Math.max(xMin, prev - step))
    } else if (e.key === 'ArrowRight') {
      setTraceX((prev) => Math.min(xMax, prev + step))
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button onClick={() => setMode('y-editor')} className={styles.toolButton}>
          Y=
        </button>
        <button onClick={() => setMode('window')} className={styles.toolButton}>
          WINDOW
        </button>
        <button
          onClick={() => setShowTrace(!showTrace)}
          className={`${styles.toolButton} ${showTrace ? styles.active : ''}`}
        >
          TRACE
        </button>
        <button onClick={() => setMode('calc')} className={styles.toolButton}>
          ← BACK
        </button>
      </div>
      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onClick={handleCanvasClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Graph display"
        />
      </div>
    </div>
  )
}
