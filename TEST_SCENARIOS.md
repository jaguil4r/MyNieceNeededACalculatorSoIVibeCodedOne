# Test Scenarios for College Algebra

Use these scenarios to test the calculator functionality. These cover typical freshman algebra/functions coursework.

## Basic Arithmetic

| Input | Expected Result |
|-------|-----------------|
| `2+3` | 5 |
| `10-4` | 6 |
| `6×7` | 42 |
| `15÷3` | 5 |
| `2+3×4` | 14 (order of operations) |
| `(2+3)×4` | 20 |
| `2^10` | 1024 |
| `(-3)^2` | 9 |
| `(-2)^3` | -8 |

## Scientific Functions

| Input | Expected Result |
|-------|-----------------|
| `sin(0)` | 0 |
| `cos(0)` | 1 |
| `tan(0)` | 0 |
| `sin(π÷2)` | 1 |
| `cos(π)` | -1 |
| `log(100)` | 2 |
| `log(1000)` | 3 |
| `ln(e)` | 1 |
| `ln(e^2)` | 2 |
| `√(144)` | 12 |
| `√(2)` | ~1.414 |
| `abs(-5)` | 5 |

## Exponents and Roots

| Input | Expected Result |
|-------|-----------------|
| `2^8` | 256 |
| `10^3` | 1000 |
| `16^0.5` | 4 (same as √16) |
| `27^(1÷3)` | 3 (cube root) |
| `2^(-1)` | 0.5 |
| `e^1` | ~2.718 |
| `e^0` | 1 |

## Quadratic Equations

### Evaluating Quadratics
To evaluate x² - 4x + 3 at x = 2:
1. Type: `2^2-4×2+3`
2. Expected: -1

### Quadratic Formula Components
For ax² + bx + c = 0 where a=1, b=5, c=6:
1. Discriminant: `5^2-4×1×6` = 1
2. Square root of discriminant: `√(1)` = 1
3. Solutions: `(-5+1)÷(2×1)` = -2 and `(-5-1)÷(2×1)` = -3

## Graphing Functions

### Basic Functions to Graph
Enter these in Y= editor and view graph:

1. **Linear**: `Y1 = 2X+1` (slope-intercept form)
2. **Quadratic**: `Y2 = X^2` (parabola)
3. **Quadratic**: `Y3 = X^2-4` (shifted parabola)
4. **Absolute Value**: `Y4 = abs(X)` (V-shape)
5. **Square Root**: `Y5 = sqrt(X)` (half parabola)
6. **Sine Wave**: `Y6 = sin(X)` (use Trig zoom preset)
7. **Exponential**: `Y7 = 2^X` (exponential growth)
8. **Rational**: `Y8 = 1/X` (hyperbola with asymptote)

### Window Settings to Try
- **Standard**: Xmin=-10, Xmax=10, Ymin=-10, Ymax=10
- **Trig**: Xmin=-2π, Xmax=2π, Ymin=-4, Ymax=4
- **Zoom for f(x)=x²**: Xmin=-5, Xmax=5, Ymin=-2, Ymax=25

## Table Feature

### Testing Table Generation
1. Set `Y1 = X^2`
2. Go to Table
3. Set TblStart = -3, ΔTbl = 1
4. Expected values:

| X | Y1 |
|---|-----|
| -3 | 9 |
| -2 | 4 |
| -1 | 1 |
| 0 | 0 |
| 1 | 1 |
| 2 | 4 |
| 3 | 9 |

## Compound Interest Formula

Formula: A = P(1 + r/n)^(nt)

Example: $1000 invested at 5% annual rate, compounded monthly for 1 year
- P = 1000, r = 0.05, n = 12, t = 1
- Input: `1000×(1+0.05÷12)^(12×1)`
- Expected: ~1051.16

## Trigonometric Identities

Test: sin²(x) + cos²(x) = 1 for any x

1. Input: `sin(π÷4)^2+cos(π÷4)^2`
2. Expected: 1

## Distance Formula

Distance between (1,2) and (4,6):
- Input: `√((4-1)^2+(6-2)^2)`
- Expected: 5

## Slope Formula

Slope between (1,2) and (4,8):
- Input: `(8-2)÷(4-1)`
- Expected: 2

## Logarithm Properties

Test: log(a×b) = log(a) + log(b)
- Input: `log(100×10)`
- Expected: 3
- Verify: `log(100)+log(10)` = 2 + 1 = 3

Test: log(a^n) = n×log(a)
- Input: `log(10^5)`
- Expected: 5

## Practice Problems

### Problem 1: Solve for area
Circle with radius 5:
- Area = π×r²
- Input: `π×5^2`
- Expected: ~78.54

### Problem 2: Pythagorean theorem
Right triangle with legs 3 and 4:
- Hypotenuse = √(a² + b²)
- Input: `√(3^2+4^2)`
- Expected: 5

### Problem 3: Exponential decay
Half-life problem: A = A₀ × (0.5)^(t/h)
Starting amount 100, half-life 10, time 30:
- Input: `100×0.5^(30÷10)`
- Expected: 12.5

### Problem 4: Population growth
P = P₀ × e^(rt)
Initial pop 1000, growth rate 0.05, time 10:
- Input: `1000×e^(0.05×10)`
- Expected: ~1648.72
