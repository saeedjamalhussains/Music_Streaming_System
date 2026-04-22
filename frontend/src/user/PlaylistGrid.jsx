import { useState, useEffect } from "react"
import { Music, ArrowLeft, Search, Plus } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { playlistsApi } from "@/lib/api"

export default function PlaylistGrid({ onSelectPlaylist, onBack }) {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (user?.id) {
      playlistsApi.getUserPlaylists(user.id)
        .then(setPlaylists)
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [user?.id])

  const filtered = search
    ? playlists.filter(p => p.playlistName.toLowerCase().includes(search.toLowerCase()))
    : playlists

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="text-xs font-medium text-[var(--accent-light)] uppercase tracking-widest">Collection</p>
          <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
        </div>
        <div className="ml-auto relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text" placeholder="Search playlists..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] pl-9 pr-4 py-2.5 text-sm text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-strong rounded-2xl py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
            <Music size={24} className="text-[var(--accent-light)]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No playlists yet</h3>
          <p className="text-sm text-[var(--text-muted)] mb-6">Create your first playlist to organize your music</p>
          <button className="gradient-btn px-6 py-2.5 rounded-xl inline-flex items-center gap-2">
            <Plus size={16} /> Create Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(pl => (
            <div
              key={`${pl.userId}-${pl.playlistName}`}
              onClick={() => onSelectPlaylist(pl)}
              className="group cursor-pointer"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-warm)]/20 border border-[var(--border)] flex items-center justify-center transition-all duration-300 group-hover:border-[var(--border-hover)] group-hover:shadow-lg group-hover:shadow-[var(--accent)]/5 group-hover:-translate-y-1">
                <Music size={40} className="text-[var(--text-faint)] group-hover:text-[var(--accent-light)] transition-colors" />
              </div>
              <div className="mt-3">
                <p className="font-medium text-white truncate">{pl.playlistName}</p>
                <p className="text-xs text-[var(--text-muted)]">{pl.songs?.length || 0} songs</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
