import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Upload, Music, X, Loader2, Check, Save, ArrowLeft } from "lucide-react"
import jsmediatags from "jsmediatags/dist/jsmediatags.min.js"
import { songsApi } from "@/lib/api"
import { API_BASE_URL } from "@/lib/utils"

export default function UploadForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const editSong = location.state?.song
  const isEdit = !!id || !!editSong

  const [songName, setSongName] = useState("")
  const [artist, setArtist] = useState("")
  const [featuredArtists, setFeaturedArtists] = useState("")
  const [movie, setMovie] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [mp3File, setMp3File] = useState(null)
  const [albumImage, setAlbumImage] = useState(null)
  const [songImage, setSongImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [songImagePreview, setSongImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Pre-fill for edit mode
  useEffect(() => {
    if (editSong) {
      setSongName(editSong.name || "")
      setArtist(editSong.artist || "")
      setFeaturedArtists(editSong.featuredArtists || "")
      setMovie(editSong.movie || "")
      setReleaseYear(editSong.releaseYear || "")
      if (editSong.imagePath) setImagePreview(`${API_BASE_URL}${editSong.imagePath}`)
      if (editSong.songImagePath) setSongImagePreview(`${API_BASE_URL}${editSong.songImagePath}`)
    }
  }, [editSong])

  const handleMp3Upload = (e) => {
    const file = e.target.files[0]
    if (!file || (!file.type.includes("audio") && !file.name.endsWith(".mp3"))) {
      setError("Please upload a valid MP3 file")
      return
    }
    setMp3File(file)
    setLoading(true)
    setError("")

    jsmediatags.read(file, {
      onSuccess: (tag) => {
        const tags = tag.tags
        if (tags.title) setSongName(tags.title)
        if (tags.artist) setArtist(tags.artist)
        if (tags.album) setMovie(tags.album)
        if (tags.year) setReleaseYear(tags.year)

        if (tags.picture) {
          try {
            const { data, format } = tags.picture
            const blob = new Blob([new Uint8Array(data)], { type: format })
            const imageFile = new File([blob], "album-art.jpg", { type: format })
            setAlbumImage(imageFile)
            setImagePreview(URL.createObjectURL(blob))
            setSuccess("Auto-filled song details and album art!")
          } catch (err) {
            console.error("Failed to extract image:", err)
            setSuccess("Auto-filled song details!")
          }
        } else {
          setSuccess("Auto-filled song details!")
        }
        setTimeout(() => setSuccess(""), 3000)
        setLoading(false)
      },
      onError: () => setLoading(false),
    })
  }

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file")
      return
    }
    const url = URL.createObjectURL(file)
    if (type === "album") {
      setAlbumImage(file)
      setImagePreview(url)
    } else {
      setSongImage(file)
      setSongImagePreview(url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!songName || !artist || !movie || (!isEdit && (!mp3File || !albumImage))) {
      setError("Please fill all required fields")
      return
    }

    try {
      setLoading(true)
      setError("")

      const formData = new FormData()
      formData.append("songName", songName)
      formData.append("artist", artist)
      formData.append("movie", movie)
      if (mp3File) formData.append("mp3File", mp3File)
      if (albumImage) formData.append("albumImage", albumImage)
      if (featuredArtists) formData.append("featuredArtists", featuredArtists)
      if (releaseYear) formData.append("releaseYear", releaseYear)
      if (songImage) formData.append("songImage", songImage)

      const songId = editSong?.id || id
      const response = isEdit
        ? await songsApi.update(songId, formData)
        : await songsApi.upload(formData)

      if (!response.ok) throw new Error(`Failed to ${isEdit ? "update" : "upload"} song`)

      setSuccess(`Song ${isEdit ? "updated" : "uploaded"} successfully!`)

      if (!isEdit) {
        setSongName(""); setArtist(""); setFeaturedArtists("")
        setMovie(""); setReleaseYear(""); setMp3File(null)
        setAlbumImage(null); setSongImage(null)
        setImagePreview(null); setSongImagePreview(null)
      }

      setTimeout(() => {
        setSuccess("")
        if (isEdit) navigate("/admin/songs")
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-xl border px-4 py-3 text-sm focus:outline-none transition-colors"
  const inputStyle = { borderColor: "var(--admin-border)", background: "rgba(255,255,255,0.03)", color: "var(--admin-text)" }
  const labelClass = "block text-sm font-medium mb-2"
  const labelStyle = { color: "var(--admin-muted)" }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border transition-colors"
          style={{ borderColor: "var(--admin-border)", color: "var(--admin-muted)" }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--admin-text)" }}>
            {isEdit ? "Edit Song" : "Upload New Song"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--admin-muted)" }}>
            {isEdit ? `Editing "${editSong?.name || ""}"` : "Add a new track to the library"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Song Name */}
        <div>
          <label className={labelClass} style={labelStyle}>Song Name *</label>
          <input type="text" value={songName} onChange={e => setSongName(e.target.value)}
            placeholder="Enter song name" className={inputClass} style={inputStyle} disabled={loading} />
        </div>

        {/* Artist + Featured */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>Primary Artist *</label>
            <input type="text" value={artist} onChange={e => setArtist(e.target.value)}
              placeholder="Artist name" className={inputClass} style={inputStyle} disabled={loading} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Featured Artists</label>
            <input type="text" value={featuredArtists} onChange={e => setFeaturedArtists(e.target.value)}
              placeholder="e.g. Drake, Travis Scott" className={inputClass} style={inputStyle} disabled={loading} />
          </div>
        </div>

        {/* Album + Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>Album / Movie *</label>
            <input type="text" value={movie} onChange={e => setMovie(e.target.value)}
              placeholder="Album or movie name" className={inputClass} style={inputStyle} disabled={loading} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Release Year</label>
            <input type="text" value={releaseYear} onChange={e => setReleaseYear(e.target.value)}
              placeholder="e.g. 2024" className={inputClass} style={inputStyle} disabled={loading} />
          </div>
        </div>

        {/* MP3 Upload */}
        <div>
          <label className={labelClass} style={labelStyle}>MP3 File {!isEdit && "*"}</label>
          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed transition-colors hover:bg-[rgba(255,255,255,0.02)]"
            style={{ borderColor: "var(--admin-border)" }}>
            {mp3File ? (
              <div className="flex items-center gap-2" style={{ color: "var(--admin-text)" }}>
                <Music size={18} />
                <span className="text-sm truncate max-w-xs">{mp3File.name}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload size={24} style={{ color: "var(--admin-muted)" }} className="mb-2" />
                <p className="text-sm" style={{ color: "var(--admin-muted)" }}>
                  {isEdit ? "Upload new MP3 (optional)" : "Click to upload MP3"}
                </p>
              </div>
            )}
            <input type="file" className="hidden" accept=".mp3,audio/mpeg" onChange={handleMp3Upload} disabled={loading} />
          </label>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>Album Cover {!isEdit && "*"}</label>
            <label className="relative flex h-44 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed overflow-hidden transition-colors hover:bg-[rgba(255,255,255,0.02)]"
              style={{ borderColor: "var(--admin-border)" }}>
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Album" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <span className="relative text-xs font-medium px-3 py-1.5 rounded-lg bg-black/60 text-white">Change</span>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload size={24} style={{ color: "var(--admin-muted)" }} className="mb-2" />
                  <p className="text-sm" style={{ color: "var(--admin-muted)" }}>Upload album cover</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, "album")} disabled={loading} />
            </label>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Song Cover (Optional)</label>
            <label className="relative flex h-44 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed overflow-hidden transition-colors hover:bg-[rgba(255,255,255,0.02)]"
              style={{ borderColor: "var(--admin-border)" }}>
              {songImagePreview ? (
                <>
                  <img src={songImagePreview} alt="Song" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <span className="relative text-xs font-medium px-3 py-1.5 rounded-lg bg-black/60 text-white">Change</span>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload size={24} style={{ color: "var(--admin-muted)" }} className="mb-2" />
                  <p className="text-sm" style={{ color: "var(--admin-muted)" }}>Upload song cover</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, "song")} disabled={loading} />
            </label>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl border text-sm" style={{ borderColor: "rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.08)", color: "var(--admin-danger)" }}>
            <X size={16} className="shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-4 rounded-xl border text-sm" style={{ borderColor: "rgba(74,222,128,0.2)", background: "rgba(74,222,128,0.08)", color: "var(--admin-accent)" }}>
            <Check size={16} className="shrink-0" /> {success}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-black disabled:opacity-50 transition-all hover:scale-[1.01]"
          style={{ background: "var(--admin-accent)" }}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : isEdit ? <Save size={18} /> : <Upload size={18} />}
          {isEdit ? "Save Changes" : "Upload Song"}
        </button>
      </form>
    </div>
  )
}
