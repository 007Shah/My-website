import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Check, X, ArrowRight, Sparkles } from 'lucide-react'
import SEO from '../components/seo/SEO'
import { aiTools } from '../data/aiTools'

const comparisonFeatures = [
  { id: 'price', name: 'Starting Price', category: 'pricing' },
  { id: 'freeTier', name: 'Free Tier', category: 'pricing' },
  { id: 'api', name: 'API Access', category: 'features' },
  { id: 'team', name: 'Team Features', category: 'features' },
  { id: 'support', name: 'Priority Support', category: 'support' },
  { id: 'analytics', name: 'Usage Analytics', category: 'features' },
  { id: 'integrations', name: 'Integrations', category: 'features' },
  { id: 'security', name: 'Enterprise Security', category: 'security' },
  { id: 'sso', name: 'SSO', category: 'security' },
  { id: 'sla', name: 'SLA', category: 'support' },
]

const toolComparisonData: Record<string, Record<string, boolean | string>> = {
  chatgpt: {
    price: '$20/mo',
    freeTier: true,
    api: true,
    team: true,
    support: true,
    analytics: false,
    integrations: true,
    security: true,
    sso: false,
    sla: false,
  },
  claude: {
    price: '$20/mo',
    freeTier: true,
    api: true,
    team: false,
    support: true,
    analytics: false,
    integrations: false,
    security: true,
    sso: false,
    sla: false,
  },
  gemini: {
    price: '$20/mo',
    freeTier: true,
    api: true,
    team: true,
    support: true,
    analytics: true,
    integrations: true,
    security: true,
    sso: true,
    sla: false,
  },
  midjourney: {
    price: '$10/mo',
    freeTier: false,
    api: false,
    team: true,
    support: false,
    analytics: false,
    integrations: false,
    security: true,
    sso: false,
    sla: false,
  },
  runway: {
    price: '$15/mo',
    freeTier: false,
    api: true,
    team: true,
    support: true,
    analytics: true,
    integrations: true,
    security: true,
    sso: false,
    sla: false,
  },
  elevenlabs: {
    price: '$5/mo',
    freeTier: true,
    api: true,
    team: false,
    support: false,
    analytics: true,
    integrations: true,
    security: true,
    sso: false,
    sla: false,
  },
}

export default function Compare() {
  const [selectedTools, setSelectedTools] = useState<string[]>(['chatgpt', 'claude', 'gemini'])
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    gsap.fromTo(
      '.compare-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  const toggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter(id => id !== toolId))
    } else if (selectedTools.length < 4) {
      setSelectedTools([...selectedTools, toolId])
    }
  }

  const filteredFeatures = activeCategory === 'all'
    ? comparisonFeatures
    : comparisonFeatures.filter(f => f.category === activeCategory)

  const renderValue = (value: boolean | string) => {
    if (typeof value === 'string') {
      return <span className="text-vault-text font-medium">{value}</span>
    }
    return value ? (
      <Check className="w-5 h-5 text-green-500 mx-auto" />
    ) : (
      <X className="w-5 h-5 text-red-500 mx-auto" />
    )
  }

  return (
    <>
      <SEO
        title="Compare AI Tools"
        description="Side-by-side comparison of AI tools. Compare features, pricing, and capabilities to find the perfect tool for your needs."
        canonical="https://aivault.io/compare"
      />

      <div className="pt-24 pb-24">
        {/* Header */}
        <section className="w-full px-6 lg:px-12 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="compare-content">
              <span className="eyebrow mb-4 block">Compare</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-vault-text mb-4">
                Side-by-Side Comparison
              </h1>
              <p className="text-vault-text-secondary text-lg max-w-2xl">
                Compare features, pricing, and capabilities across different AI tools. 
                Select up to 4 tools to compare.
              </p>
            </div>
          </div>
        </section>

        {/* Tool Selector */}
        <section className="w-full px-6 lg:px-12 mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="glass-card-strong p-6">
              <h3 className="text-lg font-semibold text-vault-text mb-4">
                Select tools to compare ({selectedTools.length}/4)
              </h3>
              <div className="flex flex-wrap gap-3">
                {aiTools.slice(0, 8).map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    disabled={!selectedTools.includes(tool.id) && selectedTools.length >= 4}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      selectedTools.includes(tool.id)
                        ? 'bg-vault-accent text-white'
                        : 'bg-white/5 text-vault-text-secondary hover:bg-white/10 hover:text-vault-text disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tool.color }}
                    />
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="w-full px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'pricing', 'features', 'support', 'security'].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-vault-accent text-white'
                      : 'bg-white/5 text-vault-text-secondary hover:bg-white/10 hover:text-vault-text'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="glass-card overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 text-vault-text-secondary font-medium">
                      Feature
                    </th>
                    {selectedTools.map((toolId) => {
                      const tool = aiTools.find(t => t.id === toolId)
                      return tool ? (
                        <th key={toolId} className="p-6 text-center">
                          <Link
                            to={`/browse/${tool.id}`}
                            className="flex flex-col items-center gap-2 group"
                          >
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110"
                              style={{
                                backgroundColor: `${tool.color}20`,
                                color: tool.color,
                              }}
                            >
                              {tool.name.charAt(0)}
                            </div>
                            <span className="text-vault-text font-medium group-hover:text-vault-accent transition-colors">
                              {tool.name}
                            </span>
                          </Link>
                        </th>
                      ) : null
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredFeatures.map((feature, index) => (
                    <tr
                      key={feature.id}
                      className={`border-b border-white/5 ${
                        index % 2 === 0 ? 'bg-white/[0.02]' : ''
                      }`}
                    >
                      <td className="p-6 text-vault-text">{feature.name}</td>
                      {selectedTools.map((toolId) => (
                        <td key={toolId} className="p-6 text-center">
                          {renderValue(toolComparisonData[toolId]?.[feature.id] || false)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTA */}
            <div className="mt-12 glass-card p-8 text-center">
              <Sparkles className="w-12 h-12 text-vault-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold font-heading text-vault-text mb-2">
                Can't decide?
              </h3>
              <p className="text-vault-text-secondary mb-6">
                Get all these tools and more with our bundles. Save up to 40%.
              </p>
              <Link to="/pricing" className="btn-primary inline-flex items-center gap-2">
                View Bundles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
