import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthorized } from '@/lib/auth'

// GET products.
// IMPORTANT: this endpoint is public (the storefront/product pages call it).
// It must NEVER expose fileUrl/fileName — those are the paid digital goods and
// would let anyone download products for free. Admins (authorized) get full data.
export async function GET(req: NextRequest) {
  const authed = isAuthorized(req)

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  if (authed) {
    return NextResponse.json(products)
  }

  // Public response: only active products, with the actual download URL
  // stripped out so the paid goods can't be grabbed for free. (fileName is
  // harmless and is shown on the product page, so it stays.)
  const safe = products
    .filter((p) => p.active)
    .map((p) => {
      const rest: Record<string, unknown> = { ...p }
      delete rest.fileUrl
      return rest
    })
  return NextResponse.json(safe)
}

// POST new product (admin only)
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      imageUrl: body.imageUrl,
      fileUrl: body.fileUrl,
      fileName: body.fileName,
      fileSize: body.fileSize,
      category: body.category || 'template',
      featured: body.featured || false,
    },
  })

  return NextResponse.json(product)
}

// DELETE product (admin only)
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

// UPDATE product (admin only)
export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()

  const product = await prisma.product.update({
    where: { id: body.id },
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      imageUrl: body.imageUrl,
      fileUrl: body.fileUrl,
      fileName: body.fileName,
      fileSize: body.fileSize,
      category: body.category,
      featured: body.featured,
      active: body.active,
    },
  })

  return NextResponse.json(product)
}