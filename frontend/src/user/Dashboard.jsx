import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useAudioPlayer } from "@/hooks/useAudioPlayer"
import { songsApi } from "@/lib/api"
import { API_BASE_URL, getGreeting, getRandomItems } from "@/lib/utils"
import Sidebar from "@/user/Sidebar"
import Player from "@/user/Player"
import SongGrid from "@/user/SongGrid"
import SongTable from "@/user/SongTable"
import SongMenu from "@/user/SongMenu"
import PlaylistGrid from "@/user/PlaylistGrid"
import PlaylistDetail from "@/user/PlaylistDetail"
import PlaylistModal from "@/user/PlaylistModal"
import { Search, X } from "lucide-react"

export default function UserDashboard() {
  const { user } = useAuth()
  const audioPlayer = useAudioPlayer()

  // Song state
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSong, setCurrentSong] = useState(null)
  const [songDurations, setSongDurations] = useState({})

  // UI state
  const [view, setView] = useState("home") // home | playlists | playlistDetail
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)

  // Context menu
  const [menuSong, setMenuSong] = useState(null)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })

  // Playlist modal
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false)
  const [playlistModalSong, setPlaylistModalSong] = useState(null)

  // Suggestions
  const [suggested, setSuggested] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const data = await songsApi.getAll()
        setSongs(data)
        setSuggested(getRandomItems(data, Math.min(6, data.length)))

        // Load durations
        data.forEach(song => {
          const audio = new Audio(`${API_BASE_URL}${song.filePath}`)
          audio.addEventListener("loadedmetadata", () => {
            setSongDurations(prev => ({ ...prev, [song.id]: audio.duration }))
          })
        })
      } catch (err) {
        console.error("Failed to fetch songs:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Filter
  const filteredSongs = searchQuery
    ? songs.filter(s => {
      const q = searchQuery.toLowerCase()
      return s.name?.toLowerCase().includes(q) ||
             s.artist?.toLowerCase().includes(q) ||
             s.movie?.toLowerCase().includes(q)
    })
    : songs

  // Play handler
  const handlePlay = (song) => {
    const url = `${API_BASE_URL}${song.filePath}`
    audioPlayer.loadTrack(url)
    audioPlayer.play()
    setCurrentSong({
      id: song.id,
      name: song.name,
      artist: song.artist || "Unknown Artist",
      image: `${API_BASE_URL}${song.imagePath}`,
    })
  }

  // Context menu
  const handleContextMenu = (e, song) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuSong(song)
    setMenuPos({ x: e.clientX, y: e.clientY })
  }

  const closeMenu = () => setMenuSong(null)

  // Add to playlist
  const openPlaylistModal = (song) => {
    setPlaylistModalSong(song || currentSong)
    setPlaylistModalOpen(true)
    closeMenu()
  }

  // Delete song
  const handleDeleteSong = async (songId) => {
    if (!window.confirm("Delete this song permanently?")) return
    try {
      const res = await songsApi.delete(songId)
      if (res.ok) setSongs(songs.filter(s => s.id !== songId))
    } catch (err) {
      console.error("Delete failed:", err)
    }
    closeMenu()
  }

  // View playlist detail
  const openPlaylistDetail = (playlist) => {
    setSelectedPlaylist(playlist)
    setView("playlistDetail")
  }

  // Render main content
  const renderContent = () => {
    if (view === "playlists") {
      return <PlaylistGrid onSelectPlaylist={openPlaylistDetail} onBack={() => setView("home")} />
    }

    if (view === "playlistDetail" && selectedPlaylist) {
      return (
        <PlaylistDetail
          playlist={selectedPlaylist}
          songs={songs}
          onBack={() => { setView("playlists"); setSelectedPlaylist(null) }}
          onPlay={handlePlay}
        />
      )
    }

    // Home view
    return (
      <div className="space-y-10 animate-fade-in">
        {/* Greeting */}
        <div>
          <p className="text-sm font-medium text-[var(--accent-light)] mb-1">{getGreeting()}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {user?.username ? `Hey, ${user.username}` : "Welcome back"} 👋
          </h1>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] pl-11 pr-10 py-3 text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Suggested For You */}
        {!searchQuery && suggested.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold text-white">Suggested For You</h2>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">Fresh picks based on your library</p>
              </div>
              <button
                onClick={() => setSuggested(getRandomItems(songs, Math.min(6, songs.length)))}
                className="text-sm font-medium text-[var(--accent-light)] hover:text-[var(--accent)] transition-colors"
              >
                Refresh ↻
              </button>
            </div>
            <SongGrid
              songs={suggested}
              onPlay={handlePlay}
              onContextMenu={handleContextMenu}
              currentSong={currentSong}
              isPlaying={audioPlayer.isPlaying}
            />
          </section>
        )}

        {/* All Songs */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {searchQuery ? `Results for "${searchQuery}"` : "Your Library"}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                {filteredSongs.length} {filteredSongs.length === 1 ? "track" : "tracks"}
              </p>
            </div>
          </div>
          <SongTable
            songs={filteredSongs}
            durations={songDurations}
            onPlay={handlePlay}
            onContextMenu={handleContextMenu}
            currentSong={currentSong}
            isPlaying={audioPlayer.isPlaying}
            loading={loading}
          />
        </section>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeView={view}
        onNavigate={(v) => { setView(v); setSidebarOpen(false) }}
        currentSong={currentSong}
        onOpenPlaylistModal={() => openPlaylistModal(currentSong)}
      />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-[var(--text-muted)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className="text-sm font-semibold text-white">TuneUp</span>
          <div className="w-8" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 pb-32">
          {renderContent()}
        </div>

        {/* Player */}
        <Player
          audioPlayer={audioPlayer}
          currentSong={currentSong}
        />
      </main>

      {/* Context menu */}
      {menuSong && (
        <SongMenu
          song={menuSong}
          position={menuPos}
          onClose={closeMenu}
          onAddToPlaylist={() => openPlaylistModal(menuSong)}
          onDelete={handleDeleteSong}
        />
      )}

      {/* Playlist modal */}
      {playlistModalOpen && (
        <PlaylistModal
          song={playlistModalSong}
          onClose={() => setPlaylistModalOpen(false)}
        />
      )}
    </div>
  )
}
