import { Play, Clock, MoreVertical } from "lucide-react"
import { API_BASE_URL, formatTime } from "@/lib/utils"

export default function SongTable({ songs, durations, onPlay, onContextMenu, currentSong, isPlaying, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!songs.length) {
    return (
      <div className="glass-strong rounded-2xl py-16 text-center">
        <p className="text-[var(--text-muted)]">No songs found</p>
      </div>
    )
  }

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider border-b border-[var(--border)]">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-5">Title</div>
        <div className="col-span-3 hide-mobile">Artist</div>
        <div className="col-span-2 hide-mobile">Album</div>
        <div className="col-span-1 flex justify-center"><Clock size={14} /></div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[var(--border)]">
        {songs.map((song, idx) => {
          const isActive = currentSong?.id === song.id
          return (
            <div
              key={song.id || idx}
              onClick={() => onPlay(song)}
              className="grid grid-cols-12 gap-4 px-4 py-3 cursor-pointer group hover:bg-[rgba(255,255,255,0.03)] transition-colors items-center"
            >
              {/* Number / Play */}
              <div className="col-span-1 flex justify-center">
                {isActive && isPlaying ? (
                  <div className="flex items-end gap-[2px] h-4">
                    <span className="eq-bar" style={{width:2}} /><span className="eq-bar" style={{width:2}} /><span className="eq-bar" style={{width:2}} />
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-[var(--text-faint)] group-hover:hidden">{idx + 1}</span>
                    <Play size={14} className="text-white hidden group-hover:block" />
                  </>
                )}
              </div>

              {/* Title + Image */}
              <div className="col-span-5 flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[var(--surface)]">
                  <img src={`${API_BASE_URL}${song.imagePath}`} alt={song.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? "text-[var(--accent-light)]" : "text-white"}`}>
                    {song.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] truncate md:hidden">{song.artist || "Unknown"}</p>
                </div>
              </div>

              {/* Artist */}
              <div className="col-span-3 text-sm text-[var(--text-muted)] truncate hide-mobile">
                {song.artist || "Unknown Artist"}
              </div>

              {/* Album */}
              <div className="col-span-2 text-sm text-[var(--text-muted)] truncate hide-mobile">
                {song.movie || "—"}
              </div>

              {/* Duration + Menu */}
              <div className="col-span-1 flex items-center justify-center gap-1">
                <span className="text-xs text-[var(--text-faint)] tabular-nums">{formatTime(durations[song.id])}</span>
                <button
                  onClick={(e) => onContextMenu(e, song)}
                  className="p-1 text-[var(--text-faint)] opacity-0 group-hover:opacity-100 hover:text-white transition-all"
                >
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
