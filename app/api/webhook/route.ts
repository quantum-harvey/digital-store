import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDownloadToken } from '@/lib/tokens'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2024-06-20',
  })

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const { productId, productFileUrl, productFileName } = session.metadata!

      const existing = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
      })
      if (existing) {
        return NextResponse.json({ received: true, duplicate: true })
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

      const order = await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          productId,
          customerEmail: session.customer_details?.email || '',
          customerName: session.customer_details?.name || 'Customer',
          amount: session.amount_total || 0,
          status: 'paid',
          downloadToken: 'placeholder',
          tokenExpiresAt: expiresAt,
        },
      })

      const token = generateDownloadToken(order.id, expiresAt)

      await prisma.order.update({
        where: { id: order.id },
        data: { downloadToken: token },
      })

      const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/download/${token}`

      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy')
        
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
          to: order.customerEmail,
          subject: `Your download for ${productFileName} is ready`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px;">Thank you for your purchase!</h1>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Your order for <strong>${productFileName}</strong> has been confirmed.
                Click the button below to download your file. This link expires in 24 hours
                and allows up to 5 downloads.
              </p>
              <a href="${downloadUrl}"
                 style="display: inline-block; background: #000; color: #fff; padding: 14px 32px;
                        text-decoration: none; border-radius: 8px; font-weight: 600;
                        margin: 24px 0; font-size: 16px;">
                Download ${productFileName}
              </a>
            </div>
          `,
        })

        await prisma.emailLog.create({
          data: {
            orderId: order.id,
            to: order.customerEmail,
            subject: `Your download for ${productFileName} is ready`,
          },
        })
      } catch (emailErr) {
        console.error('Email failed but order recorded:', emailErr)
      }

      console.log(`✓ Order ${order.id} created for ${order.customerEmail}`)
      break
    }
  }

  return NextResponse.json({ received: true })
}