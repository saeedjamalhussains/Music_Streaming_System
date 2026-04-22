import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Home, Search, Library, Heart, Music, LogOut, ChevronLeft, ChevronRight, Plus, Settings } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { playlistsApi } from "@/lib/api"

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "playlists", icon: Library, label: "Library" },
]

export default function Sidebar({ isOpen, onToggle, activeView, onNavigate, currentSong, onOpenPlaylistModal }) {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    if (user?.id) {
      playlistsApi.getUserPlaylists(user.id).then(setPlaylists).catch(() => {})
    }
  }, [user?.id])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <aside className={cn(
      "fixed md:relative z-40 h-full flex flex-col border-r border-[var(--border)] bg-[var(--bg)] transition-all duration-300 ease-in-out",
      isOpen ? "w-64 translate-x-0" : "w-0 md:w-[72px] -translate-x-full md:translate-x-0"
    )}>
      <div className={cn("flex flex-col h-full", isOpen ? "px-4 py-5" : "px-2 py-5 items-center")}>
        {/* Logo + Toggle */}
        <div className={cn("flex items-center mb-8", isOpen ? "justify-between px-2" : "justify-center")}>
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-warm)] flex items-center justify-center">
                <Music size={14} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">TuneUp</span>
            </div>
          )}
          <button onClick={onToggle} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)] transition-colors hide-mobile">
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 w-full rounded-xl px-3 py-2.5 transition-all duration-200",
                activeView === item.id
                  ? "bg-[var(--accent)]/10 text-[var(--accent-light)]"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)]",
                !isOpen && "justify-center px-2"
              )}
            >
              <item.icon size={20} />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}

          {/* Admin link */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className={cn(
                "flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[var(--accent-warm)] hover:bg-[var(--accent-warm)]/10 transition-colors",
                !isOpen && "justify-center px-2"
              )}
            >
              <Settings size={20} />
              {isOpen && <span className="text-sm font-medium">Admin Panel</span>}
            </button>
          )}
        </nav>

        {/* Playlists */}
        {isOpen && (
          <div className="mt-8 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between px-2 mb-3">
              <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-widest">Playlists</span>
              <button onClick={onOpenPlaylistModal} className="p-1 text-[var(--text-faint)] hover:text-white transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-0.5">
              {playlists.map(pl => (
                <button
                  key={pl.playlistName}
                  onClick={() => onNavigate("playlists")}
                  className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)] transition-colors truncate"
                >
                  <Music size={14} className="shrink-0 opacity-50" />
                  <span className="truncate">{pl.playlistName}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom */}
        <div className={cn("mt-auto pt-4 border-t border-[var(--border)]", !isOpen && "w-full")}>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors",
              !isOpen && "justify-center px-2"
            )}
          >
            <LogOut size={20} />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
