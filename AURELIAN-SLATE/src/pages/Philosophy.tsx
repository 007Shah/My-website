import React, { useEffect, useRef } from 'react';
import { animate as anime, createDrawable } from 'animejs';

const Philosophy: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const drawable = createDrawable('.signature-path', 0, 0);
          anime(drawable, {
            draw: '0 1',
            easing: 'easeInOutSine',
            duration: 2000,
            delay: 500
          });
        }
      });
    }, { threshold: 0.5 });

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-20 space-y-40 px-6">
      {/* Philosophy Hero */}
      <div className="relative w-full h-[60vh] rounded-[4rem] overflow-hidden reveal group">
        <img 
          src="https://picsum.photos/seed/luxury-restaurant-interior-ambiance/1920/1080" 
          alt="Philosophy Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-[3s]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/20 via-obsidian/60 to-obsidian" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6">
          <h2 className="text-gold text-sm uppercase tracking-[1em]">The Aurelian Way</h2>
          <h1 className="text-6xl md:text-8xl font-display font-bold gold-gradient">BEYOND DINING</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
        <div className="space-y-12 reveal">
          <div className="space-y-4">
            <h2 className="text-gold text-sm uppercase tracking-[0.8em]">The Vision</h2>
            <h1 className="text-7xl font-display font-bold leading-tight tracking-tight">
              CRAFTING THE <br /> <span className="gold-gradient">FUTURE</span> OF TASTE
            </h1>
          </div>
          <div className="h-[1px] w-24 bg-gold/30" />
          <p className="text-white/50 leading-relaxed text-xl font-light">
            At Aurelian Slate, we believe that dining is not just a meal, but a kinetic experience. Our philosophy is rooted in the contrast between the raw, unyielding nature of obsidian and the refined, ethereal glow of gold.
          </p>
          <p className="text-white/50 leading-relaxed text-xl font-light">
            Every dish is a dialogue between ancient techniques and 2026 innovation. We source ingredients that tell a story, prepared with a precision that borders on the scientific, yet served with a soul that is purely artistic.
          </p>
          
          <div className="pt-12 space-y-6">
            <p className="text-gold font-display italic text-2xl">Chef de Cuisine</p>
            <svg 
              ref={svgRef}
              viewBox="0 0 400 100" 
              className="w-80 h-auto opacity-80"
            >
              <path 
                className="signature-path"
                d="M20,50 C50,20 80,80 110,50 C140,20 170,80 200,50 C230,20 260,80 290,50 C320,20 350,80 380,50"
                fill="none" 
                stroke="#D4AF37" 
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="relative reveal group">
          <div className="aspect-[3/4] rounded-[4rem] overflow-hidden glass border-none floating">
            <img 
              src="https://picsum.photos/seed/luxury-chef-portrait/800/1200" 
              alt="Chef" 
              className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-16 -left-16 w-80 h-80 glass-gold rounded-[3rem] p-12 flex flex-col justify-center space-y-4 backdrop-blur-3xl border border-gold/20">
            <h3 className="text-gold font-display text-6xl font-bold">98%</h3>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] leading-loose">Sustainable Sourcing <br /> & Zero Waste Ethics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 reveal">
        {[
          { title: "Purity", desc: "Minimalist ingredients, maximalist flavor profiles. We strip away the noise to reveal the essence.", img: "https://picsum.photos/seed/gourmet-ingredient-purity/600/400" },
          { title: "Innovation", desc: "Utilizing molecular gastronomy to redefine textures and temperature gradients.", img: "https://picsum.photos/seed/molecular-gastronomy-plating/600/400" },
          { title: "Heritage", desc: "Honoring the soil and the sea through seasonal cycles and ancient fermentation.", img: "https://picsum.photos/seed/traditional-luxury-cooking/600/400" }
        ].map((item, i) => (
          <div key={i} className="glass rounded-[3rem] overflow-hidden hover:border-gold/50 transition-all duration-700 group flex flex-col">
            <div className="h-48 overflow-hidden">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-1000" referrerPolicy="no-referrer" />
            </div>
            <div className="p-12 space-y-6">
              <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold font-display group-hover:bg-gold group-hover:text-black transition-all text-xs">0{i+1}</div>
              <h3 className="text-2xl font-display text-gold uppercase tracking-widest">{item.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed font-light">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Meet the Visionaries Section */}
      <div className="space-y-24 reveal">
        <div className="text-center space-y-6">
          <h2 className="text-gold text-sm uppercase tracking-[0.8em]">The Collective</h2>
          <h1 className="text-6xl font-display font-bold">MEET THE <span className="gold-gradient">VISIONARIES</span></h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { name: "Julian Vane", role: "Executive Chef", img: "https://picsum.photos/seed/chef-vane/600/800" },
            { name: "Sasha Grey", role: "Sommelier", img: "https://picsum.photos/seed/sommelier-sasha/600/800" },
            { name: "Leo Thorne", role: "Mixologist", img: "https://picsum.photos/seed/mixologist-leo/600/800" }
          ].map((person, i) => (
            <div key={i} className="group space-y-8 text-center">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden glass border-none relative">
                <img 
                  src={person.img} 
                  alt={person.name} 
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-70 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-display text-gold uppercase tracking-widest">{person.name}</h4>
                <p className="text-white/30 text-[10px] uppercase tracking-[0.5em]">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Philosophy;
