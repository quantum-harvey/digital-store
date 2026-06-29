import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 0

export default async function Storefront() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 40px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.3;
          pointer-events: none;
          z-index: 0;
        }
        .glow-1 { background: #6366f1; width: 500px; height: 500px; top: -100px; left: -150px; animation: float 8s ease-in-out infinite; }
        .glow-2 { background: #ec4899; width: 400px; height: 400px; top: 300px; right: -100px; animation: float 10s ease-in-out infinite reverse; }
        .product-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          transition: all 0.4s ease;
          animation: fadeUp 0.8s ease forwards;
        }
        .product-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateY(-6px);
        }
        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(99, 102, 241, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.04) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .cta-btn {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          transition: all 0.3s ease;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px -10px rgba(99, 102, 241, 0.6);
        }
        .nav-blur {
          backdrop-filter: blur(20px);
          background: rgba(10, 10, 15, 0.7);
        }
      `}} />

      {/* Background effects */}
      <div className="glow glow-1" />
      <div className="glow glow-2" />
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 nav-blur border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">BK</div>
            <span className="font-bold text-lg">Digital Supply BK</span>
          </div>
          <span className="text-sm text-gray-400">
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
            Ready to download instantly
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Premium digital products,<br />
            ready to <span className="gradient-text">sell &amp; download</span>.
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Secure checkout powered by Stripe. Instant delivery to your inbox. No waiting, no friction.
          </p>

          {/* Trust band */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-300">
            <span className="flex items-center gap-2">⚡ Instant download</span>
            <span className="flex items-center gap-2">🔒 Secure Stripe checkout</span>
            <span className="flex items-center gap-2">↩️ 7-day money-back guarantee</span>
            <span className="flex items-center gap-2">✉️ Email support</span>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-3xl">
              📦
            </div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">No products yet</h2>
            <p className="text-gray-500">Add products through the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="product-card rounded-2xl overflow-hidden group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="aspect-square bg-white/5 overflow-hidden relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs uppercase tracking-wider text-gray-300 border border-white/10">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black gradient-text">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      {/^[\d.]+$/.test(product.fileSize) ? `${product.fileSize} MB` : product.fileSize}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* FAQ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'How do I get the product after paying?',
              a: 'Instantly. The moment your payment clears, we email a secure download link to the address you enter at checkout. No waiting and no account needed.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'All major credit and debit cards, processed securely by Stripe. We never see or store your card details.',
            },
            {
              q: 'Do you offer refunds?',
              a: 'Yes. If a product isn’t what you expected, email us within 7 days of purchase and we’ll make it right or refund you.',
            },
            {
              q: 'Can I use these products commercially?',
              a: 'Yes — everything here is licensed for use in your own projects and products. Reselling the files as-is is not permitted.',
            },
          ].map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
            >
              <h3 className="font-semibold mb-2">{item.q}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs">BK</div>
            <span>Digital Supply BK</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span>Secure payments via Stripe</span>
            <span>Instant delivery</span>
            <span>7-day money-back guarantee</span>
            <a href="mailto:harveybanksbz@gmail.com" className="hover:text-white transition-colors">
              Contact support
            </a>
          </div>
        </div>
        <p className="max-w-6xl mx-auto mt-4 text-center md:text-left text-xs text-gray-600">
          © {new Date().getFullYear()} Digital Supply BK. All products are digital and delivered instantly.
        </p>
      </footer>
    </div>
  )
}