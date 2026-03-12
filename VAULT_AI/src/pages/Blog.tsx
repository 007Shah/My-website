import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Search, Calendar, Clock, Tag } from 'lucide-react'
import SEO from '../components/seo/SEO'
import ScrollReveal from '../components/animations/ScrollReveal'

const blogPosts = [
  {
    slug: 'best-ai-tools-2024',
    title: 'The Best AI Tools to Use in 2024',
    excerpt: 'Discover the most powerful AI tools that are transforming how we work, create, and innovate in 2024.',
    category: 'Guide',
    readTime: '8 min read',
    date: 'Mar 1, 2024',
    featured: true,
  },
  {
    slug: 'chatgpt-vs-claude',
    title: 'ChatGPT vs Claude: Which AI Assistant is Right for You?',
    excerpt: 'A comprehensive comparison of the two leading AI assistants to help you make the right choice.',
    category: 'Comparison',
    readTime: '6 min read',
    date: 'Feb 28, 2024',
    featured: false,
  },
  {
    slug: 'ai-image-generation-guide',
    title: 'The Complete Guide to AI Image Generation',
    excerpt: 'Everything you need to know about creating stunning images with AI, from Midjourney to DALL-E.',
    category: 'Tutorial',
    readTime: '12 min read',
    date: 'Feb 25, 2024',
    featured: false,
  },
  {
    slug: 'saving-money-ai-subscriptions',
    title: 'How to Save Money on AI Subscriptions',
    excerpt: 'Smart strategies to reduce your AI tool costs without sacrificing functionality.',
    category: 'Tips',
    readTime: '5 min read',
    date: 'Feb 20, 2024',
    featured: false,
  },
  {
    slug: 'future-of-ai-work',
    title: 'The Future of AI in the Workplace',
    excerpt: 'How AI is reshaping jobs, productivity, and the future of work as we know it.',
    category: 'Insights',
    readTime: '10 min read',
    date: 'Feb 15, 2024',
    featured: false,
  },
  {
    slug: 'getting-started-midjourney',
    title: "Getting Started with Midjourney: A Beginner's Guide",
    excerpt: 'Learn how to create stunning AI-generated art with Midjourney, from prompts to parameters.',
    category: 'Tutorial',
    readTime: '8 min read',
    date: 'Feb 10, 2024',
    featured: false,
  },
]

const categories = ['All', 'Guide', 'Comparison', 'Tutorial', 'Tips', 'Insights']

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    gsap.fromTo(
      '.blog-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured || activeCategory !== 'All')

  return (
    <>
      <SEO
        title="Blog"
        description="Latest insights, guides, and tutorials about AI tools. Learn how to get the most out of your AI subscriptions."
        canonical="https://aivault.io/blog"
      />

      <div className="pt-24 pb-24">
        {/* Header */}
        <section className="w-full px-6 lg:px-12 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="blog-content">
              <span className="eyebrow mb-4 block">Blog</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-vault-text mb-4">
                Insights & Guides
              </h1>
              <p className="text-vault-text-secondary text-lg max-w-2xl">
                Learn how to get the most out of your AI tools with our expert guides, 
                comparisons, and industry insights.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="w-full px-6 lg:px-12 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-text-secondary" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input pl-12 w-full"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-vault-accent text-white'
                        : 'bg-white/5 text-vault-text-secondary hover:bg-white/10 hover:text-vault-text'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && activeCategory === 'All' && !searchQuery && (
          <section className="w-full px-6 lg:px-12 mb-12">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="glass-card-strong overflow-hidden block group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-vault-accent/30 to-vault-amber/20 flex items-center justify-center">
                      <div className="text-6xl font-bold text-vault-accent/30">
                        {featuredPost.title.charAt(0)}
                      </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-vault-accent/20 text-vault-accent text-sm font-medium">
                          Featured
                        </span>
                        <span className="text-vault-text-secondary text-sm">
                          {featuredPost.category}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold font-heading text-vault-text mb-4 group-hover:text-vault-accent transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-vault-text-secondary mb-6">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-vault-text-secondary">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {featuredPost.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* Posts Grid */}
        <section className="w-full px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <ScrollReveal key={post.slug}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="glass-card overflow-hidden block group hover:bg-white/[0.06] transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="aspect-video bg-gradient-to-br from-vault-accent/20 to-vault-amber/10 flex items-center justify-center">
                      <div className="text-4xl font-bold text-vault-accent/30">
                        {post.title.charAt(0)}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-vault-accent" />
                        <span className="text-vault-accent text-sm">{post.category}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-vault-text mb-3 group-hover:text-vault-accent transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-vault-text-secondary text-sm mb-4 line-clamp-2 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-vault-text-secondary">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            {regularPosts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-vault-text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-vault-text mb-2">
                  No articles found
                </h3>
                <p className="text-vault-text-secondary mb-6">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('All')
                    setSearchQuery('')
                  }}
                  className="btn-secondary"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="w-full px-6 lg:px-12 mt-24">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="glass-card-strong p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold font-heading text-vault-text mb-4">
                  Stay updated
                </h2>
                <p className="text-vault-text-secondary mb-6 max-w-xl mx-auto">
                  Get the latest AI tool reviews, guides, and exclusive deals delivered to your inbox.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="glass-input flex-grow"
                  />
                  <button type="submit" className="btn-primary whitespace-nowrap">
                    Subscribe
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </>
  )
}
