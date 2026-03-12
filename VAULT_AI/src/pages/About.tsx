import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Target, Eye, Heart, Users, Zap, Globe, ArrowRight, Linkedin, Twitter } from 'lucide-react'
import SEO from '../components/seo/SEO'
import ScrollReveal from '../components/animations/ScrollReveal'

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description: 'We believe AI should be accessible to everyone. Our mission is to democratize access to the best AI tools.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'No hidden fees, no surprises. We believe in complete transparency in pricing and features.',
  },
  {
    icon: Heart,
    title: 'User First',
    description: 'Every decision we make starts with our users. Your success is our success.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We stay on the cutting edge, constantly evaluating and adding the best new AI tools.',
  },
]

const team = [
  {
    name: 'Alex Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former Product Lead at OpenAI. Passionate about making AI accessible.',
    image: 'AC',
    color: '#FF4D2E',
  },
  {
    name: 'Sarah Miller',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Google engineer. Built scalable systems serving billions of users.',
    image: 'SM',
    color: '#FFBF00',
  },
  {
    name: 'David Park',
    role: 'Head of Design',
    bio: 'Award-winning designer. Previously at Figma and Airbnb.',
    image: 'DP',
    color: '#10B981',
  },
  {
    name: 'Emma Wilson',
    role: 'Head of Partnerships',
    bio: 'Built strategic partnerships at Microsoft and Stripe.',
    image: 'EW',
    color: '#6366F1',
  },
]

const milestones = [
  { year: '2022', event: 'AIVault founded' },
  { year: '2023', event: 'Launched with 10 AI tools' },
  { year: '2023', event: 'Reached 10,000 users' },
  { year: '2024', event: 'Expanded to 40+ tools' },
  { year: '2024', event: 'Launched bundle pricing' },
  { year: '2024', event: '50,000+ active users' },
]

export default function About() {
  useEffect(() => {
    gsap.fromTo(
      '.about-content',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  return (
    <>
      <SEO
        title="About Us"
        description="Learn about AIVault's mission to democratize AI access. Meet our team and discover our story."
        canonical="https://aivault.io/about"
      />

      <div className="pt-24 pb-24">
        {/* Hero */}
        <section className="w-full px-6 lg:px-12 mb-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="about-content">
              <span className="eyebrow mb-4 block">About Us</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-vault-text mb-6">
                Making AI accessible to everyone
              </h1>
              <p className="text-vault-text-secondary text-lg max-w-2xl mx-auto">
                AIVault was born from a simple idea: AI tools are powerful, but managing 
                multiple subscriptions shouldn't be a headache. We're here to fix that.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="w-full px-6 lg:px-12 mb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="left">
                <div className="glass-card-strong p-8 md:p-12">
                  <h2 className="text-3xl font-bold font-heading text-vault-text mb-6">
                    Our Story
                  </h2>
                  <div className="space-y-4 text-vault-text-secondary">
                    <p>
                      It started with a frustration. As AI enthusiasts and professionals, 
                      we found ourselves juggling dozens of subscriptions, each with different 
                      billing cycles, interfaces, and login credentials.
                    </p>
                    <p>
                      We built AIVault to solve our own problem. What started as a simple 
                      dashboard has grown into a comprehensive platform serving 50,000+ users 
                      worldwide.
                    </p>
                    <p>
                      Today, we're on a mission to democratize AI access. We believe everyone 
                      should have easy access to the best tools, without the administrative overhead.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div className="glass-card p-8">
                  <h3 className="text-xl font-bold font-heading text-vault-text mb-6">
                    Milestones
                  </h3>
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 text-vault-accent font-mono font-medium">
                          {milestone.year}
                        </div>
                        <div className="flex-grow h-px bg-white/10" />
                        <div className="text-vault-text-secondary text-sm">
                          {milestone.event}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="w-full px-6 lg:px-12 mb-24">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="eyebrow mb-4 block">Our Values</span>
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-vault-text mb-4">
                  What drives us
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <ScrollReveal key={index} delay={index * 100}>
                    <div className="glass-card p-8 h-full hover:bg-white/[0.06] transition-all duration-300 group">
                      <div className="w-14 h-14 rounded-2xl bg-vault-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-vault-accent" />
                      </div>
                      <h3 className="text-xl font-semibold text-vault-text mb-3">
                        {value.title}
                      </h3>
                      <p className="text-vault-text-secondary">
                        {value.description}
                      </p>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="careers" className="w-full px-6 lg:px-12 mb-24">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="eyebrow mb-4 block">Our Team</span>
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-vault-text mb-4">
                  Meet the people behind AIVault
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="glass-card p-6 text-center group hover:bg-white/[0.06] transition-all duration-300">
                    <div
                      className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                      style={{
                        backgroundColor: `${member.color}20`,
                        color: member.color,
                      }}
                    >
                      {member.image}
                    </div>
                    <h3 className="text-lg font-semibold text-vault-text mb-1">
                      {member.name}
                    </h3>
                    <p className="text-vault-accent text-sm mb-3">
                      {member.role}
                    </p>
                    <p className="text-vault-text-secondary text-sm mb-4">
                      {member.bio}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <a
                        href="#"
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-vault-text-secondary hover:text-vault-accent hover:bg-vault-accent/10 transition-all"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a
                        href="#"
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-vault-text-secondary hover:text-vault-accent hover:bg-vault-accent/10 transition-all"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Careers CTA */}
        <section className="w-full px-6 lg:px-12 mb-24">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="glass-card-strong p-8 md:p-12 text-center">
                <Users className="w-12 h-12 text-vault-accent mx-auto mb-4" />
                <h2 className="text-3xl font-bold font-heading text-vault-text mb-4">
                  Join our team
                </h2>
                <p className="text-vault-text-secondary mb-6 max-w-xl mx-auto">
                  We're always looking for talented people who are passionate about AI 
                  and want to make a difference.
                </p>
                <Link
                  to="/contact"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  View Open Positions
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Global Stats */}
        <section className="w-full px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="glass-card p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-vault-accent mx-auto mb-3" />
                    <div className="text-3xl font-bold font-heading text-vault-text mb-1">
                      50K+
                    </div>
                    <div className="text-vault-text-secondary text-sm">Active Users</div>
                  </div>
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-vault-accent mx-auto mb-3" />
                    <div className="text-3xl font-bold font-heading text-vault-text mb-1">
                      40+
                    </div>
                    <div className="text-vault-text-secondary text-sm">AI Tools</div>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-vault-accent mx-auto mb-3" />
                    <div className="text-3xl font-bold font-heading text-vault-text mb-1">
                      15
                    </div>
                    <div className="text-vault-text-secondary text-sm">Team Members</div>
                  </div>
                  <div className="text-center">
                    <Heart className="w-8 h-8 text-vault-accent mx-auto mb-3" />
                    <div className="text-3xl font-bold font-heading text-vault-text mb-1">
                      4.9
                    </div>
                    <div className="text-vault-text-secondary text-sm">User Rating</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </>
  )
}
