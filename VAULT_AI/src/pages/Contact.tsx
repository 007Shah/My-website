import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { Mail, MapPin, Phone, Send, Check, MessageSquare, Clock, HelpCircle } from 'lucide-react'
import SEO from '../components/seo/SEO'
import ScrollReveal from '../components/animations/ScrollReveal'
import AIChatbot from '../components/AIChatbot'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@aivault.io',
    description: "We'll respond within 24 hours",
    href: 'mailto:hello@aivault.io',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+1 (555) 123-4567',
    description: 'Mon-Fri, 9am-6pm PST',
    href: 'tel:+1-555-123-4567',
  },
  {
    icon: MapPin,
    title: 'Office',
    value: 'San Francisco, CA',
    description: 'Come visit us',
    href: '#',
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      '.contact-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with the AIVault team. We're here to help with any questions or concerns."
        canonical="https://aivault.io/contact"
      />

      <div className="pt-24 pb-24">
        {/* Header */}
        <section className="w-full px-6 lg:px-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="contact-content">
              <span className="eyebrow mb-4 block">Contact</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-vault-text mb-4">
                Get in touch
              </h1>
              <p className="text-vault-text-secondary text-lg max-w-2xl mx-auto">
                Have a question or need help? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="w-full px-6 lg:px-12 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <ScrollReveal key={method.title} delay={index * 100}>
                    <a
                      href={method.href}
                      className="glass-card p-6 text-center hover:bg-white/[0.06] transition-all duration-300 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-vault-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-vault-accent" />
                      </div>
                      <h3 className="text-lg font-semibold text-vault-text mb-1">
                        {method.title}
                      </h3>
                      <p className="text-vault-text font-medium mb-1">{method.value}</p>
                      <p className="text-vault-text-secondary text-sm">{method.description}</p>
                    </a>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="w-full px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Form */}
              <ScrollReveal className="lg:col-span-3">
                <div className="glass-card-strong p-8">
                  <h2 className="text-2xl font-bold font-heading text-vault-text mb-6">
                    Send us a message
                  </h2>

                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-vault-text mb-2">
                        Message sent!
                      </h3>
                      <p className="text-vault-text-secondary">
                        We'll get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-vault-text mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                            className="glass-input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-vault-text mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@company.com"
                            required
                            className="glass-input w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-vault-text mb-2">
                          Subject
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="glass-input w-full"
                        >
                          <option value="">Select a topic</option>
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="sales">Sales</option>
                          <option value="partnerships">Partnerships</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-vault-text mb-2">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="How can we help?"
                          rows={5}
                          required
                          className="glass-input w-full resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </ScrollReveal>

              {/* Info */}
              <ScrollReveal className="lg:col-span-2" delay={100}>
                <div className="space-y-6">
                  {/* AI Chatbot */}
                  <AIChatbot />

                  <div className="glass-card p-6 border-gradient">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vault-accent to-vault-orange flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-vault-text">
                          Live Chat
                        </h3>
                        <span className="text-xs text-vault-accent">Human Support</span>
                      </div>
                    </div>
                    <p className="text-vault-text-secondary text-sm mb-4">
                      Get instant help from our support team through live chat.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-500">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Available now
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vault-amber to-orange-500 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-vault-text">
                        Response Time
                      </h3>
                    </div>
                    <p className="text-vault-text-secondary text-sm">
                      We typically respond within 24 hours. For Pro and Team plans,
                      priority support responds within 4 hours.
                    </p>
                  </div>

                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-vault-text">
                        Knowledge Base
                      </h3>
                    </div>
                    <p className="text-vault-text-secondary text-sm">
                      Browse our comprehensive documentation and tutorials for
                      quick answers to common questions.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
