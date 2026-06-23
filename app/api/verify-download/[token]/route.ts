import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateDownloadToken } from '@/lib/tokens'

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params

  const validation = validateDownloadToken(token)
  if (!validation) {
    return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { downloadToken: token },
    include: { product: true },
  })

  if (!order) {
    return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 404 })
  }

  if (order.status !== 'paid') {
    return NextResponse.json({ valid: false, reason: 'refunded' }, { status: 403 })
  }

  if (order.downloadCount >= order.maxDownloads) {
    return NextResponse.json({ valid: false, reason: 'expired' }, { status: 403 })
  }

  if (new Date() > order.tokenExpiresAt) {
    return NextResponse.json({ valid: false, reason: 'expired' }, { status: 403 })
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { downloadCount: { increment: 1 } },
  })

  return NextResponse.json({
    valid: true,
    productName: order.product.name,
    fileName: order.product.fileName,
    fileUrl: order.product.fileUrl,
  })
}