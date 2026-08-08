'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

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
  mapImageUrl: string | null
  areaSqm: number | null
  isPublished: boolean
}

type PropertyForm = {
  name: string
  slug: string
  status: string
  propertyType: string
  bedrooms: string
  location: string
  price: string
  description: string
  coverImageUrl: string
  galleryImageUrls: string[]
  mapImageUrl: string
  areaSqm: string
  isPublished: boolean
}

const initialForm: PropertyForm = {
  name: '', slug: '', status: 'Ready to move', propertyType: 'Condominium', bedrooms: '1', location: 'Pattaya, Thailand', price: '', description: '', coverImageUrl: '', galleryImageUrls: [], mapImageUrl: '', areaSqm: '', isPublished: true,
}

export function AdminPropertyDashboard({ initialProperties }: { initialProperties: Property[] }) {
  const [properties, setProperties] = useState(initialProperties)
  const [form, setForm] = useState(initialForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploadKind, setUploadKind] = useState<'gallery' | 'map'>('gallery')

  function update(key: keyof PropertyForm, value: string | boolean | string[]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const validStatuses = ['Ready to move', 'Under construction', 'Resale']
  const validPropertyTypes = ['Condominium', 'Villa', 'House']

  function editProperty(property: Property) {
    setEditingId(property.id)
    setForm({
      name: property.name,
      slug: property.slug,
      status: validStatuses.includes(property.status) ? property.status : 'Ready to move',
      propertyType: validPropertyTypes.includes(property.propertyType) ? property.propertyType : 'Condominium',
      bedrooms: String(property.bedrooms),
      location: property.location,
      price: property.price,
      description: property.description,
      coverImageUrl: property.coverImageUrl,
      galleryImageUrls: property.galleryImageUrls,
      mapImageUrl: property.mapImageUrl ?? '',
      areaSqm: property.areaSqm ? String(property.areaSqm) : '',
      isPublished: property.isPublished,
    })
    setMessage(`Editing “${property.name}” — update the fields below.`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setForm(initialForm)
    setMessage('Ready to create a new property.')
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>, kind: 'gallery' | 'map') {
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
    if (kind === 'map') {
      setForm((current) => ({ ...current, mapImageUrl: urls[0] }))
    } else {
      setForm((current) => ({ ...current, coverImageUrl: current.coverImageUrl || urls[0], galleryImageUrls: [...current.galleryImageUrls, ...urls] }))
    }
    setUploading(false)
    setMessage(`${urls.length} image${urls.length === 1 ? '' : 's'} uploaded.`)
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    const response = await fetch('/api/admin/properties', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...form, id: editingId, bedrooms: Number(form.bedrooms), areaSqm: form.areaSqm ? Number(form.areaSqm) : null }) })
    const result = await response.json()
    if (!response.ok) setMessage(result.error ?? 'Unable to publish property')
    else {
      setProperties((current) => [result, ...current.filter((property) => property.id !== result.id)])
      setEditingId(null)
      setForm(initialForm)
      setMessage(editingId ? 'Property updated.' : 'Property published.')
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
          <div className="flex items-center gap-4"><button type="button" onClick={resetForm} className="text-xs uppercase tracking-luxe text-gold transition hover:translate-y-[-1px]">+ New listing</button><button onClick={() => fetch('/api/admin/login', { method: 'DELETE' }).then(() => window.location.reload())} className="text-xs uppercase tracking-luxe text-muted transition hover:text-gold">Sign out</button></div>
        </header>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.6fr)]">
          <form onSubmit={save} className={`border border-line-soft bg-surface p-6 transition-all duration-500 sm:p-8 ${editingId ? 'ring-1 ring-gold/70 shadow-[0_0_0_1px_rgba(205,171,89,0.2),0_18px_60px_rgba(0,0,0,0.22)]' : ''}`}>
            <div className="flex items-start justify-between gap-4"><div><p className="text-[0.65rem] uppercase tracking-luxe text-gold">{editingId ? 'Editing listing' : 'Create or update'}</p><h2 className="mt-2 font-serif text-2xl">{editingId ? 'Update property' : 'Publish a property'}</h2></div>{editingId ? <span className="animate-pulse border border-gold/50 px-2 py-1 text-[0.6rem] uppercase tracking-luxe text-gold">Edit mode</span> : null}</div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="text-xs uppercase tracking-wide text-muted">Property name<input value={form.name} onChange={(e) => update('name', e.target.value)} className="admin-input" required /></label>
              <label className="text-xs uppercase tracking-wide text-muted">Slug<input value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="auto-generated" className="admin-input" /></label>
              <label className="text-xs uppercase tracking-wide text-muted">Status<select value={form.status} onChange={(e) => update('status', e.target.value)} className="admin-input"><option>Ready to move</option><option>Under construction</option><option>Resale</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Property type<select value={form.propertyType} onChange={(e) => update('propertyType', e.target.value)} className="admin-input"><option>Condominium</option><option>Villa</option><option>House</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Bedrooms<select value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="admin-input"><option value="0">Studio</option><option value="1">1 bedroom</option><option value="2">2 bedrooms</option><option value="3">3 bedrooms</option><option value="4">4 bedrooms</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Location<select value={form.location} onChange={(e) => update('location', e.target.value)} className="admin-input"><option>Pattaya, Thailand</option><option>Jomtien, Thailand</option><option>Bangkok, Thailand</option><option>Phuket, Thailand</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Size in m²<input type="number" min="0" value={form.areaSqm} onChange={(e) => update('areaSqm', e.target.value)} placeholder="65" className="admin-input" /></label>
              <label className="text-xs uppercase tracking-wide text-muted">Price<input value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="Price available on request" className="admin-input" /></label>
              <label className="text-xs uppercase tracking-wide text-muted sm:col-span-2">Description<textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} className="admin-input" required /></label>
            </div>
            <label className="mt-6 block border border-dashed border-line-strong p-5 text-sm text-muted">Upload cover and gallery images<input type="file" accept="image/*" multiple onChange={(event) => { setUploadKind('gallery'); upload(event, 'gallery') }} className="mt-3 block w-full text-xs" />{uploading && uploadKind === 'gallery' ? <span className="mt-2 block text-gold">Uploading…</span> : null}</label>
            {form.coverImageUrl ? <div className="mt-4"><p className="mb-2 text-xs uppercase tracking-wide text-muted">Cover image</p><div className="group relative max-w-xs overflow-hidden"><img src={form.coverImageUrl} alt="Cover preview" className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" /><button type="button" aria-label="Remove cover image" onClick={() => update('coverImageUrl', '')} className="absolute right-2 top-2 grid size-8 place-items-center bg-ink/85 text-cream transition hover:bg-gold hover:text-ink"><X className="size-4" /></button></div></div> : null}
            {form.galleryImageUrls.length ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{form.galleryImageUrls.map((url, index) => <div key={`${url}-${index}`} className="group relative overflow-hidden"><img src={url} alt={`Uploaded property image ${index + 1}`} className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" /><button type="button" aria-label={`Remove gallery image ${index + 1}`} onClick={() => update('galleryImageUrls', form.galleryImageUrls.filter((_, imageIndex) => imageIndex !== index))} className="absolute right-1 top-1 grid size-7 place-items-center bg-ink/85 text-cream opacity-90 transition hover:bg-gold hover:text-ink"><X className="size-4" /></button></div>)}</div> : null}
            <label className="mt-5 block border border-dashed border-line-strong p-5 text-sm text-muted">Location map image<input type="file" accept="image/*" onChange={(event) => { setUploadKind('map'); upload(event, 'map') }} className="mt-3 block w-full text-xs" />{uploading && uploadKind === 'map' ? <span className="mt-2 block text-gold">Uploading…</span> : null}</label>
            {form.mapImageUrl ? <div className="group relative mt-4 overflow-hidden"><img src={form.mapImageUrl} alt="Location map preview" className="aspect-[16/7] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" /><button type="button" aria-label="Remove location map image" onClick={() => update('mapImageUrl', '')} className="absolute right-2 top-2 grid size-8 place-items-center bg-ink/85 text-cream transition hover:bg-gold hover:text-ink"><X className="size-4" /></button></div> : null}
            {message ? <p className="mt-4 text-sm text-gold" role="status">{message}</p> : null}
            <div className="mt-7 flex gap-3"><button type="submit" disabled={saving || uploading} className="flex-1 bg-gold px-5 py-3 text-sm font-medium text-ink disabled:opacity-60">{saving ? 'Saving…' : editingId ? 'Update property' : 'Publish property'}</button>{editingId ? <button type="button" onClick={resetForm} className="border border-line-strong px-5 py-3 text-sm text-muted hover:text-cream">Cancel</button> : null}</div>
          </form>
          <aside><p className="text-[0.65rem] uppercase tracking-luxe text-gold">Catalog</p><h2 className="mt-2 font-serif text-2xl">Live properties</h2><div className="mt-5 grid gap-3">{properties.map((property) => <article key={property.id} className="border border-line-soft bg-surface p-4"><div className="flex gap-4"><img src={property.coverImageUrl} alt="" className="size-20 shrink-0 object-cover" /><div className="min-w-0"><h3 className="font-serif text-lg">{property.name}</h3><p className="mt-1 text-xs text-muted">{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bedroom`} · {property.status}</p><div className="mt-3 flex flex-wrap gap-3"><button onClick={() => editProperty(property)} className="text-[0.65rem] uppercase tracking-luxe text-gold">Edit listing</button><button onClick={() => toggle(property)} className="text-[0.65rem] uppercase tracking-luxe text-muted hover:text-gold">{property.isPublished ? 'Unpublish' : 'Publish'}</button></div></div></div></article>)}</div></aside>
        </div>
      </div>
    </main>
  )
}
