import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Sparkles, Zap, Shield, TrendingUp, Check } from 'lucide-react'
import SEO from '../components/seo/SEO'
import Orb from '../components/three/Orb'
import ScrollReveal from '../components/animations/ScrollReveal'
import MagneticButton from '../components/animations/MagneticButton'
import { aiTools, bundles } from '../data/aiTools'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '40+', label: 'AI Tools' },
  { value: '50K+', label: 'Active Users' },
  { value: '$2M+', label: 'Saved Monthly' },
  { value: '4.9', label: 'User Rating' },
]

const features = [
  {
    icon: Sparkles,
    title: 'All-in-One Dashboard',
    description: 'Manage all your AI subscriptions from a single, unified interface.',
  },
  {
    icon: Zap,
    title: 'Instant Activation',
    description: 'Get immediate access to any tool with our streamlined onboarding.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Enterprise-grade security for all your transactions and data.',
  },
  {
    icon: TrendingUp,
    title: 'Save Up to 40%',
    description: 'Bundle multiple tools together and save with exclusive discounts.',
  },
]

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const orbContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hero entrance animation
    const tl = gsap.timeline({ delay: 0.3 })

    tl.fromTo(
      '.hero-title .word',
      { y: 60, opacity: 0, rotateX: -40 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }
    )

    tl.fromTo(
      '.hero-subtitle',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )

    tl.fromTo(
      '.hero-cta',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )

    // Orb entrance
    tl.fromTo(
      orbContainerRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' },
      '-=1'
    )

    // Stats counter animation
    const statElements = statsRef.current?.querySelectorAll('.stat-value')
    statElements?.forEach((el) => {
      const target = el.getAttribute('data-value') || '0'
      const numericValue = parseInt(target.replace(/\D/g, ''))

      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: numericValue,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function() {
            const current = Math.round(Number(gsap.getProperty(el, 'innerText')))
            if (target.includes('K')) {
              el.innerHTML = current + 'K+'
            } else if (target.includes('M')) {
              el.innerHTML = current + 'M+'
            } else if (target.includes('+')) {
              el.innerHTML = current + '+'
            } else {
              el.innerHTML = current.toString()
            }
          }
        }
      )
    })

    // Scroll-triggered animations
    gsap.utils.toArray<HTMLElement>('.feature-card').forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <>
      <SEO
        title="AIVault - One Vault. Every AI."
        description="Compare, subscribe, and manage the best AI tools in one place. Access ChatGPT, Midjourney, Claude, Gemini, and 40+ more AI tools with exclusive bundle discounts."
        canonical="https://aivault.io"
      />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-vault-accent/10 via-transparent to-transparent" />

        {/* 3D Orb */}
        <div
          ref={orbContainerRef}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] opacity-0"
        >
          <Orb />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 lg:px-12">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="hero-subtitle inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vault-accent/10 border border-vault-accent/20 mb-6">
              <Sparkles className="w-4 h-4 text-vault-accent" />
              <span className="text-sm text-vault-accent font-medium">
                Now with 40+ AI tools
              </span>
            </div>

            {/* Title */}
            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-heading text-vault-text mb-6 leading-tight">
              <span className="word inline-block">One</span>{' '}
              <span className="word inline-block">vault.</span>
              <br />
              <span className="word inline-block text-gradient">Every</span>{' '}
              <span className="word inline-block text-gradient">AI.</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle text-lg md:text-xl text-vault-text-secondary max-w-xl mb-8">
              Compare, subscribe, and manage the best generative tools—without the tab chaos. 
              Save up to 40% with exclusive bundles.
            </p>

            {/* CTAs */}
            <div className="hero-cta flex flex-col sm:flex-row gap-4">
              <MagneticButton>
                <Link to="/browse" className="btn-primary flex items-center justify-center gap-2">
                  Explore AI Tools
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </MagneticButton>
              <Link to="/pricing" className="btn-secondary flex items-center justify-center gap-2">
                View Pricing
              </Link>
            </div>

            {/* Trust badges */}
            <div className="hero-cta mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-vault-accent to-vault-orange flex items-center justify-center text-white text-xs font-bold border-2 border-vault-black"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Sparkles key={i} className="w-4 h-4 text-vault-accent fill-vault-accent" />
                  ))}
                </div>
                <p className="text-sm text-vault-text-secondary">
                  Trusted by 50,000+ users
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-vault-text-secondary uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-vault-text-secondary/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 rounded-full bg-vault-accent animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5">
        <div className="w-full px-6 lg:px-12">
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="text-center">
                  <div
                    className="stat-value text-4xl md:text-5xl font-bold font-heading text-vault-text mb-2"
                    data-value={stat.value}
                  >
                    0
                  </div>
                  <div className="text-vault-text-secondary">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="eyebrow mb-4 block">Why AIVault</span>
                <h2 className="text-4xl md:text-5xl font-bold font-heading text-vault-text mb-4">
                  Everything you need
                </h2>
                <p className="text-vault-text-secondary text-lg max-w-2xl mx-auto">
                  Simplify your AI workflow with our comprehensive platform
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="feature-card glass-card p-8 hover:bg-white/[0.06] transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-vault-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-vault-accent/30 transition-all duration-300">
                      <Icon className="w-7 h-7 text-vault-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-vault-text mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-vault-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-24 bg-vault-black-secondary/30">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                <div>
                  <span className="eyebrow mb-4 block">Popular Tools</span>
                  <h2 className="text-4xl md:text-5xl font-bold font-heading text-vault-text">
                    Most loved AI tools
                  </h2>
                </div>
                <Link
                  to="/browse"
                  className="flex items-center gap-2 text-vault-accent hover:text-vault-amber transition-colors group"
                >
                  <span className="font-medium">View all tools</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiTools.filter(t => t.popular).slice(0, 6).map((tool) => (
                <ScrollReveal key={tool.id}>
                  <Link
                    to={`/browse/${tool.id}`}
                    className="glass-card p-6 group hover:bg-white/[0.06] transition-all duration-300 block"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${tool.color}20` }}
                      >
                        <span className="text-2xl" style={{ color: tool.color }}>
                          {tool.name.charAt(0)}
                        </span>
                      </div>
                      {tool.new && (
                        <span className="px-2 py-1 rounded-full bg-vault-accent/20 text-vault-accent text-xs font-medium">
                          New
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-vault-text mb-2 group-hover:text-vault-accent transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-vault-text-secondary text-sm mb-4">
                      {tool.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-vault-accent font-mono">
                        {tool.price}<span className="text-vault-text-secondary">{tool.priceDetail}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-vault-accent" />
                        <span className="text-sm text-vault-text-secondary">{tool.rating}</span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bundles Section */}
      <section className="py-24">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="eyebrow mb-4 block">Bundles</span>
                <h2 className="text-4xl md:text-5xl font-bold font-heading text-vault-text mb-4">
                  Save with bundles
                </h2>
                <p className="text-vault-text-secondary text-lg max-w-2xl mx-auto">
                  Get multiple AI tools together and save up to 40%
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bundles.map((bundle, index) => (
                <ScrollReveal key={bundle.id} delay={index * 100}>
                  <div
                    className={`glass-card p-6 ${
                      bundle.featured ? 'glow-border lg:scale-105' : ''
                    }`}
                  >
                    {bundle.featured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full bg-vault-accent text-white text-xs font-medium">
                          Best Value
                        </span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-vault-text mb-2">
                      {bundle.name}
                    </h3>
                    <p className="text-vault-text-secondary text-sm mb-4">
                      {bundle.description}
                    </p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold font-heading text-vault-text">
                        ${bundle.bundlePrice}
                      </span>
                      <span className="text-vault-text-secondary line-through text-sm">
                        ${bundle.originalPrice}
                      </span>
                    </div>
                    <div className="text-vault-accent text-sm mb-4">
                      Save {bundle.savings}%
                    </div>
                    <ul className="space-y-2 mb-6">
                      {bundle.tools.slice(0, 3).map((toolId) => {
                        const tool = aiTools.find(t => t.id === toolId)
                        return tool ? (
                          <li key={toolId} className="flex items-center gap-2 text-sm text-vault-text-secondary">
                            <Check className="w-4 h-4 text-vault-accent" />
                            {tool.name}
                          </li>
                        ) : null
                      })}
                      {bundle.tools.length > 3 && (
                        <li className="text-sm text-vault-text-secondary">
                          +{bundle.tools.length - 3} more tools
                        </li>
                      )}
                    </ul>
                    <Link
                      to="/pricing"
                      className={`w-full block text-center py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                        bundle.featured ? 'btn-primary' : 'btn-secondary'
                      }`}
                    >
                      Get Bundle
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="w-full px-6 lg:px-12">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto glass-card-strong p-12 md:p-16 text-center relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vault-accent/20 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold font-heading text-vault-text mb-6">
                  Ready to simplify your AI workflow?
                </h2>
                <p className="text-vault-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                  Join 50,000+ users who trust AIVault to manage their AI tools. 
                  Start free, upgrade when you're ready.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup" className="btn-primary flex items-center justify-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/contact" className="btn-secondary flex items-center justify-center gap-2">
                    Talk to Sales
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
