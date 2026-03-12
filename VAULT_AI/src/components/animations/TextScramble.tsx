import { useEffect, useRef, useState } from 'react'

interface TextScrambleProps {
  text: string
  className?: string
  duration?: number
  delay?: number
  chars?: string
}

export default function TextScramble({
  text,
  className = '',
  duration = 2000,
  delay = 0,
  chars = '!<>-_\\/[]{}—=+*^?#________',
}: TextScrambleProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = []
    const frame = 1000 / 60
    let frameCounter = 0
    let animationId: number

    // Build queue
    for (let i = 0; i < text.length; i++) {
      const from = text[i] || ''
      const to = text[i] || ''
      const start = Math.floor(Math.random() * (duration / frame) * 0.5)
      const end = start + Math.floor(Math.random() * (duration / frame) * 0.5)
      queue.push({ from, to, start, end })
    }

    const update = () => {
      let output = ''
      let complete = 0

      for (let i = 0; i < queue.length; i++) {
        const { from, to, start, end } = queue[i]
        let char = queue[i].char

        if (frameCounter >= end) {
          complete++
          output += to
        } else if (frameCounter >= start) {
          if (!char || Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)]
            queue[i].char = char
          }
          output += char
        } else {
          output += from
        }
      }

      setDisplayText(output)

      if (complete === queue.length) {
        cancelAnimationFrame(animationId)
      } else {
        frameCounter++
        animationId = requestAnimationFrame(update)
      }
    }

    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(update)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      cancelAnimationFrame(animationId)
    }
  }, [text, duration, delay, chars])

  return (
    <span ref={elementRef} className={className}>
      {displayText || text}
    </span>
  )
}
