import axios from 'axios'
import { API_BASE_URL, buildApiUrl } from './utils'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// ─── Auth ───
export const authApi = {
  login: (email, password) => api.post('/user/signin', { email, password }),
  sendOtp: (email) => api.post('/user/send-otp', { email }),
  signup: (data) => api.post('/user/signup', data),
}

// ─── Songs ───
export const songsApi = {
  getAll: () => fetch(buildApiUrl('/api/songs')).then(r => r.ok ? r.json() : []),
  
  upload: (formData) => fetch(buildApiUrl('/api/songs/upload'), {
    method: 'POST',
    body: formData,
  }),
  
  update: (id, formData) => fetch(buildApiUrl(`/api/songs/${id}`), {
    method: 'PUT',
    body: formData,
  }),
  
  delete: (id) => fetch(buildApiUrl(`/api/songs/${id}`), {
    method: 'DELETE',
  }),
}

// ─── Playlists ───
export const playlistsApi = {
  getUserPlaylists: (userId) => 
    fetch(buildApiUrl(`/api/playlists/user/${userId}`)).then(r => r.ok ? r.json() : []),
  
  getPlaylistDetails: (userId, playlistName) =>
    fetch(buildApiUrl(`/api/playlists/get?userId=${userId}&playlistName=${encodeURIComponent(playlistName)}`))
      .then(r => r.ok ? r.json() : null),
  
  create: (userId, playlistName) => 
    fetch(buildApiUrl('/api/playlists/create'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, playlistName }),
    }).then(r => r.ok ? r.json() : null),
  
  addSong: (userId, playlistName, songName) =>
    fetch(buildApiUrl('/api/playlists/addSong'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, playlistName, songName }),
    }),
}

export default api
