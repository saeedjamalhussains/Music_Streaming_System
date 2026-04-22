import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff, Music, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { buildApiUrl } from "@/lib/utils"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Admin bypass
      if (form.email === "admin" && form.password === "admin") {
        const mockPayload = btoa(JSON.stringify({ role: "ADMIN", email: "admin" }))
        const mockToken = "header." + mockPayload + ".signature"
        login({ email: "admin", role: "ADMIN" }, mockToken, 3600)
        navigate("/admin")
        return
      }

      const response = await fetch(buildApiUrl("/user/signin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()
      if (response.ok && data.token) {
        login(data.user, data.token, data.expiresIn || 3600)
        navigate(data.user?.role === "ADMIN" ? "/admin" : "/app")
      } else {
        setError(data.message || "Login failed")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.07] blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[var(--accent-warm)] opacity-[0.07] blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-warm)] flex items-center justify-center">
            <Music size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">TuneUp</span>
        </div>

        <div className="glass-strong rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-[var(--text-muted)] text-sm mb-8">Sign in to continue listening</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Email</label>
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email or 'admin'"
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 pr-12 text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full flex items-center justify-center gap-2 py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-[var(--accent-light)] hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
