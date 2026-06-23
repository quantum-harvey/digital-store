import { Resend } from 'resend'
import { prisma } from './prisma'

let resendClient: Resend | null = null

function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY || 're_dummy')
  }
  return resendClient
}

export async function sendPurchaseEmail(
  to: string,
  productName: string,
  downloadUrl: string,
  orderId: string
): Promise<void> {
  const { data, error } = await getResend().emails.send({
    from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    to,
    subject: `Your download for ${productName} is ready`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px;">Thank you for your purchase!</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Your order for <strong>${productName}</strong> has been confirmed.
          Click the button below to download your file. This link expires in 24 hours
          and allows up to 5 downloads.
        </p>
        <a href="${downloadUrl}"
           style="display: inline-block; background: #000; color: #fff; padding: 14px 32px;
                  text-decoration: none; border-radius: 8px; font-weight: 600;
                  margin: 24px 0; font-size: 16px;">
          Download ${productName}
        </a>
        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          If the button doesn't work, copy this URL into your browser:<br>
          ${downloadUrl}
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('Email send failed:', error)
    throw error
  }

  await prisma.emailLog.create({
    data: {
      orderId,
      to,
      subject: `Your download for ${productName} is ready`,
    },
  })
}