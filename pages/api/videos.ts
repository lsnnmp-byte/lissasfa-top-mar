import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promises as fs } from 'fs'

const VIDEOS_PATH = path.join(process.cwd(), 'videos.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await fs.readFile(VIDEOS_PATH, 'utf-8')
      const videos = JSON.parse(data || '[]')
      res.status(200).json(videos)
    } catch (err) {
      res.status(500).json({ message: "Impossible de lire les vidéos" })
    }
  } else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method Not Allowed')
  }
}
