import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promises as fs } from 'fs'

const USERS_PATH = path.join(process.cwd(), 'users.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = (req.headers['x-token'] || '') as string
  if (!token) return res.status(401).json({ message: "Jeton manquant" })
  const username = Buffer.from(token, 'base64').toString('utf-8')
  try {
    const data = await fs.readFile(USERS_PATH, 'utf-8')
    const users = JSON.parse(data || '[]')
    const user = users.find((u:any)=>u.username === username)
    if (!user) return res.status(401).json({ message: "Jeton invalide" })
    res.status(200).json({ username: user.username, isAdmin: !!user.isAdmin })
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la lecture des utilisateurs" })
  }
}
