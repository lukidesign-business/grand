'use client'

import { useState } from 'react'

type Property = {
  id: string
  slug: string
  name: string
  status: string
  propertyType: string
  bedrooms: number
  location: string
  price: string
  description: string
  coverImageUrl: string
  galleryImageUrls: string[]
  isPublished: boolean
}

const initialForm = {
  name: '', slug: '', status: 'Ready to move', propertyType: 'Condominium', bedrooms: '1', location: 'Pattaya, Thailand', price: '', description: '', coverImageUrl: '', galleryImageUrls: [] as string[], isPublished: true,
}

export function AdminPropertyDashboard({ initialProperties }: { initialProperties: Property[] }) {
  const [properties, setProperties] = useState(initialProperties)
  const [form, setForm] = useState(initialForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function update(key: keyof typeof initialForm, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setMessage('')
    const urls: string[] = []
    for (const file of files) {
      const body = new FormData()
      body.append('file', file)
      const response = await fetch('/api/admin/upload', { method: 'POST', body })
      const result = await response.json()
      if (!response.ok) { setMessage(result.error ?? 'Image upload failed'); setUploading(false); return }
      urls.push(result.url)
    }
    setForm((current) => ({ ...current, coverImageUrl: current.coverImageUrl || urls[0], galleryImageUrls: [...current.galleryImageUrls, ...urls] }))
    setUploading(false)
    setMessage(`${urls.length} image${urls.length === 1 ? '' : 's'} uploaded.`)
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    const response = await fetch('/api/admin/properties', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...form, bedrooms: Number(form.bedrooms) }) })
    const result = await response.json()
    if (!response.ok) setMessage(result.error ?? 'Unable to publish property')
    else {
      setProperties((current) => [result, ...current.filter((property) => property.id !== result.id)])
      setForm(initialForm)
      setMessage('Property published.')
    }
    setSaving(false)
  }

  async function toggle(property: Property) {
    const response = await fetch('/api/admin/properties', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: property.id, isPublished: !property.isPublished }) })
    if (!response.ok) return
    setProperties((current) => current.map((item) => item.id === property.id ? { ...item, isPublished: !item.isPublished } : item))
  }

  return (
    <main className="min-h-screen bg-ink px-5 py-10 text-cream sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5 border-b border-line-soft pb-8">
          <div><p className="text-[0.65rem] uppercase tracking-luxe text-gold">Private workspace</p><h1 className="mt-2 font-serif text-4xl">Property manager</h1></div>
          <button onClick={() => fetch('/api/admin/login', { method: 'DELETE' }).then(() => window.location.reload())} className="text-xs uppercase tracking-luxe text-muted hover:text-gold">Sign out</button>
        </header>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.6fr)]">
          <form onSubmit={save} className="border border-line-soft bg-surface p-6 sm:p-8">
            <p className="text-[0.65rem] uppercase tracking-luxe text-gold">Create or update</p><h2 className="mt-2 font-serif text-2xl">Publish a property</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="text-xs uppercase tracking-wide text-muted">Property name<input value={form.name} onChange={(e) => update('name', e.target.value)} className="admin-input" required /></label>
              <label className="text-xs uppercase tracking-wide text-muted">Slug<input value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="auto-generated" className="admin-input" /></label>
              <label className="text-xs uppercase tracking-wide text-muted">Status<select value={form.status} onChange={(e) => update('status', e.target.value)} className="admin-input"><option>Ready to move</option><option>Under construction</option><option>Resale</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Property type<select value={form.propertyType} onChange={(e) => update('propertyType', e.target.value)} className="admin-input"><option>Condominium</option><option>Villa</option><option>House</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Bedrooms<select value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="admin-input"><option value="0">Studio</option><option value="1">1 bedroom</option><option value="2">2 bedrooms</option><option value="3">3 bedrooms</option><option value="4">4 bedrooms</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Location<select value={form.location} onChange={(e) => update('location', e.target.value)} className="admin-input"><option>Pattaya, Thailand</option><option>Jomtien, Thailand</option><option>Bangkok, Thailand</option><option>Phuket, Thailand</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Price<input value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="From ฿3.9M" className="admin-input" required /></label>
              <label className="text-xs uppercase tracking-wide text-muted sm:col-span-2">Description<textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} className="admin-input" required /></label>
            </div>
            <label className="mt-6 block border border-dashed border-line-strong p-5 text-sm text-muted">Upload cover and gallery images<input type="file" accept="image/*" multiple onChange={upload} className="mt-3 block w-full text-xs" />{uploading ? <span className="mt-2 block text-gold">Uploading…</span> : null}</label>
            {form.galleryImageUrls.length ? <div className="mt-4 grid grid-cols-4 gap-2">{form.galleryImageUrls.map((url) => <img key={url} src={url} alt="Uploaded property preview" className="aspect-square w-full object-cover" />)}</div> : null}
            {message ? <p className="mt-4 text-sm text-gold" role="status">{message}</p> : null}
            <button type="submit" disabled={saving || uploading} className="mt-7 w-full bg-gold px-5 py-3 text-sm font-medium text-ink disabled:opacity-60">{saving ? 'Publishing…' : 'Publish property'}</button>
          </form>
          <aside><p className="text-[0.65rem] uppercase tracking-luxe text-gold">Catalog</p><h2 className="mt-2 font-serif text-2xl">Live properties</h2><div className="mt-5 grid gap-3">{properties.map((property) => <article key={property.id} className="border border-line-soft bg-surface p-4"><div className="flex gap-4"><img src={property.coverImageUrl} alt="" className="size-20 shrink-0 object-cover" /><div className="min-w-0"><h3 className="font-serif text-lg">{property.name}</h3><p className="mt-1 text-xs text-muted">{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bedroom`} · {property.status}</p><button onClick={() => toggle(property)} className="mt-3 text-[0.65rem] uppercase tracking-luxe text-gold">{property.isPublished ? 'Unpublish' : 'Publish'}</button></div></div></article>)}</div></aside>
        </div>
      </div>
    </main>
  )
}
