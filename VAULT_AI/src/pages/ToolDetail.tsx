import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowLeft, ExternalLink, Check, X, Star, Sparkles, Users } from 'lucide-react'
import SEO from '../components/seo/SEO'
import ScrollReveal from '../components/animations/ScrollReveal'
import { aiTools } from '../data/aiTools'

export default function ToolDetail() {
  const { toolId } = useParams<{ toolId: string }>()
  const navigate = useNavigate()
  const tool = aiTools.find(t => t.id === toolId)

  useEffect(() => {
    if (!tool) {
      navigate('/browse')
      return
    }

    // Page entrance animation
    gsap.fromTo(
      '.tool-detail-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [tool, navigate])

  if (!tool) return null

  const relatedTools = aiTools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3)

  return (
    <>
      <SEO
        title={`${tool.name} - AI Tool Details`}
        description={tool.longDescription}
        canonical={`https://aivault.io/browse/${tool.id}`}
      />

      <div className="pt-24 pb-24">
        {/* Back button */}
        <div className="w-full px-6 lg:px-12 mb-8">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 text-vault-text-secondary hover:text-vault-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to browse
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="tool-detail-content w-full px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="glass-card-strong p-8 md:p-12 mb-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Icon */}
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-bold flex-shrink-0"
                  style={{
                    backgroundColor: `${tool.color}20`,
                    color: tool.color,
                  }}
                >
                  {tool.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-3xl md:text-4xl font-bold font-heading text-vault-text">
                      {tool.name}
                    </h1>
                    {tool.new && (
                      <span className="px-3 py-1 rounded-full bg-vault-accent/20 text-vault-accent text-sm font-medium">
                        New
                      </span>
                    )}
                    {tool.popular && (
                      <span className="px-3 py-1 rounded-full bg-vault-amber/20 text-vault-amber text-sm font-medium flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        Popular
                      </span>
                    )}
                  </div>

                  <p className="text-vault-text-secondary text-lg mb-4">
                    {tool.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-vault-accent fill-vault-accent" />
                      <span className="text-vault-text font-medium">{tool.rating}</span>
                      <span className="text-vault-text-secondary">
                        ({tool.reviews.toLocaleString()} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-vault-text-secondary" />
                      <span className="text-vault-text-secondary">
                        {tool.reviews.toLocaleString()}+ users
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex flex-col items-start md:items-end gap-4">
                  <div className="text-right">
                    <div className="text-3xl font-bold font-heading text-vault-text">
                      {tool.price}
                    </div>
                    <div className="text-vault-text-secondary">{tool.priceDetail}</div>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-2"
                    >
                      Visit Site
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link to="/pricing" className="btn-primary">
                      Subscribe
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <ScrollReveal>
              <div className="glass-card p-8 mb-8">
                <h2 className="text-2xl font-bold font-heading text-vault-text mb-4">
                  About {tool.name}
                </h2>
                <p className="text-vault-text-secondary leading-relaxed">
                  {tool.longDescription}
                </p>
              </div>
            </ScrollReveal>

            {/* Features */}
            <ScrollReveal delay={100}>
              <div className="glass-card p-8 mb-8">
                <h2 className="text-2xl font-bold font-heading text-vault-text mb-6">
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-vault-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-vault-accent" />
                      </div>
                      <span className="text-vault-text">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ScrollReveal delay={150}>
                <div className="glass-card p-8">
                  <h3 className="text-xl font-bold font-heading text-vault-text mb-6">
                    Pros
                  </h3>
                  <ul className="space-y-3">
                    {tool.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-500" />
                        </div>
                        <span className="text-vault-text-secondary">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="glass-card p-8">
                  <h3 className="text-xl font-bold font-heading text-vault-text mb-6">
                    Cons
                  </h3>
                  <ul className="space-y-3">
                    {tool.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-red-500" />
                        </div>
                        <span className="text-vault-text-secondary">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <ScrollReveal delay={250}>
                <div>
                  <h2 className="text-2xl font-bold font-heading text-vault-text mb-6">
                    Similar Tools
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedTools.map((relatedTool) => (
                      <Link
                        key={relatedTool.id}
                        to={`/browse/${relatedTool.id}`}
                        className="glass-card p-6 hover:bg-white/[0.06] transition-all duration-300"
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mb-4"
                          style={{
                            backgroundColor: `${relatedTool.color}20`,
                            color: relatedTool.color,
                          }}
                        >
                          {relatedTool.name.charAt(0)}
                        </div>
                        <h3 className="text-lg font-semibold text-vault-text mb-2">
                          {relatedTool.name}
                        </h3>
                        <p className="text-vault-text-secondary text-sm line-clamp-2">
                          {relatedTool.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
