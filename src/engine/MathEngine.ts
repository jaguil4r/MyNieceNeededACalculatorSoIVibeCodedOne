import { create, all, MathJsInstance } from 'mathjs'

export interface EvaluationResult {
  success: boolean
  value?: number
  error?: string
}

export class MathEngine {
  private math: MathJsInstance
  private scope: Record<string, number>

  constructor() {
    this.math = create(all, {
      number: 'number',
      precision: 14,
    })

    // Initialize scope with variables A-Z and special variables
    this.scope = {
      Ans: 0,
      ...Object.fromEntries('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c) => [c, 0])),
    }

    this.registerCustomFunctions()
  }

  private registerCustomFunctions(): void {
    // Register TI-84 specific functions
    this.math.import(
      {
        // Permutations nPr
        nPr: (n: number, r: number): number => {
          return Number(this.math.factorial(n)) / Number(this.math.factorial(n - r))
        },

        // Combinations nCr
        nCr: (n: number, r: number): number => {
          return Number(this.math.combinations(n, r))
        },

        // Integer part (truncate toward zero)
        int: (x: number): number => Math.trunc(x),

        // Fractional part
        fPart: (x: number): number => x - Math.trunc(x),

        // Round to n decimal places
        roundN: (x: number, n: number = 0): number => {
          const factor = Math.pow(10, n)
          return Math.round(x * factor) / factor
        },
      },
      { override: false }
    )
  }

  /**
   * Parse and convert TI-84 syntax to math.js compatible syntax
   */
  private parseExpression(expr: string): string {
    let parsed = expr

    // Replace display symbols with operators
    parsed = parsed.replace(/÷/g, '/')
    parsed = parsed.replace(/×/g, '*')
    parsed = parsed.replace(/−/g, '-')

    // Handle square root symbol
    parsed = parsed.replace(/√\(/g, 'sqrt(')
    parsed = parsed.replace(/√([0-9.]+)/g, 'sqrt($1)')

    // Handle π symbol
    parsed = parsed.replace(/π/g, 'pi')

    // Handle superscript powers
    parsed = parsed.replace(/²/g, '^2')
    parsed = parsed.replace(/³/g, '^3')
    parsed = parsed.replace(/⁻¹/g, '^(-1)')

    // Handle inverse trig functions
    parsed = parsed.replace(/sin⁻¹/g, 'asin')
    parsed = parsed.replace(/cos⁻¹/g, 'acos')
    parsed = parsed.replace(/tan⁻¹/g, 'atan')

    // Handle 10^x
    parsed = parsed.replace(/10\^/g, '10^')

    // Handle e^x
    parsed = parsed.replace(/e\^/g, 'e^')

    // Handle implicit multiplication: 2(3) -> 2*(3), (2)(3) -> (2)*(3), 2x -> 2*x
    parsed = parsed.replace(/(\d)(\()/g, '$1*$2')
    parsed = parsed.replace(/(\))(\()/g, '$1*$2')
    parsed = parsed.replace(/(\))(\d)/g, '$1*$2')
    parsed = parsed.replace(/(\d)([A-Za-z])/g, '$1*$2')
    parsed = parsed.replace(/(\))([A-Za-z])/g, '$1*$2')

    // Handle negative sign at start or after operator
    parsed = parsed.replace(/\(\-\)/g, '(-1)*')

    return parsed
  }

  /**
   * Evaluate a mathematical expression
   */
  evaluate(expression: string): EvaluationResult {
    try {
      const parsed = this.parseExpression(expression)
      const result = this.math.evaluate(parsed, this.scope)

      // Handle different result types
      let numResult: number
      if (typeof result === 'number') {
        numResult = result
      } else if (typeof result === 'object' && result !== null) {
        // Could be a complex number or matrix
        if ('re' in result && 'im' in result) {
          // Complex number - return real part if imaginary is 0
          if (Math.abs(result.im) < 1e-10) {
            numResult = result.re
          } else {
            return { success: false, error: 'ERR:NONREAL ANS' }
          }
        } else {
          return { success: false, error: 'ERR:DATA TYPE' }
        }
      } else {
        numResult = Number(result)
      }

      // Update Ans
      this.scope.Ans = numResult

      return { success: true, value: numResult }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // Map common errors to TI-84 style messages
      if (errorMessage.includes('Undefined symbol')) {
        return { success: false, error: 'ERR:UNDEFINED' }
      }
      if (errorMessage.includes('Unexpected') || errorMessage.includes('syntax')) {
        return { success: false, error: 'ERR:SYNTAX' }
      }
      if (errorMessage.includes('division by zero')) {
        return { success: false, error: 'ERR:DIVIDE BY 0' }
      }
      if (errorMessage.includes('domain')) {
        return { success: false, error: 'ERR:DOMAIN' }
      }

      return { success: false, error: 'ERR:SYNTAX' }
    }
  }

  /**
   * Evaluate a function at a specific X value (for graphing)
   */
  evaluateAt(expression: string, x: number): number | null {
    try {
      // Store X temporarily
      const originalX = this.scope['X']
      this.scope['X'] = x

      const result = this.evaluate(expression)

      // Restore X
      this.scope['X'] = originalX

      if (result.success && result.value !== undefined && isFinite(result.value)) {
        return result.value
      }
      return null
    } catch {
      return null
    }
  }

  /**
   * Store a value in a variable
   */
  storeVariable(name: string, value: number): void {
    if (name in this.scope) {
      this.scope[name] = value
    }
  }

  /**
   * Get a variable's value
   */
  getVariable(name: string): number {
    return this.scope[name] ?? 0
  }

  /**
   * Get the last answer
   */
  getAns(): number {
    return this.scope.Ans
  }

  /**
   * Get all variables for display
   */
  getAllVariables(): Record<string, number> {
    return { ...this.scope }
  }
}
