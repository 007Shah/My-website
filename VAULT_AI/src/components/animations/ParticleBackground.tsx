import { useEffect, useRef } from 'react'

interface ParticleBackgroundProps {
  particleCount?: number
  color?: string
  minSize?: number
  maxSize?: number
}

export default function ParticleBackground({
  particleCount = 50,
  color = '#FF4D2E',
  minSize = 2,
  maxSize = 6,
}: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'absolute rounded-full pointer-events-none'
      particle.style.backgroundColor = color
      particle.style.width = `${Math.random() * (maxSize - minSize) + minSize}px`
      particle.style.height = particle.style.width
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particle.style.opacity = `${Math.random() * 0.3 + 0.1}`
      
      // Add animation
      const duration = Math.random() * 5000 + 3000
      const delay = Math.random() * 2000
      particle.style.animation = `float ${duration}ms ease-in-out ${delay}ms infinite alternate`
      
      container.appendChild(particle)
    }

    return () => {
      container.innerHTML = ''
    }
  }, [particleCount, color, minSize, maxSize])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    />
  )
}
