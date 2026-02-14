import React, { useRef, useState, useEffect } from 'react'

type Props = { src: string; poster?: string; onPlay?: ()=>void }

export default function VideoPlayer({ src, poster, onPlay }: Props){
  const ref = useRef<HTMLVideoElement|null>(null)
  const [playing, setPlaying] = useState(false)
  const [loop, setLoop] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(()=>{
    const v = ref.current
    if (!v) return
    const onTime = () => setProgress((v.currentTime / (v.duration || 1)) * 100)
    v.addEventListener('timeupdate', onTime)
    return () => v.removeEventListener('timeupdate', onTime)
  },[])

  useEffect(()=>{
    const handler = (e: KeyboardEvent) => {
      // toggle play/pause on Space when in fullscreen
      if (e.code === 'Space' || e.key === ' ') {
        const el = document.fullscreenElement
        if (!el) return
        // if the video element or parent is fullscreen
        const v = ref.current
        if (!v) return
        if (el === v || el === v.parentElement || (v.parentElement && v.parentElement.contains(el))) {
          e.preventDefault()
          if (v.paused) { v.play(); setPlaying(true); onPlay && onPlay() }
          else { v.pause(); setPlaying(false) }
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  },[])

  function togglePlay(){
    const v = ref.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true); onPlay && onPlay() }
    else { v.pause(); setPlaying(false) }
  }

  function toggleLoop(){
    const v = ref.current
    if (!v) return
    v.loop = !v.loop
    setLoop(v.loop)
  }

  function goFull(){
    const v = ref.current
    if (!v) return
    const el = v.parentElement || v
    if (el.requestFullscreen) el.requestFullscreen()
    // fallback handled by browser
  }

  function seek(e: React.MouseEvent<HTMLDivElement>){
    const v = ref.current
    if (!v) return
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    v.currentTime = (v.duration || 0) * x
  }

  return (
    <div className="player">
      <video ref={ref} src={src} poster={poster} className="player-video" preload="metadata" />
      <div className="player-controls">
        <button className="player-btn" onClick={togglePlay}>{playing ? '❚❚' : '▶'}</button>
        <div className="player-progress" onClick={seek} role="progressbar">
          <div className="player-progress-bar" style={{width: `${progress}%`}} />
        </div>
        <button className="player-btn" onClick={toggleLoop}>{loop ? '🔁' : '↻'}</button>
        <button className="player-btn" onClick={goFull}>⤢</button>
      </div>
    </div>
  )
}
