import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff, Music, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { buildApiUrl } from "@/lib/utils"
import axios from "axios"
import { toast } from "react-toastify"

export default function Signup() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(buildApiUrl("/user/send-otp"), { email })
      if (response.data.status === "success") {
        toast.success("OTP sent to your email!")
        setStep(2)
      } else {
        toast.error(response.data.message || "Failed to send OTP.")
      }
    } catch {
      toast.error("An error occurred while sending OTP.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(buildApiUrl("/user/signup"), {
        username, email, password, role: "USER", otp,
      })

      if (response.status === 200 && response.data.token) {
        login(response.data.user, response.data.token, response.data.expiresIn || 3600)
        toast.success("Account created successfully!")
        navigate("/app")
      } else {
        toast.error(response.data.message || "Signup failed")
      }
    } catch {
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.07] blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[var(--accent-warm)] opacity-[0.07] blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-warm)] flex items-center justify-center">
            <Music size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">TuneUp</span>
        </div>

        <div className="glass-strong rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-1">
            {step === 1 ? "Create account" : "Verify email"}
          </h2>
          <p className="text-[var(--text-muted)] text-sm mb-8">
            {step === 1 ? "Enter your details to get started" : `Enter the code sent to ${email}`}
          </p>

          {/* Step indicator */}
          <div className="flex gap-2 mb-8">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
          </div>

          <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-5">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                      className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 pr-12 text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-white transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="gradient-btn w-full flex items-center justify-center gap-2 py-3.5 rounded-xl disabled:opacity-50">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {loading ? "Sending code..." : "Send Verification Code"}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Verification Code</label>
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-center text-2xl tracking-[0.5em] text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                  />
                </div>
                <button type="submit" disabled={loading || otp.length < 6}
                  className="gradient-btn w-full flex items-center justify-center gap-2 py-3.5 rounded-xl disabled:opacity-50">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {loading ? "Verifying..." : "Verify & Continue"}
                </button>
                <button type="button" onClick={() => setStep(1)}
                  className="w-full py-3 text-sm text-[var(--text-muted)] border border-[var(--border)] rounded-xl hover:bg-[var(--surface)] transition-colors">
                  Use a different email
                </button>
              </>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[var(--accent-light)] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
