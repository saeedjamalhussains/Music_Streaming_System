export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const API_BASE_URL =
  import.meta.env.VITE_BASE_API_URL?.replace(/\/$/, "") || "http://localhost:5050"

export function buildApiUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

export function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 17) return "Good Afternoon"
  if (hour < 21) return "Good Evening"
  return "Night Owl Mode"
}

export function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
