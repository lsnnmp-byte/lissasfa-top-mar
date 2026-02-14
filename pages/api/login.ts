import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promises as fs } from 'fs'

const USERS_PATH = path.join(process.cwd(), 'users.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { username, password } = req.body || {}
  if (!username || !password) return res.status(400).json({ message: "Champs manquants" })
  try {
    const data = await fs.readFile(USERS_PATH, 'utf-8')
    const users = JSON.parse(data || '[]')
    const user = users.find((u:any)=>u.username === username && u.password === password)
    if (!user) return res.status(401).json({ message: "Identifiants invalides" })
    const token = Buffer.from(username).toString('base64')
    res.status(200).json({ token, username, isAdmin: !!user.isAdmin })
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la lecture des utilisateurs" })
  }
}
