import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { Eye, EyeOff, Lock, Mail, ArrowRight, Github, Chrome, Zap } from 'lucide-react'
import SEO from '../components/seo/SEO'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    gsap.fromTo(
      '.login-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock validation
    if (formData.email === 'demo@aivault.io' && formData.password === 'demo') {
      navigate('/')
    } else {
      setError('Invalid email or password. Try demo@aivault.io / demo')
    }

    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <>
      <SEO
        title="Login"
        description="Sign in to your AIVault account to manage your AI tools and subscriptions."
        canonical="https://aivault.io/login"
        noindex={true}
      />

      <div className="pt-24 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-md mx-auto">
            <div className="login-content glass-card-strong p-8 md:p-10">
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
                  Welcome back
                </h1>
                <p className="text-vault-text-secondary">
                  Sign in to access your dashboard
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {error}
                </div>
              )}

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
                    Or continue with email
                  </span>
                </div>
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
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-vault-accent focus:ring-vault-accent"
                    />
                    <span className="text-sm text-vault-text-secondary">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-vault-accent hover:text-vault-amber transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign up link */}
              <div className="mt-6 text-center">
                <span className="text-vault-text-secondary">Don't have an account? </span>
                <Link
                  to="/signup"
                  className="text-vault-accent hover:text-vault-amber transition-colors font-medium"
                >
                  Sign up
                </Link>
              </div>

              {/* Demo hint */}
              <div className="mt-6 p-4 rounded-lg bg-vault-accent/10 border border-vault-accent/20 text-center">
                <p className="text-sm text-vault-text-secondary">
                  Demo: <span className="text-vault-accent">demo@aivault.io</span> / <span className="text-vault-accent">demo</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
