import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { ADMIN_COOKIE, expectedToken } from '@/lib/admin'

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }))
  const configured = process.env.ADMIN_PANEL_PASSWORD
  if (!configured || typeof password !== 'string') return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const incoming = Buffer.from(password)
  const expected = Buffer.from(configured)
  const valid = incoming.length === expected.length && timingSafeEqual(incoming, expected)
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, expires: new Date(0), path: '/' })
  return response
}
