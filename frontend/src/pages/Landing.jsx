import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Headphones, Music, Radio, Sparkles, ArrowRight } from "lucide-react"

const features = [
  { icon: Headphones, title: "Lossless Streaming", desc: "Crystal-clear audio quality for every track in your library." },
  { icon: Music, title: "Smart Playlists", desc: "Organize your music into playlists that fit every mood." },
  { icon: Radio, title: "Discover New", desc: "Get personalized suggestions based on what you love." },
  { icon: Sparkles, title: "Admin Tools", desc: "Full control to upload, edit, and manage your catalog." },
]

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)]">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--accent)] opacity-[0.06] blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--accent-warm)] opacity-[0.06] blur-[120px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-warm)] flex items-center justify-center">
            <Music size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">TuneUp</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="gradient-btn px-5 py-2.5 text-sm rounded-xl">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center px-6 pt-16 pb-20 md:pt-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 mb-8">
            <Sparkles size={14} className="text-[var(--accent-warm)]" />
            <span className="text-xs font-medium text-[var(--text-muted)]">Your music, your way</span>
          </div>

          <h1 className="max-w-4xl mx-auto text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
            <span className="text-white">Feel every beat.</span>
            <br />
            <span className="gradient-text">Own every moment.</span>
          </h1>

          <p className="mt-6 max-w-xl mx-auto text-lg text-[var(--text-muted)] leading-relaxed">
            Stream your personal music library with a beautiful, responsive player.
            Upload, organize, and enjoy — all in one place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="gradient-btn flex items-center gap-2 px-8 py-4 text-base rounded-2xl">
              Start Listening <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="flex items-center gap-2 px-8 py-4 text-base font-medium text-white rounded-2xl border border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Floating album art mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-16 w-full max-w-3xl"
        >
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-warm)] flex items-center justify-center">
                <Music size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-lg">Now Playing</p>
                <p className="text-[var(--text-muted)] text-sm">Your favorite track • Artist Name</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
              <div className="h-full w-[45%] rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-warm)]" />
            </div>
            <div className="flex justify-between mt-2 text-xs text-[var(--text-muted)]">
              <span>1:34</span><span>3:45</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-24 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="glass-strong rounded-2xl p-6 hover:border-[var(--border-hover)] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/20 transition-colors">
                <f.icon size={22} className="text-[var(--accent-light)]" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border)] py-8 text-center">
        <p className="text-sm text-[var(--text-faint)]">© 2026 TuneUp. Built with 🎵</p>
      </footer>
    </div>
  )
}
