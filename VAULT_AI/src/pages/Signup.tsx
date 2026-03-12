import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Github, Chrome, Zap, Check } from 'lucide-react'
import SEO from '../components/seo/SEO'

export default function Signup() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      '.signup-content',
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
    setIsSuccess(true)

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  if (isSuccess) {
    return (
      <>
        <SEO title="Account Created" noindex={true} />
        <div className="pt-24 pb-24 min-h-screen flex items-center justify-center">
          <div className="w-full px-6 lg:px-12">
            <div className="max-w-md mx-auto">
              <div className="glass-card-strong p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-vault-text mb-2">
                  Account created!
                </h2>
                <p className="text-vault-text-secondary">
                  Welcome to AIVault. Redirecting to login...
                </p>
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
        title="Create Account"
        description="Create your free AIVault account and start exploring AI tools today."
        canonical="https://aivault.io/signup"
        noindex={true}
      />

      <div className="pt-24 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-md mx-auto">
            <div className="signup-content glass-card-strong p-8 md:p-10">
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
                  Create your account
                </h1>
                <p className="text-vault-text-secondary">
                  Start your AI journey today
                </p>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-vault-text hover:bg-white/10 transition-colors"
                >
                  <Chrome className="w-5 h-5" />
                  <span className="text-sm">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-vault-text hover:bg-white/10 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span className="text-sm">GitHub</span>
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-vault-black-secondary text-vault-text-secondary text-sm">
                    Or sign up with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-vault-text mb-2">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-text-secondary" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="glass-input pl-12 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-vault-text mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-text-secondary" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      required
                      className="glass-input pl-12 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-vault-text mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-text-secondary" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="glass-input pl-12 pr-12 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-vault-text-secondary hover:text-vault-text transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-vault-text-secondary mt-2">
                    Must be at least 8 characters with a number and symbol
                  </p>
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-vault-accent focus:ring-vault-accent"
                    />
                    <span className="text-sm text-vault-text-secondary">
                      I agree to the{' '}
                      <Link to="#" className="text-vault-accent hover:text-vault-amber transition-colors">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="#" className="text-vault-accent hover:text-vault-amber transition-colors">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !formData.agreeTerms}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Login link */}
              <div className="mt-6 text-center">
                <span className="text-vault-text-secondary">Already have an account? </span>
                <Link
                  to="/login"
                  className="text-vault-accent hover:text-vault-amber transition-colors font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
