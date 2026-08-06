import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'grand_admin_session'

function expectedToken() {
  const password = process.env.ADMIN_PANEL_PASSWORD
  if (!password) throw new Error('ADMIN_PANEL_PASSWORD is not configured')
  return createHmac('sha256', password).update('grand-admin-session').digest('hex')
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!token) return false
  const expected = expectedToken()
  if (token.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) throw new Error('Unauthorized')
}

export { ADMIN_COOKIE, expectedToken }
