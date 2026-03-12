import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useEffect } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import WhatsAppWidget from './components/WhatsAppWidget'

// Pages
import Home from './pages/Home'
import Browse from './pages/Browse'
import ToolDetail from './pages/ToolDetail'
import Compare from './pages/Compare'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import NotFound from './pages/NotFound'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="relative min-h-screen bg-vault-black">
          {/* Grain overlay */}
          <div className="grain-overlay" />

          {/* Navigation */}
          <Navigation />

          {/* Main content */}
          <main className="relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/browse/:toolId" element={<ToolDetail />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* WhatsApp Widget - Available on all pages */}
          <WhatsAppWidget />
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
