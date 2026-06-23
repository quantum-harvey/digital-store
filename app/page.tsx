import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function Storefront() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Digital Store</h1>
          <span className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </span>
        </div>
      </header>

      {/* Product Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">No products yet</h2>
            <p className="text-gray-400">Add products through the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-400">{product.fileSize}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}