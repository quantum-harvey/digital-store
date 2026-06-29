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
  { params }: { params: Promise<{ token: string }> }
) {
  // Next.js 15+/16: route params are async and MUST be awaited. Reading them
  // synchronously yields undefined, which silently breaks every download link.
  const { token } = await params

  if (!process.env.DOWNLOAD_TOKEN_SECRET) {
    console.error('[verify-download] DOWNLOAD_TOKEN_SECRET is not set at runtime')
    return NextResponse.json({ valid: false, reason: 'server_misconfig' }, { status: 500 })
  }

  if (!token) {
    console.error('[verify-download] no token received in params')
    return NextResponse.json({ valid: false, reason: 'no_token' }, { status: 400 })
  }

  const validation = validateDownloadToken(token)
  if (!validation) {
    console.error('[verify-download] signature/format invalid, token prefix:', token.slice(0, 12))
    return NextResponse.json({ valid: false, reason: 'bad_signature' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { downloadToken: token },
    include: { product: true },
  })

  if (!order) {
    console.error('[verify-download] no order for token prefix:', token.slice(0, 12))
    return NextResponse.json({ valid: false, reason: 'order_not_found' }, { status: 404 })
  }

  if (order.status !== 'paid') {
    return NextResponse.json({ valid: false, reason: 'refunded' }, { status: 403 })
  }

  if (order.downloadCount >= order.maxDownloads) {
    return NextResponse.json({ valid: false, reason: 'limit_reached' }, { status: 403 })
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