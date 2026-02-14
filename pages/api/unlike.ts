import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promises as fs } from 'fs'

const VIDEOS_PATH = path.join(process.cwd(), 'videos.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { id } = req.body || {}
  if (!id) return res.status(400).json({ message: 'Missing id' })
  try {
    const data = await fs.readFile(VIDEOS_PATH, 'utf-8')
    const videos = JSON.parse(data || '[]')
    const v = videos.find((x: any) => x.id === id)
    if (!v) return res.status(404).json({ message: 'Not found' })
    v.likes = Math.max(0, (v.likes || 0) - 1)
    await fs.writeFile(VIDEOS_PATH, JSON.stringify(videos, null, 2))
    return res.status(200).json({ id, likes: v.likes })
  } catch (err) {
    console.error('unlike error', err)
    return res.status(500).json({ message: 'Could not update likes' })
  }
}
