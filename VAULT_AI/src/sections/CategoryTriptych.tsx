import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, FileText, Image, Volume2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  {
    id: 'text',
    name: 'TEXT',
    description: 'LLMs & writing assistants',
    icon: FileText,
    gradient: 'from-vault-accent/30 via-vault-black to-vault-amber/20',
  },
  {
    id: 'image',
    name: 'IMAGE',
    description: 'Generative art & editing',
    icon: Image,
    gradient: 'from-vault-amber/20 via-vault-black to-vault-accent/30',
  },
  {
    id: 'audio',
    name: 'AUDIO',
    description: 'Voice, music & sound',
    icon: Volume2,
    gradient: 'from-vault-orange/30 via-vault-black to-vault-accent/20',
  },
]

export default function CategoryTriptych() {
  const sectionRef = useRef<HTMLElement>(null)
  const tilesRef = useRef<(HTMLDivElement | null)[]>([])
  const arrowsRef = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const tiles = tilesRef.current.filter(Boolean)
    const arrows = arrowsRef.current.filter(Boolean)

    if (!section || tiles.length === 0) return

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      })

      // ENTRANCE (0-30%)
      // Tile 1 from left
      scrollTl.fromTo(
        tiles[0],
        { x: '-60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      )

      // Tile 2 from bottom
      scrollTl.fromTo(
        tiles[1],
        { y: '60vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      )

      // Tile 3 from right
      scrollTl.fromTo(
        tiles[2],
        { x: '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      )

      // Arrow buttons
      arrows.forEach((arrow, i) => {
        scrollTl.fromTo(
          arrow,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'none' },
          0.18 + i * 0.02
        )
      })

      // SETTLE (30-70%): Subtle parallax on tiles
      tiles.forEach((tile) => {
        const image = tile?.querySelector('.tile-image')
        if (image) {
          scrollTl.fromTo(
            image,
            { y: 14 },
            { y: -14, ease: 'none' },
            0.3
          )
        }
      })

      // EXIT (70-100%)
      tiles.forEach((tile) => {
        scrollTl.fromTo(
          tile,
          { scale: 1, opacity: 1 },
          { scale: 0.88, opacity: 0, ease: 'power2.in' },
          0.7
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="section-pinned flex items-center z-50"
    >
      <div className="w-full px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <div
                key={category.id}
                ref={(el) => { tilesRef.current[index] = el }}
                className="lg:w-[26vw] lg:h-[72vh] h-[40vh] glass-card overflow-hidden group cursor-pointer"
              >
                {/* Background gradient */}
                <div
                  className={`tile-image absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500`}
                />

                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,77,46,0.3) 1px, transparent 0)`,
                    backgroundSize: '32px 32px',
                  }} />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-vault-text" />
                  </div>

                  {/* Text */}
                  <span className="eyebrow mb-2">{category.name}</span>
                  <p className="text-vault-text-secondary text-sm">
                    {category.description}
                  </p>
                </div>

                {/* Arrow button */}
                <button
                  ref={(el) => { arrowsRef.current[index] = el }}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-vault-accent transition-colors duration-300 animate-pulse-slow"
                >
                  <ArrowUpRight className="w-5 h-5 text-vault-text" />
                </button>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-vault-accent/20 via-transparent to-transparent" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
