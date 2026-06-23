'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'complete'>('loading')

  useEffect(() => {
    if (sessionId) {
      setStatus('complete')
    }
  }, [sessionId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        {status === 'loading' ? (
          <p className="text-gray-500">Confirming your payment...</p>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3">Payment successful!</h1>
            <p className="text-gray-600 mb-6">
              Check your email for your download link. It'll arrive within a few minutes.
            </p>
            <Link
              href="/"
              className="inline-block text-sm text-gray-500 hover:text-black transition-colors"
            >
              ← Back to store
            </Link>
          </>
        )}
      </div>
    </div>
  )
}