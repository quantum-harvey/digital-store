'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  fileUrl: string
  fileName: string
  fileSize: string
  category: string
}

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch('/api/products')
      const data = await res.json()
      const found = data.find((p: Product) => p.id === id)
      if (found) setProduct(found)
    }
    fetchProduct()
  }, [id])

  async function handlePurchase(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, customerEmail: email }),
      })

      const data = await res.json()

      if (data.url) {
        router.push(data.url)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch {
      setError('Failed to start checkout')
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading product...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <Link href="/" className="text-sm text-gray-500 hover:text-black transition-colors">
            ← Back to store
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-2xl font-bold">${(product.price / 100).toFixed(2)}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">Instant download</span>
              </div>
              <p className="text-sm text-gray-400">{product.fileSize} · {product.fileName}</p>
            </div>

            <form onSubmit={handlePurchase} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Your download link will be sent here.
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Redirecting to checkout...' : 'Buy Now'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}