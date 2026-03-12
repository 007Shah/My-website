import { Link } from 'react-router-dom'
import { Zap, Twitter, Github, Linkedin, Instagram, Youtube } from 'lucide-react'

const footerLinks = {
  product: [
    { label: 'Browse AI Tools', href: '/browse' },
    { label: 'Compare Plans', href: '/compare' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Bundles', href: '/pricing#bundles' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/about#careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press Kit', href: '#' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Support', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'GDPR', href: '#' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/aivault', label: 'Twitter' },
  { icon: Github, href: 'https://github.com/aivault', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/company/aivault', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/aivault', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/aivault', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="relative w-full bg-vault-black border-t border-white/5">
      {/* Newsletter Section */}
      <div className="w-full px-6 lg:px-12 py-16 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold font-heading text-vault-text mb-2">
              Stay in the loop
            </h3>
            <p className="text-vault-text-secondary">
              Get weekly updates on new AI tools and exclusive deals.
            </p>
          </div>
          <form className="flex gap-3 w-full lg:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="glass-input flex-grow lg:w-64"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="w-full px-6 lg:px-12 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vault-accent to-vault-orange flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold font-heading text-vault-text">
                  AIVault
                </span>
              </Link>
              <p className="text-vault-text-secondary text-sm mb-6 max-w-xs">
                One vault. Every AI. Compare, subscribe, and manage the best generative tools—without the tab chaos.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-vault-text-secondary hover:text-vault-accent hover:bg-vault-accent/10 transition-all duration-300"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-vault-text uppercase tracking-wider mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-vault-text-secondary hover:text-vault-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-vault-text uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-vault-text-secondary hover:text-vault-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-vault-text uppercase tracking-wider mb-4">
                Resources
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-vault-text-secondary hover:text-vault-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-vault-text uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-vault-text-secondary hover:text-vault-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-vault-text-secondary text-sm">
              © {new Date().getFullYear()} AIVault. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="#" className="text-sm text-vault-text-secondary hover:text-vault-accent transition-colors">
                Privacy
              </Link>
              <Link to="#" className="text-sm text-vault-text-secondary hover:text-vault-accent transition-colors">
                Terms
              </Link>
              <Link to="#" className="text-sm text-vault-text-secondary hover:text-vault-accent transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
