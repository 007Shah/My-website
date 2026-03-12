import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Home, Search } from 'lucide-react'
import SEO from '../components/seo/SEO'

export default function NotFound() {
  useEffect(() => {
    gsap.fromTo(
      '.notfound-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        noindex={true}
      />

      <div className="pt-24 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="notfound-content">
              {/* 404 Animation */}
              <div className="relative mb-8">
                <div className="text-9xl font-bold font-heading text-vault-accent/20">
                  404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold font-heading text-vault-accent">
                    404
                  </div>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold font-heading text-vault-text mb-4">
                Page not found
              </h1>
              <p className="text-vault-text-secondary text-lg mb-8 max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back on track.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Go home
                </Link>
                <Link to="/browse" className="btn-secondary inline-flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" />
                  Browse tools
                </Link>
              </div>

              {/* Quick links */}
              <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-vault-text-secondary text-sm mb-4">
                  Popular pages
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    to="/browse"
                    className="px-4 py-2 rounded-full bg-white/5 text-vault-text-secondary hover:bg-white/10 hover:text-vault-text transition-all text-sm"
                  >
                    Browse AI Tools
                  </Link>
                  <Link
                    to="/pricing"
                    className="px-4 py-2 rounded-full bg-white/5 text-vault-text-secondary hover:bg-white/10 hover:text-vault-text transition-all text-sm"
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/faq"
                    className="px-4 py-2 rounded-full bg-white/5 text-vault-text-secondary hover:bg-white/10 hover:text-vault-text transition-all text-sm"
                  >
                    FAQ
                  </Link>
                  <Link
                    to="/contact"
                    className="px-4 py-2 rounded-full bg-white/5 text-vault-text-secondary hover:bg-white/10 hover:text-vault-text transition-all text-sm"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
