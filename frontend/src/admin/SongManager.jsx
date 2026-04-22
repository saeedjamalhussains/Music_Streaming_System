import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Edit, Trash2, Music } from "lucide-react"
import { songsApi } from "@/lib/api"
import { API_BASE_URL } from "@/lib/utils"

export default function SongManager() {
  const navigate = useNavigate()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    songsApi.getAll().then(setSongs).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return
    try {
      const res = await songsApi.delete(id)
      if (res.ok) setSongs(songs.filter(s => s.id !== id))
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  const filtered = search
    ? songs.filter(s => {
        const q = search.toLowerCase()
        return s.name?.toLowerCase().includes(q) || s.artist?.toLowerCase().includes(q)
      })
    : songs

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--admin-text)" }}>Song Management</h1>
          <p className="text-sm mt-1" style={{ color: "var(--admin-muted)" }}>{songs.length} songs in library</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-muted)" }} />
            <input
              type="text" placeholder="Search songs..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-56 rounded-xl border pl-9 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
              style={{ borderColor: "var(--admin-border)", background: "rgba(255,255,255,0.03)", color: "var(--admin-text)" }}
            />
          </div>
          <button onClick={() => navigate("/admin/upload")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-black"
            style={{ background: "var(--admin-accent)" }}>
            <Plus size={16} /> Add Song
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-surface rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "var(--admin-accent)", borderTopColor: "transparent" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center" style={{ color: "var(--admin-muted)" }}>
            <Music size={40} className="mx-auto mb-3 opacity-30" />
            <p>{search ? "No songs match your search" : "No songs in the library"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wider border-b"
                    style={{ color: "var(--admin-muted)", borderColor: "var(--admin-border)" }}>
                  <th className="px-5 py-3 text-left w-12">#</th>
                  <th className="px-5 py-3 text-left">Song</th>
                  <th className="px-5 py-3 text-left hide-mobile">Artist</th>
                  <th className="px-5 py-3 text-left hide-mobile">Album</th>
                  <th className="px-5 py-3 text-left hide-mobile">Year</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((song, idx) => (
                  <tr key={song.id} className="border-b hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                      style={{ borderColor: "var(--admin-border)" }}>
                    <td className="px-5 py-3 text-sm" style={{ color: "var(--admin-muted)" }}>{idx + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0" style={{ background: "var(--admin-surface)" }}>
                          <img src={`${API_BASE_URL}${song.imagePath}`} alt={song.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--admin-text)" }}>{song.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm hide-mobile" style={{ color: "var(--admin-muted)" }}>{song.artist || "—"}</td>
                    <td className="px-5 py-3 text-sm hide-mobile" style={{ color: "var(--admin-muted)" }}>{song.movie || "—"}</td>
                    <td className="px-5 py-3 text-sm hide-mobile" style={{ color: "var(--admin-muted)" }}>{song.releaseYear || "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/edit/${song.id}`, { state: { song } })}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: "var(--admin-accent-2)" }}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(song.id)}
                          className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                          style={{ color: "var(--admin-danger)" }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
