import { NextRequest } from 'next/server'

/**
 * Authorizes privileged (admin) requests.
 *
 * The client sends the admin password in an `x-admin-key` header. We compare it
 * to the ADMIN_PASSWORD environment variable.
 *
 * Fails CLOSED: if ADMIN_PASSWORD is not configured, no request is ever treated
 * as authorized. Set ADMIN_PASSWORD in your environment (e.g. Vercel project
 * settings) to enable the admin panel and product mutations.
 */
export function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const provided = req.headers.get('x-admin-key')
  return !!provided && provided === expected
}
