import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ChevronDown, Search, MessageCircle, ArrowRight } from 'lucide-react'
import SEO from '../components/seo/SEO'
import ScrollReveal from '../components/animations/ScrollReveal'

const faqCategories = [
  {
    name: 'Getting Started',
    items: [
      {
        question: 'What is AIVault?',
        answer: "AIVault is a unified marketplace for AI tools. Instead of managing multiple subscriptions across different platforms, you can browse, compare, and subscribe to the best AI tools—all from one dashboard. We offer individual tool subscriptions as well as curated bundles that save you up to 40%.",
      },
      {
        question: 'How do I get started?',
        answer: "Getting started is easy! Simply create a free account, browse our catalog of 40+ AI tools, and choose the ones that fit your needs. You can start with our free Starter plan and upgrade anytime.",
      },
      {
        question: 'Is there a free trial?',
        answer: "Yes! Our Starter plan is completely free and includes access to one AI tool with basic features. You can also try Pro features with our 14-day free trial—no credit card required.",
      },
    ],
  },
  {
    name: 'Pricing & Billing',
    items: [
      {
        question: 'How does pricing work?',
        answer: "We offer three main plans: Starter (free), Pro ($12/month), and Team ($29/month). You can also save money with our curated bundles. All paid plans include access to multiple AI tools at a discounted rate compared to individual subscriptions.",
      },
      {
        question: 'Can I switch plans?',
        answer: "Absolutely! You can upgrade or downgrade your plan at any time. When you upgrade, you get immediate access to new features. When you downgrade, changes take effect at the start of your next billing cycle.",
      },
      {
        question: 'Do you offer refunds?',
        answer: "Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team within 14 days for a full refund—no questions asked.",
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual enterprise plans.',
      },
    ],
  },
  {
    name: 'Tools & Features',
    items: [
      {
        question: 'Which AI tools are available?',
        answer: "We offer 40+ AI tools across categories including text (ChatGPT, Claude, Gemini), image (Midjourney, DALL-E, Stable Diffusion), audio (ElevenLabs, Suno), video (Runway), and code (GitHub Copilot). We're constantly adding new tools.",
      },
      {
        question: 'How do I activate a tool?',
        answer: "Once you subscribe to a plan, you can activate tools directly from your dashboard. Simply click \"Activate\" on any tool, and you'll receive credentials and setup instructions within minutes.",
      },
      {
        question: 'Can I use multiple tools at once?',
        answer: 'Yes! Depending on your plan, you can have multiple tools active simultaneously. Starter allows 1 tool, Pro allows 5 tools, and Team offers unlimited active tools.',
      },
    ],
  },
  {
    name: 'Account & Security',
    items: [
      {
        question: 'Is my data secure?',
        answer: "Absolutely. We use enterprise-grade encryption for all data transmission and storage. We're SOC 2 Type II certified and GDPR compliant. Your API keys and credentials are encrypted at rest.",
      },
      {
        question: 'Can I cancel anytime?',
        answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.",
      },
      {
        question: 'Do you offer SSO?',
        answer: 'SSO is available on our Team plan. We support SAML 2.0 and integrate with major identity providers including Okta, Azure AD, and Google Workspace.',
      },
    ],
  },
]

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    gsap.fromTo(
      '.faq-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0)

  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about AIVault, pricing, features, and more."
        canonical="https://aivault.io/faq"
      />

      <div className="pt-24 pb-24">
        {/* Header */}
        <section className="w-full px-6 lg:px-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="faq-content">
              <span className="eyebrow mb-4 block">FAQ</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-vault-text mb-4">
                How can we help?
              </h1>
              <p className="text-vault-text-secondary text-lg max-w-2xl mx-auto mb-8">
                Find answers to common questions about AIVault
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-text-secondary" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input pl-12 w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="w-full px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            {filteredCategories.map((category, categoryIndex) => (
              <ScrollReveal key={category.name} delay={categoryIndex * 100}>
                <div className="mb-8">
                  <h2 className="text-xl font-bold font-heading text-vault-text mb-4">
                    {category.name}
                  </h2>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => {
                      const key = `${category.name}-${itemIndex}`
                      const isOpen = openItems[key]

                      return (
                        <div key={key} className="glass-card overflow-hidden">
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full p-6 flex items-center justify-between text-left"
                          >
                            <span className="font-medium text-vault-text pr-4">
                              {item.question}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-vault-text-secondary flex-shrink-0 transition-transform duration-300 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              isOpen ? 'max-h-96' : 'max-h-0'
                            }`}
                          >
                            <div className="px-6 pb-6">
                              <p className="text-vault-text-secondary leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </ScrollReveal>
            ))}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-vault-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-vault-text mb-2">
                  No results found
                </h3>
                <p className="text-vault-text-secondary mb-6">
                  Try a different search term or browse all categories
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn-secondary"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="w-full px-6 lg:px-12 mt-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="glass-card-strong p-8 text-center">
                <MessageCircle className="w-12 h-12 text-vault-accent mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-heading text-vault-text mb-2">
                  Still have questions?
                </h2>
                <p className="text-vault-text-secondary mb-6">
                  Can't find what you're looking for? Our team is here to help.
                </p>
                <Link
                  to="/contact"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Contact Support
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </>
  )
}
