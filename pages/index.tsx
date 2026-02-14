import React, { useEffect, useState } from 'react'
import VideoPlayer from '../components/VideoPlayer'
import Comments from '../components/Comments'
import { useRouter } from 'next/router'

type Video = any

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [visibleComments, setVisibleComments] = useState<Record<string, boolean>>({})
  const [showPlayer, setShowPlayer] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState('')
  const [folders, setFolders] = useState<string[]>([])
  const [folderFilter, setFolderFilter] = useState('')
  const router = useRouter()
  const [theme, setTheme] = useState((typeof window !== 'undefined' && localStorage.getItem('theme')) || 'light')
  const [lang, setLangState] = useState((typeof window !== 'undefined' && localStorage.getItem('lang')) || 'fr')

  useEffect(()=>{
    if (typeof window === 'undefined') return
    document.documentElement.classList.remove('light','dark')
    document.documentElement.classList.add(theme === 'dark' ? 'dark' : 'light')
    localStorage.setItem('theme', theme)
    localStorage.setItem('lang', lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  },[theme, lang])

  useEffect(()=>{
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) { router.push('/login'); return }
    fetch('/api/me', { headers: { 'x-token': token } }).then(async r => {
      if (!r.ok) { router.push('/login'); return }
      const d = await r.json()
      setIsAdmin(!!d.isAdmin)
      try {
        const vids = await fetch('/api/videos').then(r=>r.json())
        setVideos(Array.isArray(vids) ? vids : [])
      } catch { setVideos([]) }
      try { const f = await fetch('/api/folders').then(r=>r.json()); setFolders(Array.isArray(f)? f: []) } catch {}
      setLoading(false)
    }).catch(()=>router.push('/login'))
  },[])

  function logout(){ localStorage.removeItem('token'); localStorage.removeItem('username'); router.push('/login') }

  async function recordView(id: string){
    try{ const res = await fetch('/api/view',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); if (res.ok){ const d = await res.json(); setVideos(vs=>vs.map(v=> v.id===id? {...v, views: d.views}: v)) }}catch{}
  }

  async function doLike(id:string){
    try{
      const liked = typeof window !== 'undefined' && !!localStorage.getItem('liked_'+id)
      if (!liked){ const res = await fetch('/api/like',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); if (res.ok){ const d=await res.json(); setVideos(vs=>vs.map(v=> v.id===id? {...v, likes: d.likes}: v)); localStorage.setItem('liked_'+id,'1') } }
      else { const res = await fetch('/api/unlike',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); if (res.ok){ const d=await res.json(); setVideos(vs=>vs.map(v=> v.id===id? {...v, likes: d.likes}: v)); localStorage.removeItem('liked_'+id) } }
    }catch{}
  }

  const q = (search || '').trim().toLowerCase()
  const filtered = videos.filter((v:any)=>{
    if (folderFilter){ if (!v.url) return false; if (!(v.url.includes('/uploads/') && v.url.includes(folderFilter))) return false }
    if (!q) return true
    const title = String(v.title || '')
    const desc = String(v.description || '')
    return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q)
  })

  if (loading) return <div className="container"><h1>Loading...</h1></div>

  return (
    <div className="container">
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <img src="/Untitled-1.svg" alt="logo" style={{width:40,height:40}} />
          <h1 style={{margin:0}}>lissafa top</h1>
        </div>
        <div className="nav">
          <select value={lang} onChange={e=>setLangState(e.target.value)} style={{padding:8,borderRadius:8}}>
            <option value="fr">FR</option>
            <option value="ar">AR</option>
          </select>
          <button onClick={()=>setTheme(t=> t==='dark'?'light':'dark')} className="btn-ghost" style={{marginLeft:8}}>{theme==='dark'?'☀️':'🌙'}</button>
          {isAdmin && <a href="/admin" style={{marginRight:12,marginLeft:12}}>Admin</a>}
          <button onClick={logout} className="btn-ghost">Déconnexion</button>
        </div>
      </header>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginTop:12}}>
        <h2 style={{margin:0}}>Vidéos</h2>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input placeholder="Search videos..." value={search} onChange={e=>setSearch(e.target.value)} style={{padding:8,borderRadius:8,border:'1px solid var(--muted-bg)'}} />
          <select value={folderFilter} onChange={e=>setFolderFilter(e.target.value)} style={{padding:8,borderRadius:8}}>
            <option value="">All folders</option>
            {folders.map(f=> <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {folders.length>0 && (
        <div style={{marginTop:12,display:'flex',gap:8,flexWrap:'wrap'}}>
          {folders.map(f=> <button key={f} className={f===folderFilter ? 'btn-primary':'btn-outline'} onClick={()=>setFolderFilter(f)} style={{padding:'6px 10px'}}>{f}</button>)}
          {folderFilter && <button className="btn-ghost" onClick={()=>setFolderFilter('')}>Clear</button>}
        </div>
      )}

      {filtered.length === 0 && <p className="small">No videos found.</p>}

      {filtered.map((v:any) => {
        const titleStr = Array.isArray(v.title) ? v.title[0] : (v.title || '')
        return (
          <div key={v.id} className="video-item">
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{position:'relative'}}>
                {v.thumbnail ? <img src={v.thumbnail} className="thumb" alt={titleStr} loading="lazy" /> : <div className="thumb" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>{titleStr}</div>}
                {!showPlayer[v.id] && v.url && v.url.endsWith('.mp4') && (
                  <button onClick={()=>setShowPlayer(s=>({...s,[v.id]:true}))} className="player-btn" style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>Play</button>
                )}
              </div>
              <div style={{flex:1}}>
                {showPlayer[v.id] && v.url && v.url.endsWith('.mp4') && <VideoPlayer src={v.url} poster={v.thumbnail||undefined} onPlay={()=>recordView(v.id)} />}
                <div style={{marginTop:8}}><strong>{titleStr}</strong></div>
                {v.description && <div className="small" style={{marginTop:6}}>{v.description}</div>}
                <div style={{display:'flex',gap:12,alignItems:'center',marginTop:8}}>
                  <div className="small">Vues : {v.views || 0}</div>
                  <div className="small">Likes : {v.likes || 0}</div>
                  <button onClick={()=>doLike(v.id)} className="player-btn">❤</button>
                </div>
                {v.uploadedBy && <div className="small">Publié par : {v.uploadedBy}</div>}
                <div style={{marginTop:10}}>
                  <button className="btn-ghost" onClick={()=>setVisibleComments(s=>({...s,[v.id]: !s[v.id]}))}>{visibleComments[v.id] ? 'Hide comments':'Show comments'}</button>
                  {visibleComments[v.id] && <div style={{marginTop:8}}><Comments videoId={v.id} currentUser={typeof window !== 'undefined' ? localStorage.getItem('username') : null} /></div>}
                </div>
              </div>
            </div>
          </div>
        )
      })}

    </div>
  )
}
