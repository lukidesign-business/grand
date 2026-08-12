'use client'

import { useRef, useState } from 'react'
import { upload as uploadToBlob } from '@vercel/blob/client'
import { X } from 'lucide-react'

type Property = {
  id: string
  slug: string
  name: string
  status: string
  completionText: string | null
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
  videoUrl: string | null
  documents: Array<{ title: string; url: string }>
}

type PropertyForm = {
  name: string
  slug: string
  status: string
  completionText: string
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
  videoUrl: string
  documents: Array<{ title: string; url: string }>
}

type PropertyField = keyof PropertyForm
type FieldErrors = Partial<Record<PropertyField, string>>

const initialForm: PropertyForm = {
  name: '', slug: '', status: 'Ready to move', completionText: '', propertyType: 'Condominium', bedrooms: '1', location: 'Pattaya, Thailand', price: '', description: '', coverImageUrl: '', galleryImageUrls: [], mapImageUrl: '', areaSqm: '', isPublished: true, videoUrl: '', documents: [],
}

export function AdminPropertyDashboard({ initialProperties }: { initialProperties: Property[] }) {
  const [properties, setProperties] = useState(initialProperties)
  const [form, setForm] = useState(initialForm)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [draggingMedia, setDraggingMedia] = useState<'pdf' | 'video' | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploadKind, setUploadKind] = useState<'cover' | 'gallery' | 'map' | 'pdf' | 'video'>('gallery')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null)
  const [customLocationMode, setCustomLocationMode] = useState(false)
  const [manualAddress, setManualAddress] = useState('')
  const fieldRefs = useRef<Partial<Record<PropertyField, HTMLElement | null>>>({})

  function update(key: keyof PropertyForm, value: PropertyForm[typeof key]) {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const validStatuses = ['Ready to move', 'Under construction', 'Resale', 'Presale']
  const validPropertyTypes = ['Condominium', 'Villa', 'House']

  function editProperty(property: Property) {
    setEditingId(property.id)
    const isCustomAddress = !['Pattaya, Thailand', 'Jomtien, Thailand', 'Bangkok, Thailand', 'Phuket, Thailand'].includes(property.location)
    setCustomLocationMode(isCustomAddress)
    setManualAddress(isCustomAddress ? property.location : '')
    setForm({
      name: property.name,
      slug: property.slug,
      status: validStatuses.includes(property.status) ? property.status : 'Ready to move',
      completionText: property.completionText ?? '',
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
      videoUrl: property.videoUrl ?? '',
      documents: property.documents ?? [],
    })
    setMessage(`Editing “${property.name}” — update the fields below.`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setCustomLocationMode(false)
    setManualAddress('')
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

  async function upload(event: React.ChangeEvent<HTMLInputElement>, kind: 'cover' | 'gallery' | 'map' | 'pdf' | 'video') {
    const files = Array.from(event.target.files ?? [])
    await uploadFiles(files, kind)
    event.target.value = ''
  }

  async function uploadFiles(files: File[], kind: 'cover' | 'gallery' | 'map' | 'pdf' | 'video') {
    if (!files.length) return
    if ((kind === 'pdf' || kind === 'video') && files.length > 1) files = files.slice(0, 1)
    setUploadKind(kind)
    setUploading(true)
    setUploadProgress(0)
    setMessage('')
    const urls: string[] = []
    try {
      for (const file of files) {
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(file.name)
        if (kind === 'pdf' && !isPdf) throw new Error('Only PDF files are allowed')
        if (kind === 'video' && !isVideo) throw new Error('Only MP4, WebM, MOV, or M4V videos are allowed')
        if (kind === 'video' && file.size > 200 * 1024 * 1024) throw new Error('Videos must be 200MB or smaller')
        if (kind === 'pdf' && file.size > 100 * 1024 * 1024) throw new Error('PDFs must be 100MB or smaller')
        if (kind === 'pdf' || kind === 'video') {
          const blob = await uploadToBlob(`properties/media/${crypto.randomUUID()}-${file.name}`, file, { access: 'public', handleUploadUrl: '/api/admin/upload-token', clientPayload: kind, contentType: file.type || (kind === 'pdf' ? 'application/pdf' : 'video/mp4'), multipart: true, headers: { 'x-requested-with': 'fetch' }, onUploadProgress: ({ percentage }) => setUploadProgress(Math.round(percentage)) })
          urls.push(blob.url)
        } else {
          const body = new FormData()
          body.append('file', file)
          body.append('kind', kind)
          const response = await fetch('/api/admin/upload', { method: 'POST', body })
          const result = await response.json()
          if (!response.ok || !result.url) throw new Error(result.error ?? 'Image upload failed')
          urls.push(result.url)
        }
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.')
      setUploading(false)
      setUploadProgress(0)
      return
    }
    if (kind === 'video') {
      setForm((current) => ({ ...current, videoUrl: urls[0] }))
    } else if (kind === 'pdf') {
      const title = files[0]?.name.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ') || 'Property brochure'
      setForm((current) => ({ ...current, documents: [...current.documents, { title, url: urls[0] }] }))
    } else if (kind === 'map') {
      setForm((current) => ({ ...current, mapImageUrl: urls[0] }))
    } else if (kind === 'cover') {
      setForm((current) => ({ ...current, coverImageUrl: urls[0] }))
    } else {
      setForm((current) => ({ ...current, galleryImageUrls: [...current.galleryImageUrls, ...urls] }))
    }
    setUploading(false)
    setUploadProgress(100)
    setMessage(`${urls.length} ${kind === 'pdf' ? 'PDF' : kind === 'video' ? 'video' : 'image'}${urls.length === 1 ? '' : 's'} uploaded.`)
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>, kind: 'cover' | 'gallery' | 'map' | 'pdf' | 'video') {
    event.preventDefault()
    setDraggingMedia(null)
    void uploadFiles(Array.from(event.dataTransfer.files), kind)
  }

  function dragOver(event: React.DragEvent<HTMLLabelElement>, kind?: 'pdf' | 'video') {
    event.preventDefault()
    if (kind) setDraggingMedia(kind)
  }

  function dragLeave(event: React.DragEvent<HTMLLabelElement>, kind?: 'pdf' | 'video') {
    if (kind && event.currentTarget.contains(event.relatedTarget as Node)) return
    if (kind) setDraggingMedia(null)
  }

  function moveGalleryImage(from: number, to: number) {
    if (from === to || to < 0 || to >= form.galleryImageUrls.length) return
    const next = [...form.galleryImageUrls]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    update('galleryImageUrls', next)
  }

  function handleGalleryDrop(event: React.DragEvent<HTMLDivElement>, targetIndex: number) {
    event.preventDefault()
    if (draggedGalleryIndex !== null) moveGalleryImage(draggedGalleryIndex, targetIndex)
    setDraggedGalleryIndex(null)
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errors = validateForm()
    setFieldErrors(errors)
    setSaving(true)
    setMessage('')
    const response = await fetch('/api/admin/properties', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...form, location: manualAddress.trim() || form.location, id: editingId, bedrooms: Number(form.bedrooms), areaSqm: form.areaSqm ? Number(form.areaSqm) : null }) })
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
      setCustomLocationMode(false)
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

  async function removeProperty(property: Property) {
    if (!window.confirm(`Remove “${property.name}” permanently?`)) return
    const response = await fetch('/api/admin/properties', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: property.id }) })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      setMessage(result.error ?? 'Unable to remove property')
      return
    }
    setProperties((current) => current.filter((item) => item.id !== property.id))
    if (editingId === property.id) resetForm()
    setMessage('Property removed and public pages refreshed.')
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
              <label className="text-xs uppercase tracking-wide text-muted">Status<select value={form.status} onChange={(e) => update('status', e.target.value)} className="admin-input"><option>Ready to move</option><option>Under construction</option><option>Resale</option><option>Presale</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Completion<input id="property-completion" value={form.completionText} onChange={(e) => update('completionText', e.target.value)} placeholder="e.g. Q4 2027 or Ready to move in" className="admin-input" /></label>
              <label className="text-xs uppercase tracking-wide text-muted">Property type<select value={form.propertyType} onChange={(e) => update('propertyType', e.target.value)} className="admin-input"><option>Condominium</option><option>Villa</option><option>House</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Bedrooms<select value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="admin-input"><option value="0">Studio</option><option value="1">1 bedroom</option><option value="2">2 bedrooms</option><option value="3">3 bedrooms</option><option value="4">4 bedrooms</option></select></label>
              <label className="text-xs uppercase tracking-wide text-muted">Location<select id="property-location" name="location" ref={(element) => { fieldRefs.current.location = element }} value={customLocationMode ? '__custom__' : form.location} onChange={(e) => { const value = e.target.value; if (value === '__custom__') { setCustomLocationMode(true); update('location', '') } else { setCustomLocationMode(false); setManualAddress(''); update('location', value) } }} aria-invalid={Boolean(fieldErrors.location)} className={`admin-input ${fieldErrors.location ? 'border-red-500 ring-1 ring-red-500' : ''}`}><option>Pattaya, Thailand</option><option>Jomtien, Thailand</option><option>Bangkok, Thailand</option><option>Phuket, Thailand</option><option value="__custom__">Custom address</option></select><input id="property-manual-address" value={manualAddress} onChange={(e) => { setManualAddress(e.target.value); setCustomLocationMode(Boolean(e.target.value)) }} placeholder="Or enter a manual address" aria-label="Manual property address" className={`admin-input mt-2 ${fieldErrors.location ? 'border-red-500 ring-1 ring-red-500' : ''}`} />{fieldErrors.location ? <span className="mt-1 block text-xs normal-case tracking-normal text-red-400">{fieldErrors.location}</span> : null}</label>
              <label className="text-xs uppercase tracking-wide text-muted">Size in m²<input id="property-area" name="areaSqm" type="number" min="0" ref={(element) => { fieldRefs.current.areaSqm = element }} value={form.areaSqm} onChange={(e) => update('areaSqm', e.target.value)} placeholder="65" aria-invalid={Boolean(fieldErrors.areaSqm)} className={`admin-input ${fieldErrors.areaSqm ? 'border-red-500 ring-1 ring-red-500' : ''}`} />{fieldErrors.areaSqm ? <span className="mt-1 block text-xs normal-case tracking-normal text-red-400">{fieldErrors.areaSqm}</span> : null}</label>
              <label className="text-xs uppercase tracking-wide text-muted">Price<input id="property-price" name="price" ref={(element) => { fieldRefs.current.price = element }} value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="Price available on request" aria-invalid={Boolean(fieldErrors.price)} className={`admin-input ${fieldErrors.price ? 'border-red-500 ring-1 ring-red-500' : ''}`} />{fieldErrors.price ? <span className="mt-1 block text-xs normal-case tracking-normal text-red-400">{fieldErrors.price}</span> : null}</label>
              <label className="text-xs uppercase tracking-wide text-muted sm:col-span-2">Description<textarea id="property-description" name="description" ref={(element) => { fieldRefs.current.description = element }} value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} aria-invalid={Boolean(fieldErrors.description)} className={`admin-input ${fieldErrors.description ? 'border-red-500 ring-1 ring-red-500' : ''}`} />{fieldErrors.description ? <span className="mt-1 block text-xs normal-case tracking-normal text-red-400">{fieldErrors.description}</span> : null}</label>
            </div>
            <label ref={(element) => { fieldRefs.current.coverImageUrl = element }} aria-invalid={Boolean(fieldErrors.coverImageUrl)} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={(event) => handleDrop(event, 'cover')} className={`mt-6 block cursor-pointer border border-dashed p-5 text-sm text-muted transition-colors hover:border-gold hover:bg-gold/5 ${fieldErrors.coverImageUrl ? 'border-red-500 ring-1 ring-red-500' : 'border-line-strong'}`}><span className="block text-cream">Cover image</span><span className="mt-1 block text-xs">Click to choose or drag and drop one image here</span><input type="file" accept="image/*" onChange={(event) => { setUploadKind('cover'); upload(event, 'cover') }} className="sr-only" />{uploading && uploadKind === 'cover' ? <span className="mt-2 block text-gold">Uploading…</span> : null}</label>
            <label ref={(element) => { fieldRefs.current.galleryImageUrls = element }} aria-invalid={Boolean(fieldErrors.galleryImageUrls)} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={(event) => handleDrop(event, 'gallery')} className={`mt-4 block cursor-pointer border border-dashed p-5 text-sm text-muted transition-colors hover:border-gold hover:bg-gold/5 ${fieldErrors.galleryImageUrls ? 'border-red-500 ring-1 ring-red-500' : 'border-line-strong'}`}><span className="block text-cream">Gallery images</span><span className="mt-1 block text-xs">Click to choose or drag and drop multiple images here</span><input type="file" accept="image/*" multiple onChange={(event) => { setUploadKind('gallery'); upload(event, 'gallery') }} className="sr-only" />{uploading && uploadKind === 'gallery' ? <span className="mt-2 block text-gold">Uploading…</span> : null}</label>
            {form.coverImageUrl ? <div className="mt-4"><p className="mb-2 text-xs uppercase tracking-wide text-muted">Cover image</p><div className="group relative max-w-xs overflow-hidden"><img src={form.coverImageUrl} alt="Cover preview" className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105" /><button type="button" aria-label="Remove cover image" onClick={() => update('coverImageUrl', '')} className="absolute right-2 top-2 grid size-8 place-items-center bg-ink/85 text-cream transition hover:bg-gold hover:text-ink"><X className="size-4" /></button></div></div> : null}
            {form.galleryImageUrls.length ? <div className="mt-4"><p className="mb-2 text-xs text-muted">Drag images to reorder them, or use the arrows.</p><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{form.galleryImageUrls.map((url, index) => <div key={`${url}-${index}`} draggable onDragStart={() => setDraggedGalleryIndex(index)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleGalleryDrop(event, index)} onDragEnd={() => setDraggedGalleryIndex(null)} className={`group relative overflow-hidden border bg-surface ${draggedGalleryIndex === index ? 'border-gold opacity-60' : 'border-line-soft'}`}><img src={url} alt={`Uploaded property image ${index + 1}`} className="aspect-square w-full cursor-grab object-cover transition-transform duration-300 group-hover:scale-105 active:cursor-grabbing" /><span className="absolute bottom-1 left-1 bg-ink/80 px-1.5 py-0.5 text-[0.6rem] text-cream">{index + 1}</span><div className="absolute right-1 top-1 flex gap-1"><button type="button" aria-label={`Move gallery image ${index + 1} left`} disabled={index === 0} onClick={() => moveGalleryImage(index, index - 1)} className="grid size-7 place-items-center bg-ink/85 text-cream disabled:opacity-30"><span aria-hidden="true">←</span></button><button type="button" aria-label={`Move gallery image ${index + 1} right`} disabled={index === form.galleryImageUrls.length - 1} onClick={() => moveGalleryImage(index, index + 1)} className="grid size-7 place-items-center bg-ink/85 text-cream disabled:opacity-30"><span aria-hidden="true">→</span></button><button type="button" aria-label={`Remove gallery image ${index + 1}`} onClick={() => update('galleryImageUrls', form.galleryImageUrls.filter((_, imageIndex) => imageIndex !== index))} className="grid size-7 place-items-center bg-ink/85 text-cream transition hover:bg-gold hover:text-ink"><X className="size-4" /></button></div></div>)}</div></div> : null}
            <label onDragOver={dragOver} onDragLeave={dragLeave} onDrop={(event) => handleDrop(event, 'map')} className="mt-5 block cursor-pointer border border-dashed border-line-strong p-5 text-sm text-muted transition-colors hover:border-gold hover:bg-gold/5"><span className="block text-cream">Location map image</span><span className="mt-1 block text-xs">Click to choose or drag and drop one image here</span><input type="file" accept="image/*" onChange={(event) => { setUploadKind('map'); upload(event, 'map') }} className="sr-only" />{uploading && uploadKind === 'map' ? <span className="mt-2 block text-gold">Uploading…</span> : null}</label>
            {form.mapImageUrl ? <div className="group relative mt-4 overflow-hidden"><img src={form.mapImageUrl} alt="Location map preview" className="aspect-[16/7] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" /><button type="button" aria-label="Remove location map image" onClick={() => update('mapImageUrl', '')} className="absolute right-2 top-2 grid size-8 place-items-center bg-ink/85 text-cream transition hover:bg-gold hover:text-ink"><X className="size-4" /></button></div> : null}
            <label onDragOver={(event) => dragOver(event, 'video')} onDragLeave={(event) => dragLeave(event, 'video')} onDrop={(event) => handleDrop(event, 'video')} className={`mt-5 block cursor-pointer border border-dashed p-5 text-sm text-muted transition-colors hover:border-gold hover:bg-gold/5 ${draggingMedia === 'video' ? 'border-gold bg-gold/10' : 'border-line-strong'}`}><span className="block text-cream">Property video tour</span><span className="mt-1 block text-xs">Click or drag a 16:9 MP4/WebM video here, up to 200MB</span><input type="file" accept="video/*" onChange={(event) => { setUploadKind('video'); void upload(event, 'video') }} className="sr-only" />{uploading && uploadKind === 'video' ? <span className="mt-2 block text-gold">Uploading video — {uploadProgress}%</span> : null}</label>
            {form.videoUrl ? <div className="relative mt-4 overflow-hidden border border-line-soft bg-ink"><video src={form.videoUrl} controls className="aspect-video w-full" /><button type="button" onClick={() => update('videoUrl', '')} className="absolute right-2 top-2 grid size-8 place-items-center bg-ink/85 text-cream hover:bg-gold hover:text-ink" aria-label="Remove property video"><X className="size-4" /></button></div> : null}
            <div className="mt-5 border-t border-line-soft pt-5"><p className="text-sm text-cream">Property PDFs</p><p className="mt-1 text-xs text-muted">Add brochures or floor plans with a customer-facing title.</p><label onDragOver={(event) => dragOver(event, 'pdf')} onDragLeave={(event) => dragLeave(event, 'pdf')} onDrop={(event) => handleDrop(event, 'pdf')} className={`mt-3 block cursor-pointer border border-dashed p-5 text-sm text-muted transition-colors hover:border-gold hover:bg-gold/5 ${draggingMedia === 'pdf' ? 'border-gold bg-gold/10' : 'border-line-strong'}`}><span className="block text-cream">Upload PDF</span><span className="mt-1 block text-xs">Click or drag a PDF here, up to 100MB</span><input type="file" accept="application/pdf,.pdf" onChange={(event) => { setUploadKind('pdf'); void upload(event, 'pdf') }} className="sr-only" />{uploading && uploadKind === 'pdf' ? <span className="mt-2 block text-gold">Uploading PDF — {uploadProgress}%</span> : null}</label><div className="mt-3 grid gap-2">{form.documents.map((document, index) => <div key={`${document.url}-${index}`} className="flex items-center gap-2 border border-line-soft bg-ink px-3 py-2"><input value={document.title} onChange={(event) => setForm((current) => ({ ...current, documents: current.documents.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) }))} className="min-w-0 flex-1 bg-transparent text-sm text-cream outline-none" aria-label={`PDF title ${index + 1}`} /><button type="button" onClick={() => update('documents', form.documents.filter((_, itemIndex) => itemIndex !== index))} className="text-muted hover:text-gold" aria-label={`Remove PDF ${index + 1}`}><X className="size-4" /></button></div>)}</div></div>
            {Object.keys(fieldErrors).length ? <div className="mt-5 border border-red-500/60 bg-red-500/10 p-4 text-sm text-red-300" role="alert"><p className="font-medium text-red-200">Complete the highlighted fields before publishing.</p><ul className="mt-2 list-disc space-y-1 pl-5">{Object.entries(fieldErrors).map(([field, error]) => <li key={field}>{error}</li>)}</ul></div> : null}
            {message ? <p className="mt-4 text-sm text-gold" role="status">{message}</p> : null}
            <div className="mt-7 flex gap-3"><button type="submit" disabled={saving || uploading} className="flex-1 bg-gold px-5 py-3 text-sm font-medium text-ink disabled:opacity-60">{saving ? 'Saving…' : editingId ? 'Update property' : 'Publish property'}</button>{editingId ? <button type="button" onClick={resetForm} className="border border-line-strong px-5 py-3 text-sm text-muted hover:text-cream">Cancel</button> : null}</div>
          </form>
          <aside><p className="text-[0.65rem] uppercase tracking-luxe text-gold">Catalog</p><h2 className="mt-2 font-serif text-2xl">Live properties</h2><div className="mt-5 grid gap-3">{properties.map((property) => <article key={property.id} className="border border-line-soft bg-surface p-4"><div className="flex gap-4"><img src={property.coverImageUrl} alt="" className="size-20 shrink-0 object-cover" /><div className="min-w-0"><h3 className="font-serif text-lg">{property.name}</h3><p className="mt-1 text-xs text-muted">{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bedroom`} · {property.status}</p><div className="mt-3 flex flex-wrap gap-3"><button onClick={() => editProperty(property)} className="text-[0.65rem] uppercase tracking-luxe text-gold">Edit listing</button><button onClick={() => toggle(property)} className="text-[0.65rem] uppercase tracking-luxe text-muted hover:text-gold">{property.isPublished ? 'Unpublish' : 'Publish'}</button><button type="button" onClick={() => removeProperty(property)} className="text-[0.65rem] uppercase tracking-luxe text-red-400 hover:text-red-300">Remove</button></div></div></div></article>)}</div></aside>
        </div>
      </div>
    </main>
  )
}
