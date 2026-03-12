import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowLeft, Calendar, Clock, Tag, Twitter, Linkedin, Facebook } from 'lucide-react'
import SEO from '../components/seo/SEO'
import ScrollReveal from '../components/animations/ScrollReveal'

const blogPosts = [
  {
    slug: 'best-ai-tools-2024',
    title: 'The Best AI Tools to Use in 2024',
    excerpt: 'Discover the most powerful AI tools that are transforming how we work, create, and innovate in 2024.',
    content: `
      <p>The AI landscape has evolved dramatically over the past year. From powerful language models to creative tools that can generate images, videos, and music, there's never been a better time to leverage AI in your workflow.</p>
      
      <h2>Language Models</h2>
      <p>ChatGPT, Claude, and Gemini have become indispensable tools for professionals across industries. Each has its strengths:</p>
      <ul>
        <li><strong>ChatGPT</strong> - Best for general-purpose tasks and coding</li>
        <li><strong>Claude</strong> - Excels at long-form content and analysis</li>
        <li><strong>Gemini</strong> - Strong multimodal capabilities and Google integration</li>
      </ul>
      
      <h2>Image Generation</h2>
      <p>Midjourney continues to lead in artistic quality, while DALL-E 3 offers better prompt understanding. Stable Diffusion remains the go-to for those who want complete control and privacy.</p>
      
      <h2>Video & Audio</h2>
      <p>Runway's Gen-3 has revolutionized video creation, while ElevenLabs sets the standard for voice synthesis. Suno and Udio are making waves in AI music generation.</p>
      
      <h2>Conclusion</h2>
      <p>The key is finding the right combination of tools for your specific needs. With AIVault, you can explore them all without managing dozens of subscriptions.</p>
    `,
    category: 'Guide',
    readTime: '8 min read',
    date: 'Mar 1, 2024',
    author: 'Alex Chen',
    authorRole: 'CEO & Co-Founder',
  },
  {
    slug: 'chatgpt-vs-claude',
    title: 'ChatGPT vs Claude: Which AI Assistant is Right for You?',
    excerpt: 'A comprehensive comparison of the two leading AI assistants to help you make the right choice.',
    content: `
      <p>Choosing between ChatGPT and Claude can be challenging. Both are incredibly capable, but they have different strengths and weaknesses.</p>
      
      <h2>Capabilities</h2>
      <p>ChatGPT, powered by GPT-4, excels at coding tasks and has a broader knowledge base. Claude, with its massive context window, is better at analyzing long documents and maintaining context over extended conversations.</p>
      
      <h2>Use Cases</h2>
      <p>For software development and technical tasks, ChatGPT often performs better. For research, writing, and document analysis, Claude's larger context window gives it a significant advantage.</p>
      
      <h2>Pricing</h2>
      <p>Both offer similar pricing at $20/month for their premium tiers. However, Claude's free tier is more generous with usage limits.</p>
    `,
    category: 'Comparison',
    readTime: '6 min read',
    date: 'Feb 28, 2024',
    author: 'Sarah Miller',
    authorRole: 'CTO & Co-Founder',
  },
  {
    slug: 'ai-image-generation-guide',
    title: 'The Complete Guide to AI Image Generation',
    excerpt: 'Everything you need to know about creating stunning images with AI, from Midjourney to DALL-E.',
    content: `
      <p>AI image generation has come a long way. Today's tools can create photorealistic images, artistic masterpieces, and everything in between.</p>
      
      <h2>Getting Started</h2>
      <p>The key to great AI images is prompt engineering. Be specific about what you want, including style, lighting, composition, and mood.</p>
      
      <h2>Popular Tools</h2>
      <p>Midjourney leads in artistic quality, DALL-E 3 excels at following complex instructions, and Stable Diffusion offers unlimited customization.</p>
    `,
    category: 'Tutorial',
    readTime: '12 min read',
    date: 'Feb 25, 2024',
    author: 'David Park',
    authorRole: 'Head of Design',
  },
]

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const post = blogPosts.find((p) => p.slug === slug)

  useEffect(() => {
    if (!post) {
      navigate('/blog')
      return
    }

    gsap.fromTo(
      '.blog-post-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [post, navigate])

  if (!post) return null

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2)

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`https://aivault.io/blog/${post.slug}`}
        ogType="article"
      />

      <div className="pt-24 pb-24">
        {/* Back button */}
        <div className="w-full px-6 lg:px-12 mb-8">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-vault-text-secondary hover:text-vault-text transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to blog
            </Link>
          </div>
        </div>

        {/* Article */}
        <article className="blog-post-content w-full px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-vault-accent/20 text-vault-accent text-sm font-medium">
                  {post.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-vault-text mb-6">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-vault-text-secondary">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {post.category}
                </span>
              </div>
            </header>

            {/* Featured Image */}
            <div className="aspect-video bg-gradient-to-br from-vault-accent/30 to-vault-amber/20 rounded-2xl flex items-center justify-center mb-12">
              <div className="text-8xl font-bold text-vault-accent/30">
                {post.title.charAt(0)}
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-invert prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author */}
            <div className="glass-card p-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-vault-accent/20 flex items-center justify-center text-xl font-bold text-vault-accent">
                  {post.author.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-vault-text">{post.author}</div>
                  <div className="text-vault-text-secondary text-sm">{post.authorRole}</div>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="flex items-center gap-4 mb-12">
              <span className="text-vault-text-secondary">Share:</span>
              <button className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-vault-text-secondary hover:text-vault-accent hover:bg-vault-accent/10 transition-all">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-vault-text-secondary hover:text-vault-accent hover:bg-vault-accent/10 transition-all">
                <Linkedin className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-vault-text-secondary hover:text-vault-accent hover:bg-vault-accent/10 transition-all">
                <Facebook className="w-5 h-5" />
              </button>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="w-full px-6 lg:px-12 mt-16">
            <div className="max-w-3xl mx-auto">
              <ScrollReveal>
                <h2 className="text-2xl font-bold font-heading text-vault-text mb-6">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      to={`/blog/${relatedPost.slug}`}
                      className="glass-card p-6 block hover:bg-white/[0.06] transition-all duration-300"
                    >
                      <span className="text-vault-accent text-sm">{relatedPost.category}</span>
                      <h3 className="text-lg font-semibold text-vault-text mt-2 mb-2 hover:text-vault-accent transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-vault-text-secondary text-sm line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
