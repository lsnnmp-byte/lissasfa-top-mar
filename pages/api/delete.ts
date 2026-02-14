import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promises as fs } from 'fs'

const USERS_PATH = path.join(process.cwd(), 'users.json')
const VIDEOS_PATH = path.join(process.cwd(), 'videos.json')
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const token = req.headers['x-token'] as string | undefined
  if (!token) return res.status(401).json({ message: 'Missing token' })
  const username = Buffer.from(token, 'base64').toString('utf-8')
  const { id } = req.body || {}
  if (!id) return res.status(400).json({ message: 'Missing id' })
  try {
    const udata = await fs.readFile(USERS_PATH, 'utf-8')
    const users = JSON.parse(udata || '[]')
    const user = users.find((u:any)=>u.username === username)
    if (!user || !user.isAdmin) return res.status(403).json({ message: "Seul l'administrateur peut supprimer" })

    const vdata = await fs.readFile(VIDEOS_PATH, 'utf-8')
    const videos = JSON.parse(vdata || '[]')
    const idx = videos.findIndex((v:any)=>v.id === id)
    if (idx === -1) return res.status(404).json({ message: 'Introuvable' })
    const video = videos[idx]

    // remove files if they are in uploads
    const tryUnlink = async (url?: string|null) => {
      if (!url) return
      if (typeof url !== 'string') return
      if (url.startsWith('/uploads/')) {
        const fpath = path.join(process.cwd(), 'public', url.replace('/uploads/', 'uploads/'))
        try { await fs.unlink(fpath) } catch (_) {}
      }
    }

    await tryUnlink(video.url)
    await tryUnlink(video.thumbnail)

    videos.splice(idx, 1)
    await fs.writeFile(VIDEOS_PATH, JSON.stringify(videos, null, 2))
    res.status(200).json({ message: 'supprimé' })
  } catch (err) {
    res.status(500).json({ message: "Échec de la suppression" })
  }
}
