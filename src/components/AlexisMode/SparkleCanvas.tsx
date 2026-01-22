import { useRef, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import styles from './SparkleCanvas.module.css'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  hue: number
  twinkleSpeed: number
  twinklePhase: number
}

function parseColor(color: string): { r: number; g: number; b: number } {
  const match = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (match) {
    return {
      r: parseInt(match[1], 16),
      g: parseInt(match[2], 16),
      b: parseInt(match[3], 16),
    }
  }
  return { r: 255, g: 105, b: 180 } // Default pink
}

export function SparkleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { state } = useTheme()
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!state.isAlexisMode) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        hue: Math.random() * 60 - 30,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      }))
    }
    initParticles()

    const primary = parseColor(state.primaryColor)
    const secondary = parseColor(state.secondaryColor)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Update twinkle
        particle.twinklePhase += particle.twinkleSpeed
        const twinkle = (Math.sin(particle.twinklePhase) + 1) / 2

        // Interpolate color
        const t = (particle.hue + 30) / 60
        const r = Math.round(primary.r + (secondary.r - primary.r) * t)
        const g = Math.round(primary.g + (secondary.g - primary.g) * t)
        const b = Math.round(primary.b + (secondary.b - primary.b) * t)

        // Draw glow
        const glowRadius = particle.size * (2 + twinkle * 2)
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          glowRadius
        )
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${twinkle * 0.8})`)
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${twinkle * 0.3})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Draw star shape
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.twinklePhase * 0.5)

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${twinkle})`
        ctx.beginPath()

        const outerRadius = particle.size * (1 + twinkle * 0.5)
        const innerRadius = particle.size * 0.4
        const spikes = 4

        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const angle = (i * Math.PI) / spikes
          const px = Math.cos(angle) * radius
          const py = Math.sin(angle) * radius

          if (i === 0) {
            ctx.moveTo(px, py)
          } else {
            ctx.lineTo(px, py)
          }
        }

        ctx.closePath()
        ctx.fill()
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [state.isAlexisMode, state.primaryColor, state.secondaryColor])

  if (!state.isAlexisMode) return null

  return <canvas ref={canvasRef} className={styles.canvas} />
}
