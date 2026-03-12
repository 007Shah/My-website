import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Sparkles, User, Loader2, RefreshCw } from 'lucide-react'
import { gsap } from 'gsap'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

const quickQuestions = [
  'What is AIVault?',
  'How do I purchase AI tools?',
  'What payment methods do you accept?',
  'How do I get support?',
  'What are the pricing plans?',
  'Is there a refund policy?',
]

const aiResponses: Record<string, string> = {
  'What is AIVault?':
    'AIVault is a premium AI Account Marketplace where you can discover, compare, and purchase access to the best AI tools and services. We offer verified accounts, secure transactions, and 24/7 support.',
  'How do I purchase AI tools?':
    'Purchasing is simple! Browse our catalog, select the AI tool you want, choose your plan, and complete the secure checkout. You\'ll receive instant access credentials after payment confirmation.',
  'What payment methods do you accept?':
    'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, cryptocurrency (Bitcoin, Ethereum), and bank transfers for enterprise customers.',
  'How do I get support?':
    'We offer multiple support channels: 24/7 live chat (for Pro/Team plans), email support with 24-hour response time, WhatsApp messaging, and our comprehensive knowledge base.',
  'What are the pricing plans?':
    'We offer Starter ($9/mo), Professional ($29/mo), and Team ($79/mo) plans. Each includes different features like priority support, API access, and collaboration tools. Visit our Pricing page for details.',
  'Is there a refund policy?':
    'Yes! We offer a 14-day money-back guarantee on all purchases. If you\'re not satisfied, contact our support team for a full refund, no questions asked.',
}

const defaultResponses = [
  "I'd be happy to help with that! Could you provide more details about your question?",
  "That's a great question! For the most accurate answer, I recommend checking our FAQ page or contacting our support team directly.",
  "I understand your inquiry. Let me connect you with a human agent who can better assist you with this specific request.",
  "Thanks for reaching out! This is something our support team specializes in. Would you like me to forward your question to them?",
]

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm AIVault's AI Assistant. I can help answer your questions about our services, pricing, and support. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        '.ai-chatbot-window',
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      )
    }
  }, [isOpen])

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Check for exact matches first
    for (const [question, answer] of Object.entries(aiResponses)) {
      if (lowerMessage.includes(question.toLowerCase().replace(/[?]/g, ''))) {
        return answer
      }
    }

    // Check for keyword matches
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('plan')) {
      return aiResponses['What are the pricing plans?']
    }
    if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('get')) {
      return aiResponses['How do I purchase AI tools?']
    }
    if (lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('crypto')) {
      return aiResponses['What payment methods do you accept?']
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('contact')) {
      return aiResponses['How do I get support?']
    }
    if (lowerMessage.includes('refund') || lowerMessage.includes('money back') || lowerMessage.includes('return')) {
      return aiResponses['Is there a refund policy?']
    }
    if (lowerMessage.includes('what') && lowerMessage.includes('aivault')) {
      return aiResponses['What is AIVault?']
    }

    // Return random default response
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const response = generateResponse(userMessage.content)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleQuickQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponses[question] || defaultResponses[0],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm AIVault's AI Assistant. I can help answer your questions about our services, pricing, and support. What would you like to know?",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="ai-chatbot">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full glass-card-strong p-4 flex items-center gap-4 hover:bg-white/[0.06] transition-all duration-300 group"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
          <Bot className="w-7 h-7 text-white relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Sparkles className="absolute top-1 right-1 w-3 h-3 text-white/70" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-lg font-semibold text-vault-text flex items-center gap-2">
            AI Support Assistant
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 text-xs">
              Online
            </span>
          </h3>
          <p className="text-vault-text-secondary text-sm">
            Get instant answers to your questions 24/7
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          {isOpen ? (
            <X className="w-5 h-5 text-vault-text-secondary" />
          ) : (
            <Send className="w-5 h-5 text-vault-accent" />
          )}
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chatbot-window mt-4 glass-card-strong overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-pink-600/20 p-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-vault-text font-semibold">AI Assistant</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-vault-text-secondary text-xs">Powered by AI</span>
                  </div>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-vault-text-secondary hover:text-vault-text"
                title="Clear chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="p-4 max-h-[400px] overflow-y-auto space-y-4 bg-vault-black/50"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-vault-accent to-vault-orange'
                      : 'bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-vault-accent/30 to-vault-orange/20 rounded-tr-sm'
                      : 'bg-white/5 rounded-tl-sm'
                  }`}
                >
                  <p className="text-vault-text text-sm leading-relaxed">{message.content}</p>
                  <span className="text-vault-text-secondary/60 text-xs mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Loader2 className="w-4 h-4 text-vault-accent animate-spin" />
                    <span className="text-vault-text-secondary text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="p-3 border-t border-white/5 bg-vault-black-secondary/50">
            <p className="text-vault-text-secondary text-xs mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isTyping}
                  className="px-3 py-1.5 rounded-full text-xs bg-gradient-to-r from-vault-accent/10 to-vault-amber/10 border border-vault-accent/20 text-vault-text hover:from-vault-accent/20 hover:to-vault-amber/20 transition-all duration-300 disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5 bg-vault-black-secondary">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isTyping}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-vault-text placeholder:text-vault-text-secondary/50 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-center text-vault-text-secondary/40 text-xs mt-2">
              AI responses are generated automatically. For complex issues, contact human support.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
