import crypto from 'crypto'

export function generateDownloadToken(orderId: string, expiresAt: Date): string {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET!
  const expiry = expiresAt.getTime().toString()
  const payload = `${orderId}:${expiry}`
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return Buffer.from(`${payload}:${hmac}`).toString('base64url')
}

export function validateDownloadToken(token: string): { orderId: string; expiry: number } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8')
    const [orderId, expiryStr, hmac] = decoded.split(':')
    const expiry = parseInt(expiryStr, 10)

    if (Date.now() > expiry) return null

    const secret = process.env.DOWNLOAD_TOKEN_SECRET!
    const payload = `${orderId}:${expiryStr}`
    const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('hex')

    if (hmac !== expectedHmac) return null

    return { orderId, expiry }
  } catch {
    return null
  }
}