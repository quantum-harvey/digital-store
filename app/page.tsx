import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 0

const SUPPORT_EMAIL = 'harveybanksbz@gmail.com'

export default async function Storefront() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  })

  const year = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-[#06060b] text-white overflow-x-hidden selection:bg-indigo-500/30">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,30px) scale(1.05); } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(28px); } to { opacity:1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -500px 0; } 100% { background-position: 500px 0; } }
        @keyframes pulseDot { 0%,100% { opacity:1; } 50% { opacity:.3; } }
        .reveal { opacity:0; animation: fadeUp .8s cubic-bezier(.2,.7,.2,1) forwards; }
        .glow { position:absolute; border-radius:50%; filter: blur(130px); pointer-events:none; z-index:0; }
        .glow-1 { background:#6366f1; width:560px; height:560px; top:-160px; left:-180px; opacity:.35; animation: float 11s ease-in-out infinite; }
        .glow-2 { background:#d946ef; width:460px; height:460px; top:240px; right:-160px; opacity:.28; animation: float 13s ease-in-out infinite reverse; }
        .glow-3 { background:#0ea5e9; width:420px; height:420px; bottom:-120px; left:30%; opacity:.18; animation: float 15s ease-in-out infinite; }
        .grid-bg { background-image:
            linear-gradient(rgba(99,102,241,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,.05) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%); }
        .gradient-text { background:linear-gradient(120deg,#818cf8,#c084fc 45%,#f0abfc); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
        .nav-blur { backdrop-filter: blur(20px); background: rgba(6,6,11,.65); }
        .card { background: rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.07); backdrop-filter: blur(10px); transition: transform .4s cubic-bezier(.2,.7,.2,1), border-color .4s, background .4s; }
        .card:hover { transform: translateY(-8px); border-color: rgba(129,140,248,.5); background: rgba(255,255,255,.05); }
        .cta { background: linear-gradient(120deg,#6366f1,#a855f7); position:relative; overflow:hidden; transition: transform .25s, box-shadow .25s; }
        .cta:hover { transform: translateY(-2px); box-shadow: 0 14px 50px -12px rgba(129,140,248,.7); }
        .cta::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent); background-size:500px 100%; animation: shimmer 3.5s linear infinite; }
        .chip { background: rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); }
      `}} />

      {/* Background */}
      <div className="glow glow-1" />
      <div className="glow glow-2" />
      <div className="glow glow-3" />
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 nav-blur border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-500/30">BK</div>
            <span className="font-bold text-lg tracking-tight">Digital Supply BK</span>
          </div>
          <div className="hidden sm:flex items-center gap-7 text-sm text-gray-400">
            <a href="#products" className="hover:text-white transition-colors">Products</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <a href="#products" className="cta text-sm font-semibold px-4 py-2 rounded-lg">Browse</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="reveal inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full chip text-sm text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: 'pulseDot 1.8s ease-in-out infinite' }} />
            Instant delivery · No accounts · No waiting
          </div>

          <h1 className="reveal text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-7" style={{ animationDelay: '.08s' }}>
            Digital products that<br />
            <span className="gradient-text">work the moment you buy</span>.
          </h1>

          <p className="reveal text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '.16s' }}>
            Production-ready templates, kits, and tools — bought in seconds, delivered to your inbox instantly. Secure Stripe checkout, no friction, no fluff.
          </p>

          <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4 mt-10" style={{ animationDelay: '.24s' }}>
            <a href="#products" className="cta w-full sm:w-auto text-base font-semibold px-8 py-3.5 rounded-xl">
              Browse the store →
            </a>
            <a href="#how" className="w-full sm:w-auto text-base font-medium px-8 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
              How it works
            </a>
          </div>

          <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-400" style={{ animationDelay: '.32s' }}>
            <span>⚡ Instant download</span>
            <span>🔒 Secure Stripe checkout</span>
            <span>↩️ 7-day money-back guarantee</span>
            <span>✉️ Real human support</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: '01', t: 'Pick your product', d: 'Browse the store and choose the kit or template that gets you moving today.' },
            { n: '02', t: 'Pay securely', d: 'Checkout in seconds with Stripe. Cards only, fully encrypted — we never see your details.' },
            { n: '03', t: 'Download instantly', d: 'Your secure download link hits your inbox the moment payment clears. Start building.' },
          ].map((s, i) => (
            <div key={s.n} className="card rounded-2xl p-7 reveal" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-sm font-mono gradient-text font-bold mb-3">{s.n}</div>
              <h3 className="text-lg font-bold mb-2">{s.t}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <main id="products" className="relative z-10 max-w-6xl mx-auto px-6 py-20 scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Shop the collection</h2>
          <p className="text-gray-400">Every product is yours to keep, forever, with free updates where it counts.</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl chip flex items-center justify-center mx-auto mb-4 text-3xl">📦</div>
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">New products dropping soon</h3>
            <p className="text-gray-500">Check back shortly — the shelves are being stocked.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="card rounded-2xl overflow-hidden group reveal flex flex-col"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="aspect-[4/3] bg-white/5 overflow-hidden relative">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs uppercase tracking-wider text-gray-200 border border-white/10">
                    {product.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-300 transition-colors">{product.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-5 flex-1">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black gradient-text">${(product.price / 100).toFixed(2)}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300 group-hover:gap-2.5 transition-all">
                      View <span aria-hidden>→</span>
                    </span>
                  </div>
                  <span className="mt-3 text-xs text-gray-500">
                    {/^[\d.]+$/.test(product.fileSize) ? `${product.fileSize} MB` : product.fileSize} · Instant download
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Value props */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { i: '⚡', t: 'Instant, every time', d: 'No "we\'ll email you in 24 hours." Your file is ready the second you pay.' },
            { i: '🛠️', t: 'Production-ready', d: 'These aren\'t demos. They\'re built to ship — clean, documented, and battle-tested.' },
            { i: '🔒', t: 'Secure by default', d: 'Stripe-powered checkout and signed, expiring download links keep everything safe.' },
            { i: '↩️', t: 'Risk-free', d: 'Not what you expected? Email within 7 days and we make it right. Simple as that.' },
          ].map((f, i) => (
            <div key={f.t} className="card rounded-2xl p-6 reveal" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="text-3xl mb-3">{f.i}</div>
              <h3 className="font-bold mb-2">{f.t}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee band */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="card rounded-3xl p-10 text-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,.12), rgba(217,70,239,.08))' }}>
          <div className="text-4xl mb-4">🤝</div>
          <h2 className="text-2xl md:text-3xl font-black mb-3">Our no-nonsense guarantee</h2>
          <p className="text-gray-300 max-w-xl mx-auto leading-relaxed">
            Buy with confidence. If a product doesn&apos;t deliver what the page promised, email us within 7 days and we&apos;ll refund you or make it right — no hoops, no hassle.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 max-w-3xl mx-auto px-6 pb-24 scroll-mt-24">
        <h2 className="text-3xl font-black text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How do I get the product after paying?', a: 'Instantly. The moment your payment clears, we email a secure download link to the address you enter at checkout. No account needed.' },
            { q: 'What payment methods do you accept?', a: 'All major credit and debit cards, processed securely by Stripe. We never see or store your card details.' },
            { q: 'Do you offer refunds?', a: 'Yes. If a product isn’t what you expected, email us within 7 days of purchase and we’ll make it right or refund you.' },
            { q: 'Can I use these products commercially?', a: 'Yes — everything here is licensed for use in your own projects and products. Reselling the files as-is is not permitted.' },
            { q: 'How long do I have to download my file?', a: 'Your link is valid for 24 hours and allows multiple downloads. Need it again later? Email support and we’ll reissue it.' },
          ].map((item) => (
            <div key={item.q} className="card rounded-xl p-5">
              <h3 className="font-semibold mb-2">{item.q}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="card rounded-3xl px-8 py-14 text-center overflow-hidden relative">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Stop planning. Start shipping.</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">Grab a kit, download it in seconds, and have something real live today.</p>
          <a href="#products" className="cta inline-block text-base font-semibold px-9 py-4 rounded-xl">Browse products →</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center font-black text-xs">BK</div>
            <span className="font-semibold text-gray-300">Digital Supply BK</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span>Secure payments via Stripe</span>
            <span>Instant delivery</span>
            <span>7-day money-back guarantee</span>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors">Contact support</a>
          </div>
        </div>
        <p className="max-w-6xl mx-auto mt-5 text-center md:text-left text-xs text-gray-600">
          © {year} Digital Supply BK. All products are digital and delivered instantly.
        </p>
      </footer>
    </div>
  )
}
