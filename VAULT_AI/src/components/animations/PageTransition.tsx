import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const transitionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const transition = transitionRef.current
    const content = contentRef.current
    if (!transition || !content) return

    // Simple CSS-based entrance animation
    transition.style.transform = 'translateY(0%)'
    content.style.opacity = '0'

    const timer = setTimeout(() => {
      transition.style.transition = 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)'
      transition.style.transform = 'translateY(-100%)'
      
      setTimeout(() => {
        content.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
        content.style.opacity = '1'
        content.style.transform = 'translateY(0)'
      }, 400)
    }, 100)

    return () => clearTimeout(timer)
  }, [location])

  return (
    <>
      {/* Transition overlay */}
      <div
        ref={transitionRef}
        className="fixed inset-0 z-[9999] bg-vault-accent"
        style={{ transform: 'translateY(0%)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-4xl font-bold font-heading animate-pulse">
            AIVault
          </div>
        </div>
      </div>

      {/* Page content */}
      <div ref={contentRef} className="opacity-0" style={{ transform: 'translateY(30px)' }}>
        {children}
      </div>
    </>
  )
}
