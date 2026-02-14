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
    if (users.find((u:any)=>u.username === username)) return res.status(409).json({ message: "L'utilisateur existe" })
    const newUser = { username, password, isAdmin: false }
    users.push(newUser)
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2))
    const token = Buffer.from(username).toString('base64')
    res.status(201).json({ token, username })
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement de l'utilisateur" })
  }
}
