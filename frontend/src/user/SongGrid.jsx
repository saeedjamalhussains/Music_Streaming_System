import { Play, Heart } from "lucide-react"
import { API_BASE_URL } from "@/lib/utils"

export default function SongGrid({ songs, onPlay, onContextMenu, currentSong, isPlaying }) {
  if (!songs.length) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {songs.map((song) => {
        const isActive = currentSong?.id === song.id
        return (
          <div
            key={song.id}
            className="group relative cursor-pointer"
            onClick={() => onPlay(song)}
            onContextMenu={(e) => onContextMenu(e, song)}
          >
            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--surface)] shadow-lg">
              <img
                src={`${API_BASE_URL}${song.imagePath}`}
                alt={song.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Play button */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isActive && isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                {isActive && isPlaying ? (
                  <div className="flex items-end gap-[3px] h-6">
                    <span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" />
                  </div>
                ) : (
                  <button className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/30 hover:scale-110 transition-transform">
                    <Play size={20} fill="white" className="text-white ml-0.5" />
                  </button>
                )}
              </div>

              {/* Like */}
              <button
                onClick={(e) => e.stopPropagation()}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/30 text-white/70 opacity-0 group-hover:opacity-100 hover:text-[var(--accent-warm)] transition-all"
              >
                <Heart size={14} />
              </button>
            </div>

            {/* Info */}
            <div className="mt-3 px-1">
              <p className={`text-sm font-medium truncate ${isActive ? "text-[var(--accent-light)]" : "text-white"}`}>
                {song.name}
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                {song.artist || "Unknown Artist"}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
