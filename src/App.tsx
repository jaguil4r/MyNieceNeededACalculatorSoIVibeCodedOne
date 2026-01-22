import { ThemeProvider } from './context/ThemeContext'
import { CalculatorProvider } from './context/CalculatorContext'
import { Calculator } from './components/Calculator/Calculator'
import { SparkleCanvas } from './components/AlexisMode/SparkleCanvas'

function App() {
  return (
    <ThemeProvider>
      <CalculatorProvider>
        <SparkleCanvas />
        <Calculator />
      </CalculatorProvider>
    </ThemeProvider>
  )
}

export default App
