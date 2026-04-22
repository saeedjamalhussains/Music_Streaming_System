import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart } from "lucide-react"
import { useState } from "react"
import { formatTime } from "@/lib/utils"

export default function Player({ audioPlayer, currentSong }) {
  const { isPlaying, duration, currentTime, volume, togglePlay, seek, setAudioVolume } = audioPlayer
  const [liked, setLiked] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!currentSong) {
    return (
      <div className="glass border-t border-[var(--border)] px-4 py-3 md:px-6">
        <div className="flex items-center justify-center gap-3 text-[var(--text-faint)]">
          <Play size={18} />
          <span className="text-sm">Select a song to start playing</span>
        </div>
      </div>
    )
  }

  return (
    <div className="glass border-t border-[var(--border)] px-4 py-3 md:px-6">
      <div className="flex items-center gap-4 max-w-screen-2xl mx-auto">
        {/* Song info */}
        <div className="flex items-center gap-3 w-[30%] min-w-0">
          <div className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 ${isPlaying ? "animate-spin-slow" : ""}`}
            style={{ animationDuration: "8s" }}>
            <img src={currentSong.image || "/placeholder.svg"} alt={currentSong.name}
              className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentSong.name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{currentSong.artist}</p>
          </div>
          <button onClick={() => setLiked(!liked)}
            className={`shrink-0 p-1.5 rounded-full transition-colors ${liked ? "text-[var(--accent-warm)]" : "text-[var(--text-faint)] hover:text-white"}`}>
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-3">
            <button className="p-1.5 text-[var(--text-muted)] hover:text-white transition-colors">
              <SkipBack size={18} />
            </button>
            <button onClick={togglePlay}
              className="w-10 h-10 rounded-full gradient-btn flex items-center justify-center">
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <button className="p-1.5 text-[var(--text-muted)] hover:text-white transition-colors">
              <SkipForward size={18} />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 w-full max-w-lg">
            <span className="text-[10px] text-[var(--text-faint)] w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-1.5 group cursor-pointer">
              <div className="absolute inset-0 rounded-full bg-[rgba(255,255,255,0.08)]" />
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-warm)]"
                style={{ width: `${progress}%` }} />
              <input type="range" min={0} max={duration || 100} value={currentTime || 0}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer" />
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }} />
            </div>
            <span className="text-[10px] text-[var(--text-faint)] w-8 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="w-[20%] flex items-center justify-end gap-2 hide-mobile">
          <div className="relative" onMouseEnter={() => setShowVolume(true)} onMouseLeave={() => setShowVolume(false)}>
            <button className="p-1.5 text-[var(--text-muted)] hover:text-white transition-colors">
              {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            {showVolume && (
              <div className="absolute bottom-full right-0 mb-2 glass rounded-xl p-3 animate-fade-in">
                <input type="range" min={0} max={1} step={0.01} value={volume}
                  onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                  className="w-24 h-1.5 appearance-none bg-[rgba(255,255,255,0.15)] rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
