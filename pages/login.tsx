import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (!token) return
    fetch('/api/me', { headers: { 'x-token': token } }).then(r=>{ if (r.ok) router.push('/') })
  },[])

  async function submit(e:any) {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (res.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      router.push('/')
    } else {
      setError(data.message || 'Login failed')
    }
  }

  return (
    <div className="container">
      <h1>lissasfa-top</h1>
      <p className="lead">Connexion</p>
      <form onSubmit={submit}>
        <div className="field">
          <label>Nom d'utilisateur</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div className="field">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit">Se connecter</button>
      </form>
      <p style={{marginTop:12}}>Pas de compte ? <a href="/signup">S'inscrire</a></p>
    </div>
  )
}
