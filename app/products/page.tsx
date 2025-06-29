import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { ProductGrid } from '@/components/product-grid';
import { fetchProducts } from '@/lib/api';

async function AllProducts() {
  const products = await fetchProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-600">Discover our complete collection of {products.length} products</p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 skeleton animate-pulse w-48 mb-2" />
            <div className="h-4 bg-gray-200 skeleton animate-pulse w-64" />
          </div>
          <ProductGrid products={[]} loading />
        </div>
      }>
        <AllProducts />
      </Suspense>
    </div>
  );
}