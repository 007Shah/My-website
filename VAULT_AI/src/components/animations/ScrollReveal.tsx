import { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  duration?: number
  threshold?: number
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 50,
  duration = 800,
  threshold = 0.2,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Set initial state
    const translateMap = {
      up: { transform: `translateY(${distance}px)` },
      down: { transform: `translateY(-${distance}px)` },
      left: { transform: `translateX(${distance}px)` },
      right: { transform: `translateX(-${distance}px)` },
    }

    Object.assign(element.style, {
      opacity: '0',
      ...translateMap[direction],
      transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
    })

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(element)
          }
        })
      },
      { threshold }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [delay, direction, distance, duration, threshold])

  useEffect(() => {
    const element = elementRef.current
    if (!element || !isVisible) return

    element.style.opacity = '1'
    element.style.transform = 'translate(0, 0)'
  }, [isVisible])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}
