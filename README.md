# Digital Store — Next.js SaaS Starter Kit

A fully automated digital product store built with Next.js 16, Stripe, Prisma, and Resend. Zero inventory, instant fulfillment, 100% margin.

## What This Is

A production-ready e-commerce system for selling digital products. Customers pay through Stripe, the webhook fires automatically, an order is created in the database, a secure download token is generated, and an email with the download link is sent — all without any human intervention.

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM** (PostgreSQL)
- **Stripe** (payments + webhooks)
- **Resend** (transactional email)
- **Vercel** (deployment)

## Features

- Storefront with product grid
- Product detail pages with checkout
- Stripe Checkout integration
- Automated webhook handler (order creation, token generation, email delivery)
- Secure download tokens with HMAC signing and expiry
- Download limit enforcement (5 downloads per token, 24-hour expiry)
- Admin panel for product management (create, edit, delete)
- Email logging
- Refund handling
- Responsive design

## Setup Instructions

### 1. Install Dependencies
