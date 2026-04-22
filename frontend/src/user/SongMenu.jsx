import { useEffect, useRef } from "react"
import { PlusSquare, Download, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function SongMenu({ song, position, onClose, onAddToPlaylist, onDelete }) {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const ref = useRef()

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    const handleKey = (e) => { if (e.key === "Escape") onClose() }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [onClose])

  // Position menu within viewport
  const style = {
    position: "fixed",
    left: Math.min(position.x, window.innerWidth - 200),
    top: Math.min(position.y, window.innerHeight - 250),
    zIndex: 9999,
  }

  return (
    <div ref={ref} style={style} className="w-48 glass-strong rounded-xl p-1 shadow-2xl animate-fade-in">
      <button
        onClick={onAddToPlaylist}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-[var(--text)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
      >
        <PlusSquare size={16} className="text-[var(--accent-light)]" />
        Add to Playlist
      </button>

      <button
        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-[var(--text)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
      >
        <Download size={16} className="text-[var(--text-muted)]" />
        Download
      </button>

      {isAdmin && (
        <>
          <div className="my-1 border-t border-[var(--border)]" />
          <button
            onClick={() => { navigate("/admin/edit/" + song.id, { state: { song } }); onClose() }}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-[var(--admin-accent-2)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          >
            <Edit size={16} />
            Edit Song
          </button>
          <button
            onClick={() => onDelete(song.id)}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-[var(--admin-danger)] hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={16} />
            Delete Song
          </button>
        </>
      )}
    </div>
  )
}
