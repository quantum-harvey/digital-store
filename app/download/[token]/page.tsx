'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function DownloadPage() {
  const params = useParams()
  const token = params.token as string
  const [status, setStatus] = useState<'loading' | 'ready' | 'expired' | 'error'>('loading')
  const [reason, setReason] = useState('')
  const [productInfo, setProductInfo] = useState<{ name: string; fileName: string; fileUrl: string } | null>(null)

  useEffect(() => {
    async function verifyToken() {
      const res = await fetch(`/api/verify-download/${token}`)
      const data = await res.json()

      if (data.valid) {
        setProductInfo({ name: data.productName, fileName: data.fileName, fileUrl: data.fileUrl })
        setStatus('ready')
      } else if (data.reason === 'expired' || data.reason === 'limit_reached') {
        setStatus('expired')
      } else {
        setReason(data.reason || 'unknown')
        setStatus('error')
      }
    }
    verifyToken()
  }, [token])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Verifying your download link...</p>
      </div>
    )
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Link Expired</h1>
          <p className="text-gray-600">
            This download link has expired or reached its download limit.
            Contact support for a new link.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Link</h1>
          <p className="text-gray-600">This download link is not valid.</p>
          {reason && <p className="mt-2 text-xs text-gray-400">Reason: {reason}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Your download is ready!</h1>
        <p className="text-gray-600 mb-6">{productInfo?.name}</p>
        <a
          href={productInfo?.fileUrl}
          download={productInfo?.fileName}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Download {productInfo?.fileName}
        </a>
        <p className="text-xs text-gray-400 mt-4">
          Trouble downloading? Email us and we&apos;ll sort it out right away.
        </p>
      </div>
    </div>
  )
}