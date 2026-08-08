'use client'

import { useRef, useState } from 'react'
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

type PropertyField = keyof PropertyForm
type FieldErrors = Partial<Record<PropertyField, string>>

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
  const [uploadKind, setUploadKind] = useState<'cover' | 'gallery' | 'map'>('gallery')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const fieldRefs = useRef<Partial<Record<PropertyField, HTMLElement | null>>>({})

  function update(key: keyof PropertyForm, value: string | boolean | string[]) {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
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
    setFieldErrors({})
    setMessage('Ready to create a new property.')
  }

  function validateForm(): FieldErrors {
    const errors: FieldErrors = {}
    if (!form.name.trim()) errors.name = 'Property name is required.'
    if (!form.slug.trim()) errors.slug = 'Slug is required.'
    if (!form.location.trim()) errors.location = 'Location is required.'
    if (!form.price.trim()) errors.price = 'Price is required.'
    if (!form.description.trim()) errors.description = 'Description is required.'
    if (!form.coverImageUrl.trim()) errors.coverImageUrl = 'Cover image is required.'
    if (!form.galleryImageUrls.length) errors.galleryImageUrls = 'Add at least one gallery image.'
    if (form.areaSqm && Number(form.areaSqm) < 0) errors.areaSqm = 'Size cannot be negative.'
    return errors
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>, kind: 'cover' | 'gallery' | 'map') {
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
      if (!result.url) { setMessage('Image upload returned no URL'); setUploading(false); return }
      urls.push(result.url)
    }
    if (kind === 'map') {
      setForm((current) => ({ ...current, mapImageUrl: urls[0] }))
    } else if (kind === 'cover') {
      setForm((current) => ({ ...current, coverImageUrl: urls[0] }))
    } else {
      setForm((current) => ({ ...current, galleryImageUrls: [...current.galleryImageUrls, ...urls] }))
    }
    setUploading(false)
    setMessage(`${urls.length} image${urls.length === 1 ? '' : 's'} uploaded.`)
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>, kind: 'cover' | 'gallery' | 'map') {
    event.preventDefault()
    event.currentTarget.classList.remove('border-gold', 'bg-gold/5')
    const files = Array.from(event.dataTransfer.files)
    if (!files.length) return
    const input = event.currentTarget.querySelector('input[type=file]') as HTMLInputElement | null
    if (!input) return
    const transfer = new DataTransfer()
    files.forEach((file) => transfer.items.add(file))
    input.files = transfer.files
    void upload({ target: input } as React.ChangeEvent<HTMLInputElement>, kind)
  }

  function dragOver(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    event.currentTarget.classList.add('border-gold', 'bg-gold/5')
  }

  function dragLeave(event: React.DragEvent<HTMLLabelElement>) {
    event.currentTarget.classList.remove('border-gold', 'bg-gold/5')
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errors = validateForm()
    setFieldErrors(errors)
    if (Object.keys(errors).length) {
      const firstField = Object.keys(errors)[0] as PropertyField
      fieldRefs.current[firstField]?.focus()
      setMessage('Please complete the highlighted fields before publishing.')
      return
    }
    setSaving(true)
    setMessage('')
    const response = await fetch('/api/admin/properties', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...form, id: editingId, bedrooms: Number(form.bedrooms), areaSqm: form.areaSqm ? Number(form.areaSqm) : null }) })
    const result = await response.json()
    if (!response.ok) {
      setMessage(result.error ?? 'Unable to publish property')
      setSaving(false)
      return
    }
    else {
      setProperties((current) => [result, ...current.filter((property) => property.id !== result.id)].sort((a, b) => a.name.localeCompare(b.name)))
      const wasEditing = Boolean(editingId)
      setEditingId(null)
      setForm(initialForm)
      setMessage(wasEditing ? 'Property updated and public pages refreshed.' : 'Property published.')
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
              <label className="text-xs uppercase tracking-wide text-muted">Property name<input id="property-name" name="name" ref={(element) => { fieldRefs.current.name = element }} value={form.name} onChange={(e) => update('name', e.target.value)} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'property-name-error' : undefined} className={`admin-input ${fieldErrors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`} />{fieldErrors.name ? <span id="property-name-error" className="mt-1 block text-xs normal-case tracking-normal text-red-400">{fieldErrors.name}</span> : null}</label>
              <label className="text-xs uppercase tracking-wide text-muted">Slug<input id="property-slug" name="slug" ref={(element) => { fieldRefs.current.slug = element }} value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="auto-generated" aria-invalid={Boolean(fieldErrors.slug)} aria-describedby={fieldErrors.slug ? 'property-slug-error' : undefined} className={`admin-input ${fieldErrors.slug ? 'border-red-500 ring-1 ring-red-500' : ''}`} />{fieldErrors.slug ? <span id="property-slug-error" className="mt-1 block text-xs normal-case tracking-normal text-red-400">{fieldErrors.slug}</span> : null}</label>
              <label className="text-xs uppercase tracking-wide text-muted">Status<select value={form.status} onChange={(e) => update('status', e.target.value)} className="admin-input"><option>Ready to move</option><option>Under construction</option><option>Resale</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Property type<select value={form.propertyType} onChange={(e) => update('propertyType', e.target.value)} className="admin-input"><option>Condominium</option><option>Villa</option><option>House</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Bedrooms<select value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="admin-input"><option value="0">Studio</option><option value="1">1 bedroom</option><option value="2">2 bedrooms</option><option value="3">3 bedrooms</option><option value="4">4 bedrooms</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Location<select id="property-location" name="location" ref={(element) => { fieldRefs.current.location = element }} value={form.location} onChange={(e) => update('location', e.target.value)} aria-invalid={Boolean(fieldErrors.location)} className={`admin-input ${fieldErrors.location ? 'border-red-500 ring-1 ring-red-500' : ''}`}><option>Pattaya, Thailand</option><option>Jomtien, Thailand</option><option>Bangkok, Thailand</option><option>Phuket, Thailand</option></select>{fieldErrors.location ? <span className="mt-1 block text-xs normal-case tracking-normal text-red-400">{fieldErrors.location}</span> : null}</label>
              <label className="text-xs uppercase tracking-wide text-muted">Size in m²<input id="property-area" name="areaSqm" type="number" min="0" ref={(element) => { fieldRefs.current.areaSqm = element }} value={form.areaSqm} onChange={(e) => update('areaSqm', e.target.value)} placeholder="65" aria-invalid={Boolean(fieldErrors.areaSqm)} className={`admin-input ${fieldErrors.areaSqm ? 'border-red-500 ring-1 ring-red-500' : ''}`} />{fieldErrors.areaSqm ? <span className="mt-1 block text-xs normal-case tracking-normal text-red-400">{fieldErrors.areaSqm}</span> : null}</label>
              <label className="text-xs uppercase tracking-wide text-muted">Price<input id="property-price" name="price" ref={(element) => { fieldRefs.current.price = element }} value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="Price available on request" aria-invalid={Boolean(fieldErrors.price)} className={`admin-input ${fieldErrors.price ? 'border-red-500 ring-1 ring-red-500' : ''}`} />{fieldErrors.price ? <span className="mt-1 block text-xs normal-case tracking-normal text-red-400">{fieldErrors.price}</span> : null}</label>
              <label className="text-xs uppercase tracking-wide text-muted sm:col-span-2">Description<textarea id="property-description" name="description" ref={(element) => { fieldRefs.current.description = element }} value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} aria-invalid={Boolean(fieldErrors.description)} className={`admin-input ${fieldErrors.description ? 'border-red-500 ring-1 ring-red-500' : ''}`} />{fieldErrors.description ? <span className="mt-1 block text-xs normal-case tracking-normal text-red-400">{fieldErrors.description}</span> : null}</label>
            </div>
            <label ref={(element) => { fieldRefs.current.coverImageUrl = element }} aria-invalid={Boolean(fieldErrors.coverImageUrl)} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={(event) => handleDrop(event, 'cover')} className={`mt-6 block cursor-pointer border border-dashed p-5 text-sm text-muted transition-colors hover:border-gold hover:bg-gold/5 ${fieldErrors.coverImageUrl ? 'border-red-500 ring-1 ring-red-500' : 'border-line-strong'}`}><span className="block text-cream">Cover image</span><span className="mt-1 block text-xs">Click to choose or drag and drop one image here</span><input type="file" accept="image/*" onChange={(event) => { setUploadKind('cover'); upload(event, 'cover') }} className="sr-only" />{uploading && uploadKind === 'cover' ? <span className="mt-2 block text-gold">Uploading…</span> : null}</label>
            <label ref={(element) => { fieldRefs.current.galleryImageUrls = element }} aria-invalid={Boolean(fieldErrors.galleryImageUrls)} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={(event) => handleDrop(event, 'gallery')} className={`mt-4 block cursor-pointer border border-dashed p-5 text-sm text-muted transition-colors hover:border-gold hover:bg-gold/5 ${fieldErrors.galleryImageUrls ? 'border-red-500 ring-1 ring-red-500' : 'border-line-strong'}`}><span className="block text-cream">Gallery images</span><span className="mt-1 block text-xs">Click to choose or drag and drop multiple images here</span><input type="file" accept="image/*" multiple onChange={(event) => { setUploadKind('gallery'); upload(event, 'gallery') }} className="sr-only" />{uploading && uploadKind === 'gallery' ? <span className="mt-2 block text-gold">Uploading…</span> : null}</label>
            {form.coverImageUrl ? <div className="mt-4"><p className="mb-2 text-xs uppercase tracking-wide text-muted">Cover image</p><div className="group relative max-w-xs overflow-hidden"><img src={form.coverImageUrl} alt="Cover preview" className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" /><button type="button" aria-label="Remove cover image" onClick={() => update('coverImageUrl', '')} className="absolute right-2 top-2 grid size-8 place-items-center bg-ink/85 text-cream transition hover:bg-gold hover:text-ink"><X className="size-4" /></button></div></div> : null}
            {form.galleryImageUrls.length ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{form.galleryImageUrls.map((url, index) => <div key={`${url}-${index}`} className="group relative overflow-hidden"><img src={url} alt={`Uploaded property image ${index + 1}`} className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" /><button type="button" aria-label={`Remove gallery image ${index + 1}`} onClick={() => update('galleryImageUrls', form.galleryImageUrls.filter((_, imageIndex) => imageIndex !== index))} className="absolute right-1 top-1 grid size-7 place-items-center bg-ink/85 text-cream opacity-90 transition hover:bg-gold hover:text-ink"><X className="size-4" /></button></div>)}</div> : null}
            <label onDragOver={dragOver} onDragLeave={dragLeave} onDrop={(event) => handleDrop(event, 'map')} className="mt-5 block cursor-pointer border border-dashed border-line-strong p-5 text-sm text-muted transition-colors hover:border-gold hover:bg-gold/5"><span className="block text-cream">Location map image</span><span className="mt-1 block text-xs">Click to choose or drag and drop one image here</span><input type="file" accept="image/*" onChange={(event) => { setUploadKind('map'); upload(event, 'map') }} className="sr-only" />{uploading && uploadKind === 'map' ? <span className="mt-2 block text-gold">Uploading…</span> : null}</label>
            {form.mapImageUrl ? <div className="group relative mt-4 overflow-hidden"><img src={form.mapImageUrl} alt="Location map preview" className="aspect-[16/7] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" /><button type="button" aria-label="Remove location map image" onClick={() => update('mapImageUrl', '')} className="absolute right-2 top-2 grid size-8 place-items-center bg-ink/85 text-cream transition hover:bg-gold hover:text-ink"><X className="size-4" /></button></div> : null}
            {Object.keys(fieldErrors).length ? <div className="mt-5 border border-red-500/60 bg-red-500/10 p-4 text-sm text-red-300" role="alert"><p className="font-medium text-red-200">Complete the highlighted fields before publishing.</p><ul className="mt-2 list-disc space-y-1 pl-5">{Object.entries(fieldErrors).map(([field, error]) => <li key={field}>{error}</li>)}</ul></div> : null}
            {message ? <p className="mt-4 text-sm text-gold" role="status">{message}</p> : null}
            <div className="mt-7 flex gap-3"><button type="submit" disabled={saving || uploading} className="flex-1 bg-gold px-5 py-3 text-sm font-medium text-ink disabled:opacity-60">{saving ? 'Saving…' : editingId ? 'Update property' : 'Publish property'}</button>{editingId ? <button type="button" onClick={resetForm} className="border border-line-strong px-5 py-3 text-sm text-muted hover:text-cream">Cancel</button> : null}</div>
          </form>
          <aside><p className="text-[0.65rem] uppercase tracking-luxe text-gold">Catalog</p><h2 className="mt-2 font-serif text-2xl">Live properties</h2><div className="mt-5 grid gap-3">{properties.map((property) => <article key={property.id} className="border border-line-soft bg-surface p-4"><div className="flex gap-4"><img src={property.coverImageUrl} alt="" className="size-20 shrink-0 object-cover" /><div className="min-w-0"><h3 className="font-serif text-lg">{property.name}</h3><p className="mt-1 text-xs text-muted">{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bedroom`} · {property.status}</p><div className="mt-3 flex flex-wrap gap-3"><button onClick={() => editProperty(property)} className="text-[0.65rem] uppercase tracking-luxe text-gold">Edit listing</button><button onClick={() => toggle(property)} className="text-[0.65rem] uppercase tracking-luxe text-muted hover:text-gold">{property.isPublished ? 'Unpublish' : 'Publish'}</button></div></div></div></article>)}</div></aside>
        </div>
      </div>
    </main>
  )
}
