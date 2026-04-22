import { useState, useEffect, useRef } from "react"

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef(new Audio())

  useEffect(() => {
    const audio = audioRef.current
    const onMeta = () => setDuration(audio.duration)
    const onTime = () => setCurrentTime(audio.currentTime)
    const onEnd = () => setIsPlaying(false)

    audio.addEventListener("loadedmetadata", onMeta)
    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("ended", onEnd)

    return () => {
      audio.removeEventListener("loadedmetadata", onMeta)
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("ended", onEnd)
    }
  }, [])

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const play = () => {
    audioRef.current.play()
    setIsPlaying(true)
  }

  const pause = () => {
    audioRef.current.pause()
    setIsPlaying(false)
  }

  const seek = (time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  const setAudioVolume = (vol) => {
    audioRef.current.volume = vol
    setVolume(vol)
  }

  const loadTrack = (trackUrl) => {
    audioRef.current.src = trackUrl
    audioRef.current.load()
    setIsPlaying(false)
    setCurrentTime(0)
  }

  return { isPlaying, duration, currentTime, volume, togglePlay, play, pause, seek, setAudioVolume, loadTrack }
}
