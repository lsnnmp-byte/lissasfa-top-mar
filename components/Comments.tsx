import React, { useEffect, useState } from 'react'

export default function Comments({ videoId, currentUser }:{ videoId:string, currentUser:string|null }){
  const [comments, setComments] = useState<Array<any>>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch(`/api/comments?videoId=${encodeURIComponent(videoId)}`)
      .then(r=>r.json())
      .then(setComments)
      .catch(()=>setComments([]))
      .finally(()=>setLoading(false))
  },[videoId])

  async function post(){
    const token = localStorage.getItem('token')
    if (!token) return alert('Connectez-vous')
    if (!text.trim()) return
    const res = await fetch('/api/comments', { method:'POST', headers: {'Content-Type':'application/json', 'x-token': token}, body: JSON.stringify({ videoId, text }) })
    if (res.ok){
      const c = await res.json()
      setComments(cs => [...cs, c])
      setText('')
    }
  }

  async function del(commentId:string){
    const token = localStorage.getItem('token')
    if (!token) return
    if (!confirm('Supprimer ce commentaire ?')) return
    const res = await fetch('/api/comments', { method:'DELETE', headers: {'Content-Type':'application/json', 'x-token': token}, body: JSON.stringify({ videoId, commentId }) })
    if (res.ok) setComments(cs => cs.filter((c:any)=>c.id !== commentId))
  }

  if (loading) return null

  // Hide comment section for users who are not logged in
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null
  if (!username) return <div className="small">Connectez-vous pour voir et poster des commentaires.</div>

  return (
    <div>
      <div style={{marginBottom:8}}>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Écrire un commentaire..." style={{width:'100%',minHeight:60,padding:8,borderRadius:8}} />
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
          <button onClick={post} className="btn-ghost">Publier</button>
        </div>
      </div>
      <div>
        {comments.length === 0 && <div className="small">Aucun commentaire</div>}
        {comments.map((c:any)=> (
          <div key={c.id} style={{padding:'8px 0',borderBottom:'1px solid var(--muted-bg)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <strong>{c.author}</strong>
              <div className="small">{new Date(c.createdAt).toLocaleString()}</div>
            </div>
            <div style={{marginTop:6}}>{c.text}</div>
            {c.author === username && <div style={{marginTop:6}}><button onClick={()=>del(c.id)} className="btn-ghost">Supprimer</button></div>}
          </div>
        ))}
      </div>
    </div>
  )
}
