import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Music, Upload, Users, TrendingUp, Plus } from "lucide-react"
import { songsApi } from "@/lib/api"
import StatsCard from "@/admin/StatsCard"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    songsApi.getAll().then(setSongs).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const recentSongs = songs.slice(-5).reverse()
  const uniqueArtists = new Set(songs.map(s => s.artist).filter(Boolean)).size

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--admin-text)" }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "var(--admin-muted)" }}>Overview of your music library</p>
        </div>
        <button onClick={() => navigate("/admin/upload")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:scale-[1.02]"
          style={{ background: "var(--admin-accent)" }}>
          <Plus size={16} /> Add Song
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Music} label="Total Songs" value={loading ? "..." : songs.length} color="var(--admin-accent)" />
        <StatsCard icon={Users} label="Artists" value={loading ? "..." : uniqueArtists} color="var(--admin-accent-2)" />
        <StatsCard icon={Upload} label="Recent Uploads" value={loading ? "..." : Math.min(songs.length, 5)} color="var(--admin-warn)" />
        <StatsCard icon={TrendingUp} label="Library Health" value="100%" color="var(--admin-accent)" />
      </div>

      {/* Recent songs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: "var(--admin-text)" }}>Recent Uploads</h2>
          <button onClick={() => navigate("/admin/songs")}
            className="text-sm font-medium transition-colors" style={{ color: "var(--admin-accent-2)" }}>
            View All →
          </button>
        </div>

        <div className="admin-surface rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "var(--admin-accent)", borderTopColor: "transparent" }} />
            </div>
          ) : recentSongs.length === 0 ? (
            <div className="py-12 text-center" style={{ color: "var(--admin-muted)" }}>
              <p>No songs uploaded yet. Start by adding your first track.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wider border-b" style={{ color: "var(--admin-muted)", borderColor: "var(--admin-border)" }}>
                  <th className="px-5 py-3 text-left">Song</th>
                  <th className="px-5 py-3 text-left hide-mobile">Artist</th>
                  <th className="px-5 py-3 text-left hide-mobile">Album</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
                {recentSongs.map(song => (
                  <tr key={song.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium" style={{ color: "var(--admin-text)" }}>{song.name}</p>
                    </td>
                    <td className="px-5 py-3 text-sm hide-mobile" style={{ color: "var(--admin-muted)" }}>{song.artist || "—"}</td>
                    <td className="px-5 py-3 text-sm hide-mobile" style={{ color: "var(--admin-muted)" }}>{song.movie || "—"}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => navigate(`/admin/edit/${song.id}`, { state: { song } })}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                        style={{ color: "var(--admin-accent-2)", background: "rgba(129,140,248,0.1)" }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
