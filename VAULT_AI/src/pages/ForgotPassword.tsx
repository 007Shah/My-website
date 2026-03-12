import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Mail, ArrowLeft, ArrowRight, Check, Zap } from 'lucide-react'
import SEO from '../components/seo/SEO'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      '.forgot-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <>
        <SEO title="Reset Password" noindex={true} />
        <div className="pt-24 pb-24 min-h-screen flex items-center justify-center">
          <div className="w-full px-6 lg:px-12">
            <div className="max-w-md mx-auto">
              <div className="glass-card-strong p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold font-heading text-vault-text mb-2">
                  Check your email
                </h1>
                <p className="text-vault-text-secondary mb-6">
                  We've sent a password reset link to <span className="text-vault-text">{email}</span>
                </p>
                <Link to="/login" className="btn-secondary inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Reset Password"
        description="Reset your AIVault account password."
        canonical="https://aivault.io/forgot-password"
        noindex={true}
      />

      <div className="pt-24 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-md mx-auto">
            <div className="forgot-content glass-card-strong p-8 md:p-10">
              {/* Logo */}
              <div className="text-center mb-8">
                <Link to="/" className="inline-flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vault-accent to-vault-orange flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold font-heading text-vault-text">
                    AIVault
                  </span>
                </Link>
                <h1 className="text-2xl font-bold font-heading text-vault-text mb-2">
                  Reset your password
                </h1>
                <p className="text-vault-text-secondary">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-vault-text mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-text-secondary" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="glass-input pl-12 w-full"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Back to login */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-vault-text-secondary hover:text-vault-text transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
