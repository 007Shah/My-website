import { useRef, useCallback } from 'react'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}

export default function MagneticButton({
  children,
  className = '',
  strength = 30,
  onClick,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    button.style.transform = `translate(${x * (strength / 100)}px, ${y * (strength / 100)}px)`
  }, [strength])

  const handleMouseLeave = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    button.style.transform = 'translate(0, 0)'
    button.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    
    setTimeout(() => {
      if (button) {
        button.style.transition = ''
      }
    }, 400)
  }, [])

  return (
    <button
      ref={buttonRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
