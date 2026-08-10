import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'File is required' }, { status: 400 })
    const kind = String(formData.get('kind') ?? 'image')
    const allowed = kind === 'pdf' ? file.type === 'application/pdf' : kind === 'video' ? file.type.startsWith('video/') : file.type.startsWith('image/')
    if (!allowed) return NextResponse.json({ error: kind === 'pdf' ? 'Only PDF files are allowed' : kind === 'video' ? 'Only video files are allowed' : 'Only image files are allowed' }, { status: 400 })
    const maxSize = kind === 'video' ? 200 * 1024 * 1024 : kind === 'pdf' ? 25 * 1024 * 1024 : 12 * 1024 * 1024
    if (file.size > maxSize) return NextResponse.json({ error: `Files must be ${kind === 'video' ? '200MB' : kind === 'pdf' ? '25MB' : '12MB'} or smaller` }, { status: 400 })

    const blob = await put(`properties/${crypto.randomUUID()}-${file.name}`, file, { access: 'public', addRandomSuffix: false })
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}
