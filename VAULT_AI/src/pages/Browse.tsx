import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Search, Filter, Star, Sparkles, ArrowRight, X } from 'lucide-react'
import SEO from '../components/seo/SEO'
import { aiTools, categories } from '../data/aiTools'

export default function Browse() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTools, setFilteredTools] = useState(aiTools)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Filter tools based on category and search
    let filtered = aiTools

    if (activeCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === activeCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        tool =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.features.some(f => f.toLowerCase().includes(query))
      )
    }

    setFilteredTools(filtered)

    // Animate grid items
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.tool-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      )
    }
  }, [activeCategory, searchQuery])

  useEffect(() => {
    // Page entrance animation
    gsap.fromTo(
      '.browse-header',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  return (
    <>
      <SEO
        title="Browse AI Tools"
        description="Discover and compare 40+ AI tools including ChatGPT, Midjourney, Claude, Gemini, and more. Find the perfect AI tool for your needs."
        canonical="https://aivault.io/browse"
      />

      <div className="pt-24 pb-24">
        {/* Header */}
        <section className="w-full px-6 lg:px-12 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="browse-header">
              <span className="eyebrow mb-4 block">Browse</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-vault-text mb-4">
                Discover AI Tools
              </h1>
              <p className="text-vault-text-secondary text-lg max-w-2xl">
                Explore 40+ AI tools across text, image, audio, video, and code. 
                Compare features, pricing, and find the perfect tool for your workflow.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="w-full px-6 lg:px-12 mb-8 sticky top-20 z-30">
          <div className="max-w-6xl mx-auto">
            <div className="glass-card-strong p-4 flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-text-secondary" />
                <input
                  type="text"
                  placeholder="Search AI tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input pl-12 w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-vault-text-secondary hover:text-vault-text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter className="w-5 h-5 text-vault-text-secondary flex-shrink-0" />
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      activeCategory === category.id
                        ? 'bg-vault-accent text-white'
                        : 'bg-white/5 text-vault-text-secondary hover:bg-white/10 hover:text-vault-text'
                    }`}
                  >
                    {category.name}
                    <span className="ml-2 opacity-60">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="w-full px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            {/* Results count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-vault-text-secondary">
                Showing <span className="text-vault-text font-medium">{filteredTools.length}</span> tools
              </p>
              {filteredTools.length === 0 && (
                <button
                  onClick={() => {
                    setActiveCategory('all')
                    setSearchQuery('')
                  }}
                  className="text-vault-accent hover:text-vault-amber transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Grid */}
            {filteredTools.length > 0 ? (
              <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={`/browse/${tool.id}`}
                    className="tool-card glass-card p-6 group hover:bg-white/[0.06] transition-all duration-300 block"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
                        style={{
                          backgroundColor: `${tool.color}20`,
                          color: tool.color,
                        }}
                      >
                        {tool.name.charAt(0)}
                      </div>
                      <div className="flex gap-2">
                        {tool.new && (
                          <span className="px-2 py-1 rounded-full bg-vault-accent/20 text-vault-accent text-xs font-medium">
                            New
                          </span>
                        )}
                        {tool.popular && (
                          <span className="px-2 py-1 rounded-full bg-vault-amber/20 text-vault-amber text-xs font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Popular
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-vault-text mb-2 group-hover:text-vault-accent transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-vault-text-secondary text-sm mb-4 line-clamp-2">
                      {tool.description}
                    </p>

                    {/* Features preview */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.features.slice(0, 2).map((feature, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-md bg-white/5 text-vault-text-secondary text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                      {tool.features.length > 2 && (
                        <span className="px-2 py-1 rounded-md bg-white/5 text-vault-text-secondary text-xs">
                          +{tool.features.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div>
                        <span className="text-vault-accent font-mono font-medium">
                          {tool.price}
                        </span>
                        <span className="text-vault-text-secondary text-sm">
                          {tool.priceDetail}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-vault-accent fill-vault-accent" />
                          <span className="text-sm text-vault-text">{tool.rating}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-vault-text-secondary group-hover:text-vault-accent group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-vault-text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-vault-text mb-2">
                  No tools found
                </h3>
                <p className="text-vault-text-secondary mb-6">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all')
                    setSearchQuery('')
                  }}
                  className="btn-secondary"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
