import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, Phone } from 'lucide-react'
import { gsap } from 'gsap'

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [hasNotification, setHasNotification] = useState(true)

  useEffect(() => {
    // Animate the widget on mount
    gsap.fromTo(
      '.whatsapp-widget',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 2 }
    )

    // Hide notification after 5 seconds
    const timer = setTimeout(() => {
      setHasNotification(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        '.whatsapp-chat',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [isOpen])

  const handleSend = () => {
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message)
      window.open(`https://wa.me/15551234567?text=${encodedMessage}`, '_blank')
      setMessage('')
      setIsOpen(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickReplies = [
    'I need help with my order',
    'What AI tools do you offer?',
    'Pricing information',
    'Technical support',
  ]

  return (
    <div className="whatsapp-widget fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="whatsapp-chat absolute bottom-20 right-0 w-80 sm:w-96">
          <div className="glass-card-strong overflow-hidden border-gradient">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">AIVault Support</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-white/80 text-sm">Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="p-4 bg-[#0a0a0a]/80 min-h-[200px] max-h-[300px] overflow-y-auto">
              {/* Welcome Message */}
              <div className="flex items-start gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <p className="text-vault-text text-sm">
                    Hello! Welcome to AIVault. How can we help you today?
                  </p>
                  <span className="text-vault-text-secondary text-xs mt-1 block">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Quick Replies */}
              <div className="space-y-2 ml-10">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setMessage(reply)
                    }}
                    className="block w-full text-left px-4 py-2 rounded-xl bg-gradient-to-r from-vault-accent/20 to-vault-amber/10 border border-vault-accent/30 text-vault-text text-sm hover:from-vault-accent/30 hover:to-vault-amber/20 transition-all duration-300"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-vault-black-secondary border-t border-white/5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-vault-text placeholder:text-vault-text-secondary/50 focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/30 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] flex items-center justify-center hover:shadow-lg hover:shadow-[#25D366]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <a
                  href="tel:+15551234567"
                  className="flex items-center gap-1.5 text-vault-text-secondary text-xs hover:text-[#25D366] transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  Call us
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setHasNotification(false)
        }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-110 transition-all duration-300 group"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        )}

        {/* Notification Badge */}
        {hasNotification && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-vault-accent to-vault-orange text-white text-xs font-bold flex items-center justify-center animate-bounce">
            1
          </span>
        )}

        {/* Ripple Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-16 right-0 whitespace-nowrap">
          <div className="glass-card px-3 py-1.5 text-sm text-vault-text">
            Chat with us
          </div>
        </div>
      )}
    </div>
  )
}
