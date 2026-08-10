import { handleUpload } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

const MAX_VIDEO_SIZE = 200 * 1024 * 1024
const MAX_PDF_SIZE = 100 * 1024 * 1024

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const kind = body?.clientPayload === 'video' ? 'video' : body?.clientPayload === 'pdf' ? 'pdf' : null
    if (!kind) return NextResponse.json({ error: 'Missing upload media type' }, { status: 400 })
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        const extension = pathname.split('.').pop()?.toLowerCase()
        if (kind === 'pdf' && extension !== 'pdf') throw new Error('Only PDF files are allowed')
        if (kind === 'video' && !['mp4', 'webm', 'mov', 'm4v'].includes(extension ?? '')) throw new Error('Use an MP4, WebM, MOV, or M4V video')
        return {
          allowedContentTypes: kind === 'pdf' ? ['application/pdf'] : ['video/*'],
          maximumSizeInBytes: kind === 'pdf' ? MAX_PDF_SIZE : MAX_VIDEO_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ kind }),
        }
      },
    })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload authorization failed'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 400 })
  }
}
