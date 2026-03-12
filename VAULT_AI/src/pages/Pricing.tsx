import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Check, Sparkles, Building2, ArrowRight, HelpCircle } from 'lucide-react'
import SEO from '../components/seo/SEO'
import ScrollReveal from '../components/animations/ScrollReveal'
import { bundles } from '../data/aiTools'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals getting started',
    price: { monthly: 0, yearly: 0 },
    features: [
      '1 AI tool active',
      'Basic support',
      'Community access',
      'Limited usage',
      'Email support',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Best for professionals and creators',
    price: { monthly: 12, yearly: 120 },
    features: [
      '5 AI tools active',
      'Priority support',
      'Usage analytics',
      'API access',
      'Custom integrations',
      'Team collaboration',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For teams and growing businesses',
    price: { monthly: 29, yearly: 290 },
    features: [
      'Unlimited AI tools',
      'SSO authentication',
      'Centralized billing',
      'Dedicated support',
      'Advanced analytics',
      'Custom contracts',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const faqItems = [
  {
    question: 'Can I switch plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, and at the next billing cycle for downgrades.',
  },
  {
    question: 'What happens if I exceed my tool limit?',
    answer: "You'll be notified when approaching your limit. You can either upgrade your plan or deactivate unused tools to add new ones.",
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 14-day money-back guarantee for all paid plans. No questions asked.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: "Absolutely. You can cancel your subscription at any time from your account settings. You'll retain access until the end of your billing period.",
  },
]

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    gsap.fromTo(
      '.pricing-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  return (
    <>
      <SEO
        title="Pricing Plans"
        description="Choose the perfect plan for your AI needs. Start free, upgrade when you're ready. Save up to 40% with yearly billing."
        canonical="https://aivault.io/pricing"
      />

      <div className="pt-24 pb-24">
        {/* Header */}
        <section className="w-full px-6 lg:px-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="pricing-content">
              <span className="eyebrow mb-4 block">Pricing</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-vault-text mb-4">
                Simple, transparent pricing
              </h1>
              <p className="text-vault-text-secondary text-lg max-w-2xl mx-auto mb-8">
                Start free and scale as you grow. No hidden fees, cancel anytime.
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-white/5">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    billingCycle === 'monthly'
                      ? 'bg-vault-accent text-white'
                      : 'text-vault-text-secondary hover:text-vault-text'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    billingCycle === 'yearly'
                      ? 'bg-vault-accent text-white'
                      : 'text-vault-text-secondary hover:text-vault-text'
                  }`}
                >
                  Yearly
                  <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-xs">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="w-full px-6 lg:px-12 mb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <ScrollReveal key={plan.id} delay={index * 100}>
                  <div
                    className={`glass-card p-8 flex flex-col h-full ${
                      plan.popular ? 'glow-border md:scale-105' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1.5 rounded-full bg-vault-accent text-white text-sm font-medium flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-2xl font-bold font-heading text-vault-text mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-vault-text-secondary text-sm">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold font-heading text-vault-text">
                          ${billingCycle === 'monthly' ? plan.price.monthly : Math.round(plan.price.yearly / 12)}
                        </span>
                        <span className="text-vault-text-secondary">/month</span>
                      </div>
                      {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                        <p className="text-sm text-vault-text-secondary mt-1">
                          ${plan.price.yearly} billed annually
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-vault-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-vault-accent" />
                          </div>
                          <span className="text-vault-text-secondary text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={plan.id === 'team' ? '/contact' : '/signup'}
                      className={`w-full py-3 rounded-full font-medium text-sm text-center transition-all duration-300 ${
                        plan.popular
                          ? 'btn-primary'
                          : 'btn-secondary'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Bundles */}
        <section id="bundles" className="w-full px-6 lg:px-12 mb-24">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="eyebrow mb-4 block">Bundles</span>
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-vault-text mb-4">
                  Save with curated bundles
                </h2>
                <p className="text-vault-text-secondary max-w-2xl mx-auto">
                  Get multiple AI tools together at a discounted price
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bundles.map((bundle, index) => (
                <ScrollReveal key={bundle.id} delay={index * 100}>
                  <div className={`glass-card p-6 ${bundle.featured ? 'glow-border' : ''}`}>
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
                    <Link
                      to="/signup"
                      className={`w-full block text-center py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
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
        </section>

        {/* Enterprise */}
        <section className="w-full px-6 lg:px-12 mb-24">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="glass-card-strong p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="w-8 h-8 text-vault-accent" />
                    <h3 className="text-2xl font-bold font-heading text-vault-text">
                      Enterprise
                    </h3>
                  </div>
                  <p className="text-vault-text-secondary mb-6">
                    Custom solutions for large organizations. Get dedicated support, 
                    custom contracts, and volume pricing.
                  </p>
                  <ul className="grid grid-cols-2 gap-3">
                    {['Custom contracts', 'Volume pricing', 'Dedicated support', 'SLA guarantee'].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-vault-text-secondary">
                        <Check className="w-4 h-4 text-vault-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/contact" className="btn-primary whitespace-nowrap">
                  Contact Sales
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="eyebrow mb-4 block">FAQ</span>
                <h2 className="text-3xl font-bold font-heading text-vault-text mb-4">
                  Common questions
                </h2>
              </div>
            </ScrollReveal>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <ScrollReveal key={index} delay={index * 50}>
                  <div className="glass-card">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full p-6 flex items-center justify-between text-left"
                    >
                      <span className="font-medium text-vault-text pr-4">{item.question}</span>
                      <HelpCircle className={`w-5 h-5 text-vault-text-secondary flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6">
                        <p className="text-vault-text-secondary">{item.answer}</p>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={200}>
              <div className="text-center mt-8">
                <p className="text-vault-text-secondary mb-4">
                  Still have questions?
                </p>
                <Link to="/contact" className="text-vault-accent hover:text-vault-amber transition-colors inline-flex items-center gap-2">
                  Contact us
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
