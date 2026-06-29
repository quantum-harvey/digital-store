import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateDownloadToken } from '@/lib/tokens'

/**
 * Google Drive "share" links (…/file/d/<id>/view) open a preview page and do
 * NOT download the file — and the browser's `download` attribute is ignored for
 * cross-origin URLs. Convert any Drive link to its direct-download form so the
 * customer actually receives their file. Non-Drive URLs are returned unchanged.
 */
function toDirectDownloadUrl(url: string): string {
  const m = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/)
  if (m) {
    return `https://drive.google.com/uc?export=download&id=${m[1]}`
  }
  return url
}

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
    fileUrl: toDirectDownloadUrl(order.product.fileUrl),
  })
}