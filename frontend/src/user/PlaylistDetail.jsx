import { useState, useEffect } from "react"
import { ArrowLeft, Play, Music, Clock } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { playlistsApi } from "@/lib/api"
import { API_BASE_URL } from "@/lib/utils"

export default function PlaylistDetail({ playlist, songs: allSongs, onBack, onPlay }) {
  const { user } = useAuth()
  const [playlistSongs, setPlaylistSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id && playlist?.playlistName) {
      playlistsApi.getPlaylistDetails(user.id, playlist.playlistName)
        .then(data => {
          setPlaylistSongs(data?.songs || [])
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [user?.id, playlist?.playlistName])

  // Resolve song name to full song object
  const resolveSong = (songName) => {
    return allSongs.find(s => s.name === songName)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-6">
        <button onClick={onBack} className="p-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface)] transition-colors mt-1">
          <ArrowLeft size={20} />
        </button>

        <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-warm)] flex items-center justify-center shadow-2xl shadow-[var(--accent)]/20 shrink-0">
          <Music size={48} className="text-white/50" />
        </div>

        <div className="pt-2">
          <p className="text-xs font-medium text-[var(--accent-light)] uppercase tracking-widest mb-1">Playlist</p>
          <h2 className="text-3xl font-bold text-white mb-2">{playlist.playlistName}</h2>
          <p className="text-sm text-[var(--text-muted)]">{playlistSongs.length} songs</p>
          {playlistSongs.length > 0 && (
            <button
              onClick={() => {
                const firstSong = resolveSong(playlistSongs[0])
                if (firstSong) onPlay(firstSong)
              }}
              className="gradient-btn mt-4 px-6 py-2.5 rounded-xl inline-flex items-center gap-2 text-sm"
            >
              <Play size={16} fill="currentColor" /> Play All
            </button>
          )}
        </div>
      </div>

      {/* Song list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : playlistSongs.length === 0 ? (
        <div className="glass-strong rounded-2xl py-16 text-center">
          <p className="text-[var(--text-muted)]">This playlist is empty. Add songs from the library.</p>
        </div>
      ) : (
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider border-b border-[var(--border)]">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-7">Title</div>
            <div className="col-span-3 hide-mobile">Artist</div>
            <div className="col-span-1 flex justify-center"><Clock size={14} /></div>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {playlistSongs.map((songName, idx) => {
              const song = resolveSong(songName)
              return (
                <div
                  key={`${songName}-${idx}`}
                  onClick={() => song && onPlay(song)}
                  className="grid grid-cols-12 gap-4 px-4 py-3 cursor-pointer group hover:bg-[rgba(255,255,255,0.03)] transition-colors items-center"
                >
                  <div className="col-span-1 flex justify-center">
                    <span className="text-sm text-[var(--text-faint)] group-hover:hidden">{idx + 1}</span>
                    <Play size={14} className="text-white hidden group-hover:block" />
                  </div>
                  <div className="col-span-7 flex items-center gap-3 min-w-0">
                    {song ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <img src={`${API_BASE_URL}${song.imagePath}`} alt={songName} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[var(--surface)] shrink-0 flex items-center justify-center">
                        <Music size={16} className="text-[var(--text-faint)]" />
                      </div>
                    )}
                    <p className="text-sm font-medium text-white truncate">{songName}</p>
                  </div>
                  <div className="col-span-3 text-sm text-[var(--text-muted)] truncate hide-mobile">
                    {song?.artist || "Unknown"}
                  </div>
                  <div className="col-span-1 text-xs text-[var(--text-faint)] text-center">—</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
