import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all products (for admin)
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

// POST new product
export async function POST(req: NextRequest) {
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

// DELETE product
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

// UPDATE product
export async function PATCH(req: NextRequest) {
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