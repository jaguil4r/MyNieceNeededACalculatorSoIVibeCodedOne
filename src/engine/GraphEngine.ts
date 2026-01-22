import { MathEngine } from './MathEngine'

export interface GraphWindow {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  xScl: number
  yScl: number
}

export interface GraphFunction {
  id: string
  expression: string
  color: string
  enabled: boolean
}

export interface Point {
  x: number
  y: number
}

export interface TracePoint extends Point {
  funcIndex: number
  funcId: string
}

export class GraphEngine {
  private mathEngine: MathEngine

  constructor(mathEngine: MathEngine) {
    this.mathEngine = mathEngine
  }

  /**
   * Generate points for a function within the given window
   */
  generatePoints(
    expression: string,
    window: GraphWindow,
    canvasWidth: number
  ): Point[] {
    const points: Point[] = []
    const { xMin, xMax } = window

    // Calculate step size based on canvas width for smooth curves
    const numPoints = Math.max(canvasWidth * 2, 500)
    const step = (xMax - xMin) / numPoints

    for (let x = xMin; x <= xMax; x += step) {
      const y = this.mathEngine.evaluateAt(expression, x)
      if (y !== null && isFinite(y) && !isNaN(y)) {
        points.push({ x, y })
      }
    }

    return points
  }

  /**
   * Find zeros (roots) of a function using bisection method
   */
  findZeros(expression: string, window: GraphWindow): number[] {
    const zeros: number[] = []
    const { xMin, xMax } = window
    const step = (xMax - xMin) / 100

    for (let x = xMin; x < xMax; x += step) {
      const y1 = this.mathEngine.evaluateAt(expression, x)
      const y2 = this.mathEngine.evaluateAt(expression, x + step)

      if (y1 !== null && y2 !== null && y1 * y2 < 0) {
        // Sign change detected - refine with bisection
        const zero = this.bisection(expression, x, x + step)
        if (zero !== null && !zeros.some((z) => Math.abs(z - zero) < 0.001)) {
          zeros.push(zero)
        }
      }
    }

    return zeros
  }

  private bisection(
    expression: string,
    a: number,
    b: number,
    tolerance: number = 1e-10
  ): number | null {
    for (let i = 0; i < 100; i++) {
      const mid = (a + b) / 2
      const fMid = this.mathEngine.evaluateAt(expression, mid)
      const fA = this.mathEngine.evaluateAt(expression, a)

      if (fMid === null || fA === null) return null
      if (Math.abs(fMid) < tolerance) return mid

      if (fA * fMid < 0) {
        b = mid
      } else {
        a = mid
      }
    }
    return (a + b) / 2
  }

  /**
   * Find minimum value of a function in the window
   */
  findMinimum(expression: string, window: GraphWindow): Point | null {
    const { xMin, xMax } = window
    const step = (xMax - xMin) / 1000
    let minPoint: Point | null = null

    for (let x = xMin; x <= xMax; x += step) {
      const y = this.mathEngine.evaluateAt(expression, x)
      if (y !== null && isFinite(y)) {
        if (minPoint === null || y < minPoint.y) {
          minPoint = { x, y }
        }
      }
    }

    return minPoint
  }

  /**
   * Find maximum value of a function in the window
   */
  findMaximum(expression: string, window: GraphWindow): Point | null {
    const { xMin, xMax } = window
    const step = (xMax - xMin) / 1000
    let maxPoint: Point | null = null

    for (let x = xMin; x <= xMax; x += step) {
      const y = this.mathEngine.evaluateAt(expression, x)
      if (y !== null && isFinite(y)) {
        if (maxPoint === null || y > maxPoint.y) {
          maxPoint = { x, y }
        }
      }
    }

    return maxPoint
  }

  /**
   * Evaluate function at X for trace mode
   */
  trace(expression: string, x: number): number | null {
    return this.mathEngine.evaluateAt(expression, x)
  }

  /**
   * Calculate intersection of two functions
   */
  findIntersection(
    expr1: string,
    expr2: string,
    window: GraphWindow
  ): Point[] {
    const intersections: Point[] = []
    const { xMin, xMax } = window
    const step = (xMax - xMin) / 100

    for (let x = xMin; x < xMax; x += step) {
      const y1a = this.mathEngine.evaluateAt(expr1, x)
      const y2a = this.mathEngine.evaluateAt(expr2, x)
      const y1b = this.mathEngine.evaluateAt(expr1, x + step)
      const y2b = this.mathEngine.evaluateAt(expr2, x + step)

      if (y1a !== null && y2a !== null && y1b !== null && y2b !== null) {
        const diff1 = y1a - y2a
        const diff2 = y1b - y2b

        if (diff1 * diff2 < 0) {
          // Sign change - intersection exists
          const intX = this.bisectionDiff(expr1, expr2, x, x + step)
          if (intX !== null) {
            const intY = this.mathEngine.evaluateAt(expr1, intX)
            if (intY !== null) {
              intersections.push({ x: intX, y: intY })
            }
          }
        }
      }
    }

    return intersections
  }

  private bisectionDiff(
    expr1: string,
    expr2: string,
    a: number,
    b: number,
    tolerance: number = 1e-10
  ): number | null {
    for (let i = 0; i < 100; i++) {
      const mid = (a + b) / 2
      const diff = (this.mathEngine.evaluateAt(expr1, mid) ?? 0) -
                   (this.mathEngine.evaluateAt(expr2, mid) ?? 0)
      const diffA = (this.mathEngine.evaluateAt(expr1, a) ?? 0) -
                    (this.mathEngine.evaluateAt(expr2, a) ?? 0)

      if (Math.abs(diff) < tolerance) return mid

      if (diffA * diff < 0) {
        b = mid
      } else {
        a = mid
      }
    }
    return (a + b) / 2
  }

  /**
   * Generate zoom presets
   */
  static getZoomPresets(): Record<string, GraphWindow> {
    return {
      standard: { xMin: -10, xMax: 10, yMin: -10, yMax: 10, xScl: 1, yScl: 1 },
      trig: {
        xMin: -2 * Math.PI,
        xMax: 2 * Math.PI,
        yMin: -4,
        yMax: 4,
        xScl: Math.PI / 2,
        yScl: 1,
      },
      decimal: { xMin: -4.7, xMax: 4.7, yMin: -3.1, yMax: 3.1, xScl: 1, yScl: 1 },
      square: { xMin: -15.16, xMax: 15.16, yMin: -10, yMax: 10, xScl: 1, yScl: 1 },
      integer: { xMin: -47, xMax: 47, yMin: -31, yMax: 31, xScl: 10, yScl: 10 },
    }
  }

  /**
   * Zoom in by factor
   */
  static zoomIn(window: GraphWindow, factor: number = 2): GraphWindow {
    const xCenter = (window.xMin + window.xMax) / 2
    const yCenter = (window.yMin + window.yMax) / 2
    const xRange = (window.xMax - window.xMin) / factor
    const yRange = (window.yMax - window.yMin) / factor

    return {
      ...window,
      xMin: xCenter - xRange / 2,
      xMax: xCenter + xRange / 2,
      yMin: yCenter - yRange / 2,
      yMax: yCenter + yRange / 2,
    }
  }

  /**
   * Zoom out by factor
   */
  static zoomOut(window: GraphWindow, factor: number = 2): GraphWindow {
    return this.zoomIn(window, 1 / factor)
  }
}
