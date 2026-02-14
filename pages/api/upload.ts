import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promises as fs } from 'fs'
import formidable, { File } from 'formidable'

export const config = {
  api: { bodyParser: false },
}

const USERS_PATH = path.join(process.cwd(), 'users.json')
const VIDEOS_PATH = path.join(process.cwd(), 'videos.json')
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

async function ensureUploadDir(){
  try { await fs.access(UPLOAD_DIR) } catch { await fs.mkdir(UPLOAD_DIR, { recursive: true }) }
}

function mvFile(file: File, destPath: string) {
  return fs.rename(file.filepath, destPath)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const token = req.headers['x-token'] as string | undefined
  if (!token) return res.status(401).json({ message: "Jeton manquant" })
  const username = Buffer.from(token, 'base64').toString('utf-8')
  try {
    const udata = await fs.readFile(USERS_PATH, 'utf-8')
    const users = JSON.parse(udata || '[]')
    const user = users.find((u:any)=>u.username === username)
    if (!user || !user.isAdmin) return res.status(403).json({ message: "Seul l'administrateur peut téléverser" })

    await ensureUploadDir()

    const form = formidable({ uploadDir: UPLOAD_DIR, keepExtensions: true })

    form.parse(req, async (err, fields, files) => {
      if (err) { res.status(500).json({ message: "Erreur lors de l'analyse de l'envoi" }); return }
      try {
        const title = (fields.title as string) || ''
        let url = (fields.url as string) || ''
        const folderField = (fields.folder as string) || ''
        const thumbnailField = fields.thumbnail as string | undefined
        const descriptionField = (fields.description as string) || ''

      // handle uploaded files: 'video' and 'thumbnail'
      const getFile = (f:any) => Array.isArray(f) ? f[0] : f

      // create target directory if folder provided (support nested folders like "course/lesson")
      let targetDir = UPLOAD_DIR
      if (folderField) {
        // split on slashes and sanitize each segment
        const parts = String(folderField).split(/[/\\]+/).filter(Boolean).map(p => p.replace(/[^a-zA-Z0-9-_]/g, '_'))
        if (parts.length > 0) {
          targetDir = path.join(UPLOAD_DIR, ...parts)
          try { await fs.access(targetDir) } catch { await fs.mkdir(targetDir, { recursive: true }) }
        }
      }

      if (files && (files as any).video) {
        const fileAny = getFile((files as any).video)
        const srcPath = fileAny?.filepath || fileAny?.filePath || fileAny?.path
        const fallbackName = fileAny?.newFilename || fileAny?.originalFilename || fileAny?.originalname || fileAny?.name
        if (srcPath) {
          const destName = path.basename(srcPath)
          const dest = path.join(targetDir, destName)
          await fs.rename(srcPath, dest)
          const rel = path.relative(path.join(process.cwd(), 'public'), dest).split(path.sep).join('/')
          url = '/' + rel
        } else if (fallbackName) {
          // no temp path provided but we have a name; still record it
          url = '/uploads/' + path.basename(fallbackName)
        }
      }

      let thumbnail: string | null = null
      if (files && (files as any).thumbnail) {
        const tAny = getFile((files as any).thumbnail)
        const tSrc = tAny?.filepath || tAny?.filePath || tAny?.path
        const tfallback = tAny?.newFilename || tAny?.originalFilename || tAny?.originalname || tAny?.name
        if (tSrc) {
          const destName = path.basename(tSrc)
          const dest = path.join(targetDir, destName)
          await fs.rename(tSrc, dest)
          const rel = path.relative(path.join(process.cwd(), 'public'), dest).split(path.sep).join('/')
          thumbnail = '/' + rel
        } else if (tfallback) {
          thumbnail = '/uploads/' + path.basename(tfallback)
        }
      } else if (thumbnailField) {
        thumbnail = thumbnailField
      }

        if (!title || !url) { res.status(400).json({ message: "Champs manquants" }); return }

        const vdata = await fs.readFile(VIDEOS_PATH, 'utf-8')
        const videos = JSON.parse(vdata || '[]')
        const id = String(Date.now())
        videos.push({ id, title, url, thumbnail: thumbnail || null, description: descriptionField || null, uploadedBy: username, views: 0, likes: 0 })
        await fs.writeFile(VIDEOS_PATH, JSON.stringify(videos, null, 2))
        res.status(201).json({ message: 'ok' })
      } catch (e) {
        res.status(500).json({ message: "Erreur lors du traitement de l'envoi" })
      }
    })
  } catch (err) {
    res.status(500).json({ message: "Échec du téléversement" })
  }
}
