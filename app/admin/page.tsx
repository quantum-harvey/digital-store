'use client'

import { useState, useEffect } from 'react'

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
  featured: boolean
  active: boolean
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    fileUrl: '',
    fileName: '',
    fileSize: '',
    category: 'template',
    featured: false,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      ...form,
      price: Math.round(parseFloat(form.price) * 100),
      featured: form.featured,
    }

    if (editing) {
      await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: editing.id }),
      })
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    setForm({
      name: '', description: '', price: '', imageUrl: '', fileUrl: '',
      fileName: '', fileSize: '', category: 'template', featured: false,
    })
    setEditing(null)
    setShowForm(false)
    fetchProducts()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
    fetchProducts()
  }

  function handleEdit(product: Product) {
    setEditing(product)
    setForm({
      name: product.name,
      description: product.description,
      price: (product.price / 100).toString(),
      imageUrl: product.imageUrl,
      fileUrl: product.fileUrl,
      fileName: product.fileName,
      fileSize: product.fileSize,
      category: product.category,
      featured: product.featured,
    })
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={() => {
              setEditing(null)
              setShowForm(!showForm)
              setForm({
                name: '', description: '', price: '', imageUrl: '', fileUrl: '',
                fileName: '', fileSize: '', category: 'template', featured: false,
              })
            }}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            {showForm ? 'Close' : '+ Add Product'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-8 space-y-4">
            <h2 className="text-lg font-semibold mb-4">
              {editing ? 'Edit Product' : 'New Product'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                <input
                  type="number" step="0.01" required value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url" required value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                <input
                  type="url" required value={form.fileUrl}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
                <input
                  type="text" required value={form.fileName}
                  onChange={(e) => setForm({ ...form, fileName: e.target.value })}
                  placeholder="template.zip"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
                <input
                  type="text" required value={form.fileSize}
                  onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                  placeholder="2.4 MB"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="template"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox" checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Featured
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800"
              >
                {editing ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  setShowForm(false)
                }}
                className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Product List */}
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-6"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover bg-gray-100"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  {!product.active && (
                    <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">Inactive</span>
                  )}
                  {product.featured && (
                    <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">Featured</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                <p className="text-sm font-medium mt-1">${(product.price / 100).toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}