import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { generateDownloadToken } from '@/lib/tokens'
import { sendPurchaseEmail } from '@/lib/email'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event
  try {
    event = getStripe().webhooks.constructEvent(
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
      const session = event.data.object as Stripe.Checkout.Session
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
          customerEmail: session.customer_details!.email,
          customerName: session.customer_details!.name || 'Customer',
          amount: session.amount_total!,
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
        await sendPurchaseEmail(
          order.customerEmail,
          productFileName,
          downloadUrl,
          order.id
        )
      } catch (emailErr) {
        console.error('Email failed but order recorded:', emailErr)
      }

      console.log(`✓ Order ${order.id} created for ${order.customerEmail}`)
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const session = await getStripe().checkout.sessions.retrieve(
        charge.payment_intent as string
      )
      if (session) {
        await prisma.order.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: 'refunded' },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}