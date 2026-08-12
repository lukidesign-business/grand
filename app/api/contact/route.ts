import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const recipient = 'thai@grand-properties.com'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = clean(body.name, 120)
    const email = clean(body.email, 254)
    const phone = clean(body.phone, 80)
    const budget = clean(body.budget, 120)
    const interest = clean(body.interest, 160)
    const message = clean(body.message, 4000)
    const consent = body.consent === true

    if (!name || !emailPattern.test(email) || !consent) {
      return NextResponse.json({ error: 'Please complete the required fields and consent.' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Email service is not configured.' }, { status: 503 })

    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from: 'Grand Properties Website <thai@grand-properties.com>',
      to: [recipient],
      replyTo: email,
      subject: `New property enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Budget: ${budget || 'Not provided'}`,
        `Interest: ${interest || 'Not provided'}`,
        '',
        'Message:',
        message || 'No message provided',
      ].join('\n'),
    })

    if (result.error) {
      console.error('[v0] Resend email error:', result.error)
      return NextResponse.json({ error: 'Unable to send your enquiry right now.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] Contact submission error:', error)
    return NextResponse.json({ error: 'Unable to send your enquiry right now.' }, { status: 500 })
  }
}
