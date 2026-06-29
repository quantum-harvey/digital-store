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
      <div className="min-h-screen flex items-center justify-center bg-[#06060b] text-gray-400">
        <p>Loading product…</p>
      </div>
    )
  }

  const fileSize = /^[\d.]+$/.test(product.fileSize) ? `${product.fileSize} MB` : product.fileSize

  const included = [
    'Instant download — delivered to your inbox',
    'Secure, signed download link',
    'Yours to keep, with commercial-use license',
    '7-day money-back guarantee',
    'Real human email support',
  ]

  return (
    <div className="min-h-screen bg-[#06060b] text-white overflow-x-hidden selection:bg-indigo-500/30">
      <style dangerouslySetInnerHTML={{ __html: `
        .glow { position:absolute; border-radius:50%; filter: blur(130px); pointer-events:none; z-index:0; }
        .glow-1 { background:#6366f1; width:520px; height:520px; top:-180px; left:-160px; opacity:.28; }
        .glow-2 { background:#d946ef; width:420px; height:420px; top:200px; right:-140px; opacity:.20; }
        .gradient-text { background:linear-gradient(120deg,#818cf8,#c084fc 50%,#f0abfc); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
        .nav-blur { backdrop-filter: blur(20px); background: rgba(6,6,11,.65); }
        .card { background: rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.08); backdrop-filter: blur(10px); }
        .cta { background: linear-gradient(120deg,#6366f1,#a855f7); transition: transform .25s, box-shadow .25s; }
        .cta:hover { transform: translateY(-2px); box-shadow: 0 14px 50px -12px rgba(129,140,248,.7); }
        .cta:disabled { opacity:.55; transform:none; box-shadow:none; cursor:not-allowed; }
        .field { background: rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); }
        .field:focus { outline:none; border-color:#818cf8; box-shadow:0 0 0 3px rgba(129,140,248,.25); }
      `}} />

      <div className="glow glow-1" />
      <div className="glow glow-2" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 nav-blur border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center font-black text-sm">BK</div>
            <span className="font-bold text-lg tracking-tight">Digital Supply BK</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">← Back to store</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: visual + what's included */}
          <div className="space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden card">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="card rounded-2xl p-6">
              <h3 className="font-bold mb-4">What&apos;s included</h3>
              <ul className="space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="mt-0.5 text-emerald-400">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: details + buy box */}
          <div className="flex flex-col">
            <p className="text-xs text-indigo-300 uppercase tracking-[0.2em] mb-3">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">{product.name}</h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-black gradient-text">${(product.price / 100).toFixed(2)}</span>
              <span className="chip text-xs text-gray-400 px-3 py-1.5 rounded-full border border-white/10">{fileSize} · {product.fileName}</span>
            </div>

            <div className="card rounded-2xl p-6 mb-6">
              <form onSubmit={handlePurchase} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="field w-full px-4 py-3 rounded-lg text-white placeholder-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Your download link will be sent here.</p>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button type="submit" disabled={loading} className="cta w-full text-white py-3.5 rounded-lg font-semibold">
                  {loading ? 'Redirecting to secure checkout…' : `Buy now · $${(product.price / 100).toFixed(2)}`}
                </button>

                <div className="flex items-center justify-center gap-5 pt-1 text-xs text-gray-500">
                  <span>🔒 Stripe secure</span>
                  <span>⚡ Instant delivery</span>
                  <span>↩️ 7-day guarantee</span>
                </div>
              </form>
            </div>

            <p className="text-center text-xs text-gray-600">
              Powered by Stripe. We never see or store your card details.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
