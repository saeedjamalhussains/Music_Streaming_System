import { useState, useEffect } from "react"
import { X, Search, Plus, Music, Loader2, Check } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { playlistsApi } from "@/lib/api"

export default function PlaylistModal({ song, onClose }) {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (user?.id) {
      setLoading(true)
      playlistsApi.getUserPlaylists(user.id)
        .then(setPlaylists)
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [user?.id])

  const addToPlaylist = async (playlistName) => {
    if (!song?.name || !user?.id) return
    try {
      setLoading(true)
      await playlistsApi.addSong(user.id, playlistName, song.name)
      setSuccess(`Added to "${playlistName}"`)
      setTimeout(() => setSuccess(""), 2000)
    } catch {
      setError("Failed to add song")
      setTimeout(() => setError(""), 2000)
    } finally {
      setLoading(false)
    }
  }

  const createPlaylist = async (e) => {
    e.preventDefault()
    if (!newName.trim() || !user?.id) return
    try {
      setLoading(true)
      const result = await playlistsApi.create(user.id, newName)
      if (result) {
        setPlaylists([...playlists, result])
        setNewName("")
        setCreating(false)
        if (song?.name) await addToPlaylist(newName)
      }
    } catch {
      setError("Failed to create playlist")
      setTimeout(() => setError(""), 2000)
    } finally {
      setLoading(false)
    }
  }

  const filtered = search
    ? playlists.filter(p => p.playlistName.toLowerCase().includes(search.toLowerCase()))
    : playlists

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-strong w-full max-w-sm rounded-2xl p-6 mx-4 animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">{creating ? "Create Playlist" : "Add to Playlist"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-white hover:bg-[var(--surface)] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Song preview */}
        {song && !creating && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--border)] mb-5">
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[var(--surface)]">
              {song.image ? <img src={song.image} alt={song.name} className="w-full h-full object-cover" /> 
                : <div className="w-full h-full flex items-center justify-center"><Music size={16} className="text-[var(--text-faint)]" /></div>}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{song.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{song.artist || "Unknown"}</p>
            </div>
          </div>
        )}

        {creating ? (
          <form onSubmit={createPlaylist} className="space-y-4">
            <input
              type="text" value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Playlist name" autoFocus
              className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <div className="flex justify-between">
              <button type="button" onClick={() => setCreating(false)}
                className="px-4 py-2.5 rounded-xl text-sm text-[var(--text-muted)] border border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="gradient-btn px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Create
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
              <input type="text" placeholder="Search playlists..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] pl-9 pr-4 py-2.5 text-sm text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)]/50 transition-colors" />
            </div>

            {/* List */}
            <div className="max-h-52 overflow-y-auto space-y-1 mb-4">
              {loading ? (
                <div className="flex justify-center py-6">
                  <Loader2 size={20} className="animate-spin text-[var(--accent)]" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-center py-6 text-sm text-[var(--text-muted)]">No playlists found</p>
              ) : (
                filtered.map(pl => (
                  <button key={pl.playlistName} onClick={() => addToPlaylist(pl.playlistName)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent-warm)]/30 flex items-center justify-center shrink-0">
                      <Music size={14} className="text-[var(--accent-light)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{pl.playlistName}</p>
                      <p className="text-xs text-[var(--text-muted)]">{pl.songs?.length || 0} songs</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* New playlist */}
            <button onClick={() => setCreating(true)}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)] hover:text-white hover:border-[var(--border-hover)] transition-colors">
              <Plus size={16} /> New Playlist
            </button>
          </>
        )}

        {/* Toasts */}
        {success && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm animate-fade-in">
            <Check size={16} /> {success}
          </div>
        )}
        {error && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
            <X size={16} /> {error}
          </div>
        )}
      </div>
    </div>
  )
}
