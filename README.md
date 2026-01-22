# Alexis Calc - TI-84 Graphing Calculator

A fully functional TI-84 graphing calculator web app with a special "Alexis Mode" featuring sparkly effects and customizable color schemes. Built with React + TypeScript.

## Features

### Full TI-84 Calculator Functionality
- **Basic arithmetic**: +, -, ×, ÷, ^
- **Scientific functions**: sin, cos, tan, log, ln, sqrt, abs
- **Inverse trig**: sin⁻¹, cos⁻¹, tan⁻¹
- **Constants**: π, e
- **Parentheses and order of operations**
- **Variables**: A-Z storage with Ans (last answer)
- **2nd and Alpha modifier keys**
- **Keyboard support**: Type numbers and operators directly

### Graphing
- **Y= Editor**: Enter up to 6 functions
- **Graph View**: Visualize functions with proper axes and grid
- **Trace Mode**: Click or use arrow keys to trace along functions
- **Window Settings**: Customize Xmin, Xmax, Ymin, Ymax, scales
- **Zoom Presets**: Standard, Trig, Decimal, Square

### Table Feature
- Generate X/Y value tables from your functions
- Adjustable start value and step size
- View multiple functions simultaneously

### Alexis Mode
Toggle Alexis Mode for a sparkly, vibrant experience:
- **Sparkle effects** burst from buttons on every press
- **Floating background particles** that twinkle
- **6 preset color themes**: Pink, Purple, Blue, Rainbow, Mint, Gold
- **Custom color picker** to create your own theme
- **Toggle sparkles on/off** independently
- Settings persist in localStorage

## Live Demo

Visit: `https://[your-username].github.io/alexis-calc/`

## Development

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure
```
src/
├── components/
│   ├── Calculator/     # Main calculator container
│   ├── Display/        # LCD display
│   ├── Keypad/         # Buttons with sparkle effects
│   ├── Graph/          # Graphing screen, Y= editor, window settings
│   ├── Table/          # Table feature
│   └── AlexisMode/     # Toggle, color picker, sparkle canvas
├── context/
│   ├── CalculatorContext.tsx  # Calculator state management
│   └── ThemeContext.tsx       # Alexis mode theming
├── engine/
│   ├── MathEngine.ts   # math.js wrapper for calculations
│   └── GraphEngine.ts  # Function plotting logic
└── styles/
    └── global.css      # CSS variables and base styles
```

## Deployment to GitHub Pages

1. Create a new GitHub repository
2. Push this code to the repository
3. Go to repository Settings → Pages
4. Under "Build and deployment", select "GitHub Actions"
5. The included workflow (`.github/workflows/deploy.yml`) will automatically build and deploy on push to main

## Usage Tips

### Calculator Mode
- Type expressions using the on-screen keypad or your keyboard
- Press ENTER or click the blue ENTER button to evaluate
- Use 2nd (yellow) to access secondary functions (shown above each key in yellow)
- Use ALPHA (green) to type letters A-Z for variables
- CLEAR resets everything, DEL removes one character

### Graphing
1. Click **Y=** to enter functions (use X as the variable)
2. Click **GRAPH** to see the plot
3. Click **WINDOW** to adjust the viewing range
4. Use **TRACE** to find Y values at specific X points

### Table
1. First set up functions in Y= editor
2. Access via 2nd + GRAPH (TABLE)
3. Adjust TblStart and ΔTbl to control which X values are shown

### Alexis Mode
- Toggle the switch in the top-right corner
- Pick a preset theme or customize your own colors
- Toggle sparkles on/off with the checkbox
- Your preferences are saved automatically!

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast builds
- **math.js** for expression parsing and evaluation
- **HTML5 Canvas** for graphing
- **CSS Modules** + CSS Custom Properties for theming

## License

MIT - Feel free to use and modify!

---

Made with sparkles for Alexis ✨
