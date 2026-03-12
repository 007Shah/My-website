import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, MessageSquare, Image, FileText, Sparkles, Volume2, Video } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const aiTools = [
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus',
    description: 'Advanced conversational AI',
    icon: MessageSquare,
    color: '#10A37F',
    price: '$20/mo',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'Stunning AI image generation',
    icon: Image,
    color: '#000000',
    price: '$10/mo',
  },
  {
    id: 'claude',
    name: 'Claude Pro',
    description: 'Anthropic\'s powerful LLM',
    icon: FileText,
    color: '#CC785C',
    price: '$20/mo',
  },
  {
    id: 'gemini',
    name: 'Gemini Advanced',
    description: 'Google\'s multimodal AI',
    icon: Sparkles,
    color: '#4285F4',
    price: '$20/mo',
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Lifelike voice synthesis',
    icon: Volume2,
    color: '#1E3A8A',
    price: '$5/mo',
  },
  {
    id: 'runway',
    name: 'Runway',
    description: 'AI video generation',
    icon: Video,
    color: '#FF4D2E',
    price: '$15/mo',
  },
]

export default function BrowseGrid() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const grid = gridRef.current
    const cards = cardsRef.current.filter(Boolean)

    if (!section || !title || !grid || cards.length === 0) return

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
      // Title from left
      scrollTl.fromTo(
        title,
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      )

      // Grid from right
      scrollTl.fromTo(
        grid,
        { x: '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      )

      // Cards stagger
      cards.forEach((card, i) => {
        const delay = i * 0.02
        scrollTl.fromTo(
          card,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          delay
        )
      })

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl.fromTo(
        title,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo(
        grid,
        { x: 0, opacity: 1 },
        { x: '-35vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="browse"
      className="section-pinned flex items-center z-20"
    >
      <div className="w-full px-6 lg:px-12 py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">
          {/* Title Block */}
          <div ref={titleRef} className="lg:w-[28vw] lg:sticky lg:top-1/4">
            <span className="eyebrow mb-4 block">Browse</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-vault-text mb-6">
              Top AI tools—compared side by side.
            </h2>
            <p className="text-vault-text-secondary text-lg mb-8">
              From writing to image generation to voice. Filter by use case, then subscribe in two clicks.
            </p>
            <button className="flex items-center gap-2 text-vault-accent hover:text-vault-amber transition-colors group">
              <span className="font-medium">View all 40+ tools</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Grid */}
          <div
            ref={gridRef}
            className="lg:w-[51vw] lg:ml-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {aiTools.map((tool, index) => {
                const Icon = tool.icon
                return (
                  <div
                    key={tool.id}
                    ref={(el) => { cardsRef.current[index] = el }}
                    className="glass-card p-6 group cursor-pointer hover:bg-white/[0.06] transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Accent dot */}
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-vault-accent" />

                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${tool.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: tool.color }} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-vault-text mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-vault-text-secondary text-sm mb-4">
                      {tool.description}
                    </p>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-vault-accent font-mono font-medium">
                        {tool.price}
                      </span>
                      <button className="text-sm text-vault-text-secondary hover:text-vault-text transition-colors flex items-center gap-1 group/btn">
                        Details
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
