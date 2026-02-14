export function makeToken(username: string) {
  return Buffer.from(username).toString('base64')
}

export function parseToken(token?: string) {
  if (!token) return null
  try { return Buffer.from(token, 'base64').toString('utf-8') } catch { return null }
}
