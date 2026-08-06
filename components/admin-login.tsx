'use client'

import { FormEvent, useState } from 'react'

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (response.ok) window.location.reload()
    else setError('That password is not correct.')
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 py-16 text-cream">
      <form onSubmit={submit} className="w-full max-w-md border border-line-soft bg-surface p-8 sm:p-10">
        <p className="mb-3 text-[0.65rem] uppercase tracking-luxe text-gold">Private workspace</p>
        <h1 className="font-serif text-4xl">Property manager</h1>
        <p className="mt-4 leading-relaxed text-muted">Sign in to publish properties, choose imagery, and update listing details.</p>
        <label className="mt-8 block text-[0.68rem] uppercase tracking-luxe text-muted">Admin password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="mt-2 w-full border border-line-soft bg-ink px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </label>
        {error ? <p className="mt-3 text-sm text-red-300" role="alert">{error}</p> : null}
        <button type="submit" disabled={loading} className="mt-6 w-full bg-gold px-5 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60">
          {loading ? 'Checking…' : 'Enter workspace'}
        </button>
      </form>
    </main>
  )
}
