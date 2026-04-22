import { useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, Music, Upload, ExternalLink, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { path: "/admin/songs", icon: Music, label: "Songs" },
  { path: "/admin/upload", icon: Upload, label: "Upload" },
]

export default function AdminSidebar({ isOpen, onToggle }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname.startsWith(item.path)
  }

  return (
    <aside className={cn(
      "fixed md:relative z-40 h-full flex flex-col border-r transition-all duration-300",
      isOpen ? "w-56 translate-x-0" : "w-0 md:w-[72px] -translate-x-full md:translate-x-0"
    )} style={{ borderColor: "var(--admin-border)", background: "var(--admin-bg)" }}>
      <div className={cn("flex flex-col h-full", isOpen ? "px-4 py-5" : "px-2 py-5 items-center")}>
        {/* Logo */}
        <div className={cn("flex items-center mb-8", isOpen ? "justify-between px-2" : "justify-center")}>
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--admin-accent)" }}>
                <Music size={14} className="text-black" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--admin-text)" }}>TuneUp</p>
                <p className="text-[10px] font-medium" style={{ color: "var(--admin-accent)" }}>ADMIN</p>
              </div>
            </div>
          )}
          <button onClick={onToggle} className="p-2 rounded-lg transition-colors hide-mobile" style={{ color: "var(--admin-muted)" }}>
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-3 w-full rounded-xl px-3 py-2.5 transition-all duration-200",
                !isOpen && "justify-center px-2"
              )}
              style={{
                background: isActive(item) ? "rgba(74, 222, 128, 0.1)" : "transparent",
                color: isActive(item) ? "var(--admin-accent)" : "var(--admin-muted)",
              }}
            >
              <item.icon size={20} />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className={cn("mt-auto pt-4 space-y-1 border-t", !isOpen && "w-full")} style={{ borderColor: "var(--admin-border)" }}>
          <button
            onClick={() => navigate("/app")}
            className={cn("flex items-center gap-3 w-full rounded-xl px-3 py-2.5 transition-colors", !isOpen && "justify-center px-2")}
            style={{ color: "var(--admin-accent-2)" }}
          >
            <ExternalLink size={20} />
            {isOpen && <span className="text-sm font-medium">Go to App</span>}
          </button>
          <button
            onClick={() => { logout(); navigate("/login") }}
            className={cn("flex items-center gap-3 w-full rounded-xl px-3 py-2.5 transition-colors hover:bg-red-500/10", !isOpen && "justify-center px-2")}
            style={{ color: "var(--admin-muted)" }}
          >
            <LogOut size={20} />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
