import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
      apiVersion: '2024-06-20',
      typescript: true,
    })
  }
  return stripeClient
}