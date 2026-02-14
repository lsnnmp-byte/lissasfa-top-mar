import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promises as fs } from 'fs'

const VIDEOS_PATH = path.join(process.cwd(), 'videos.json')
const USERS_PATH = path.join(process.cwd(), 'users.json')

// Single comments API: comments are stored inside each video entry (videos.json)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { videoId } = req.query || {}
      if (!videoId) return res.status(400).json({ message: 'Missing videoId' })
      const data = await fs.readFile(VIDEOS_PATH, 'utf-8')
      const videos = JSON.parse(data || '[]')
      const v = videos.find((x: any) => x.id === String(videoId))
      if (!v) return res.status(404).json({ message: 'Not found' })
      return res.status(200).json(v.comments || [])
    }

    if (req.method === 'POST') {
      const token = req.headers['x-token'] as string | undefined
      if (!token) return res.status(401).json({ message: 'Missing token' })
      const username = Buffer.from(token, 'base64').toString('utf-8')
      const udata = await fs.readFile(USERS_PATH, 'utf-8')
      const users = JSON.parse(udata || '[]')
      const user = users.find((u: any) => u.username === username)
      if (!user) return res.status(401).json({ message: 'Invalid token' })

      const { videoId, text } = req.body || {}
      if (!videoId || !text) return res.status(400).json({ message: 'Missing fields' })
      const vdata = await fs.readFile(VIDEOS_PATH, 'utf-8')
      const videos = JSON.parse(vdata || '[]')
      const v = videos.find((x: any) => x.id === String(videoId))
      if (!v) return res.status(404).json({ message: 'Not found' })

      const comment = {
        id: String(Date.now()) + Math.random().toString(36).slice(2, 8),
        text,
        author: user.username,
        createdAt: new Date().toISOString(),
      }
      v.comments = v.comments || []
      v.comments.push(comment)
      await fs.writeFile(VIDEOS_PATH, JSON.stringify(videos, null, 2))
      return res.status(201).json(comment)
    }

    if (req.method === 'DELETE') {
      const token = req.headers['x-token'] as string | undefined
      if (!token) return res.status(401).json({ message: 'Missing token' })
      const username = Buffer.from(token, 'base64').toString('utf-8')
      const udata = await fs.readFile(USERS_PATH, 'utf-8')
      const users = JSON.parse(udata || '[]')
      const user = users.find((u: any) => u.username === username)
      if (!user) return res.status(401).json({ message: 'Invalid token' })

      const { videoId, commentId } = req.body || {}
      if (!videoId || !commentId) return res.status(400).json({ message: 'Missing fields' })
      const vdata = await fs.readFile(VIDEOS_PATH, 'utf-8')
      const videos = JSON.parse(vdata || '[]')
      const v = videos.find((x: any) => x.id === String(videoId))
      if (!v) return res.status(404).json({ message: 'Not found' })
      v.comments = v.comments || []
      const idx = v.comments.findIndex((c: any) => c.id === String(commentId))
      if (idx === -1) return res.status(404).json({ message: 'Comment not found' })
      const comment = v.comments[idx]
      if (comment.author !== user.username && !user.isAdmin) return res.status(403).json({ message: 'Forbidden' })
      v.comments.splice(idx, 1)
      await fs.writeFile(VIDEOS_PATH, JSON.stringify(videos, null, 2))
      return res.status(200).json({ message: 'deleted' })
    }

    res.setHeader('Allow', 'GET, POST, DELETE')
    return res.status(405).end('Method Not Allowed')
  } catch (err) {
    console.error('comments api error', err)
    return res.status(500).json({ message: 'Comments error' })
  }
}
