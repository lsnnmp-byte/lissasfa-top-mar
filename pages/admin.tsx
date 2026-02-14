import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Admin() {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [thumbnail, setThumbnail] = useState('')
    const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [folder, setFolder] = useState('')
  const [folders, setFolders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    fetch('/api/me', { headers: { 'x-token': token } })
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) { router.push('/login'); return }
        setIsAdmin(!!d.isAdmin)
      })
      .catch(()=>router.push('/login'))
      .finally(()=>setLoading(false))
  },[])

  useEffect(()=>{
    // fetch existing folders for uploads
    fetch('/api/folders').then(r=>r.json()).then((data:any)=>{
      setFolders(Array.isArray(data) ? data : [])
    }).catch(()=>setFolders([]))
  },[])

  useEffect(()=>{
    // fetch existing videos for admin management
    const token = localStorage.getItem('token')
    if (!token) return
    fetch('/api/videos', { headers: { 'x-token': token } }).then(r=>r.json()).then((data:any)=>{
      // store in local state for delete UI
      setList(data || [])
    }).catch(()=>{})
  },[])

  async function submit(e:any){
    e.preventDefault()
    const token = localStorage.getItem('token')
      const fd = new FormData()
      fd.append('title', title)
      fd.append('url', url)
      if (folder) fd.append('folder', folder)
      if (thumbnail) fd.append('thumbnail', thumbnail)
      if (description) fd.append('description', description)
      // if file inputs exist, they will be appended below
      const videoInput = (document.getElementById('video-file') as HTMLInputElement | null)
      const thumbInput = (document.getElementById('thumb-file') as HTMLInputElement | null)
      if (videoInput && videoInput.files && videoInput.files[0]) fd.append('video', videoInput.files[0])
      if (thumbInput && thumbInput.files && thumbInput.files[0]) fd.append('thumbnail', thumbInput.files[0])

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-token': token || '' },
        body: fd
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('Uploaded')
        setTitle('')
        setUrl('')
        setThumbnail('')
        setFolder('')
        const v = document.getElementById('video-file') as HTMLInputElement | null
        const t = document.getElementById('thumb-file') as HTMLInputElement | null
        if (v) v.value = ''
        if (t) t.value = ''
      } else {
        setMessage(data.message || 'Upload failed')
      }
  }

  const [list, setList] = useState<Array<any>>([])

  async function deleteVideo(id:string){
    const token = localStorage.getItem('token')
    if (!token) return
    if (!confirm('Supprimer cette vidéo ?')) return
    const res = await fetch('/api/delete', { method:'POST', headers: {'Content-Type':'application/json', 'x-token': token}, body: JSON.stringify({ id }) })
    if (res.ok) {
      setList(l => l.filter(x=>x.id !== id))
      setMessage('Deleted')
    } else {
      const d = await res.json().catch(()=>({}))
      setMessage(d.message || 'Delete failed')
    }
  }

  if (loading) return <div className="container"><h1>Chargement...</h1></div>
  if (!isAdmin) return <div className="container"><h1>Page introuvable</h1><p className="small">La page demandée est introuvable.</p></div>

  return (
    <div className="container">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
        <button onClick={() => router.back()} className="back-btn">←</button>
        <h1 style={{margin:0}}>Admin - Télécharger une vidéo</h1>
      </div>
      <form onSubmit={submit}>
        <div className="field">
          <label>Titre</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label>Dossier (optionnel)</label>
          <input list="folders" placeholder="Enter folder name or choose..." value={folder} onChange={e=>setFolder(e.target.value)} />
          <datalist id="folders">
            {folders.map(f => <option key={f} value={f}>{f}</option>)}
          </datalist>
        </div>
        <div className="field">
          <label>URL de la vidéo (YouTube ou lien de fichier)</label>
          <input value={url} onChange={e=>setUrl(e.target.value)} />
        </div>
        <div className="field">
          <label>Ou téléverser un fichier MP4</label>
          <input id="video-file" type="file" accept="video/mp4" />
        </div>
        <div className="field">
          <label>URL de la miniature (facultatif)</label>
          <input placeholder="https://.../thumb.jpg" value={thumbnail} onChange={e=>setThumbnail(e.target.value)} />
        </div>
          <div className="field">
            <label>Description</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} />
          </div>
        <div className="field">
          <label>Ou téléverser une miniature PNG</label>
          <input id="thumb-file" type="file" accept="image/png,image/*" />
        </div>
        <button type="submit">Téléverser</button>
      </form>
      {message && <div style={{marginTop:12}}>{message}</div>}

      <section style={{marginTop:28}}>
        <h2>Gérer les vidéos</h2>
        {list.length === 0 && <p className="small">Pas de vidéos</p>}
        {list.map(v=> (
          <div key={v.id} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 0',borderBottom:'1px solid #f0f2f6'}}>
            <div style={{flex:1}}>
              <strong>{v.title}</strong>
              <div className="small">Vues : {v.views || 0} · Publié par : {v.uploadedBy}</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <a href={v.url} target="_blank" rel="noreferrer">Ouvrir</a>
              <button onClick={()=>deleteVideo(v.id)} className="btn-ghost">Supprimer</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
