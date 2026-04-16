import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Welcome to Aurelian Slate. I am your concierge. How may I assist you with your culinary journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          { role: 'user', parts: [{ text: `You are the "Aurelian Concierge", a sophisticated AI assistant for the luxury restaurant "Aurelian Slate". 
          Aurelian Slate is known for its obsidian-themed decor, gold accents, and avant-garde fusion cuisine.
          Menu highlights: Truffle-infused Obsidian Risotto, Gold-leaf Wagyu, Charcoal-smoked Lobster.
          Atmosphere: Intimate, high-end, 2026 futuristic luxury.
          User query: ${userMsg}` }] }
        ],
        config: {
          systemInstruction: "Keep responses elegant, concise, and helpful. Use a refined tone."
        }
      });

      const aiText = response.text || "I apologize, but I am momentarily unable to process your request. Please contact our staff directly.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the kitchen. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] glass rounded-2xl flex flex-col overflow-hidden shadow-2xl border-gold/20">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gold/10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="font-display text-gold text-sm tracking-widest uppercase">Aurelian Concierge</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.role === 'user' ? 'bg-gold text-obsidian' : 'bg-white/5 text-white/80 border border-white/10'
                }`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-xl">
                  <Loader2 className="animate-spin text-gold" size={18} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Inquire about our menu..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
            />
            <button 
              onClick={handleSend}
              className="bg-gold text-obsidian p-2 rounded-lg hover:bg-gold/80 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gold text-obsidian rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform magnetic"
        >
          <MessageSquare />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
