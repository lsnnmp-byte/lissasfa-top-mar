import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promises as fs } from 'fs'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
    // recursively list directories under UPLOAD_DIR and return relative paths
    const results: string[] = []
    async function walk(dir: string, rel = '') {
      const items = await fs.readdir(dir, { withFileTypes: true })
      for (const it of items) {
        if (it.isDirectory()) {
          const name = it.name
          const nrel = rel ? `${rel}/${name}` : name
          results.push(nrel)
          await walk(path.join(dir, name), nrel)
        }
      }
    }
    await walk(UPLOAD_DIR)
    return res.status(200).json(results)
  } catch (err) {
    console.error('folders api error', err)
    return res.status(500).json({ message: 'Could not list folders' })
  }
}
