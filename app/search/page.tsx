'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { ProductGrid } from '@/components/product-grid';
import { fetchProducts, Product } from '@/lib/api';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const allProducts = await fetchProducts();
      setProducts(allProducts);
      setLoading(false);
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (query && products.length > 0) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [query, products]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Search className="w-6 h-6 text-gray-400 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              {query ? `Search results for "${query}"` : 'Search Products'}
            </h1>
          </div>
          {query && !loading && (
            <p className="text-gray-600">
              {filteredProducts.length} product(s) found
            </p>
          )}
        </div>

        {query ? (
          <ProductGrid products={filteredProducts} loading={loading} />
        ) : (
          <div className="text-center py-12">
            <Search className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start your search</h2>
            <p className="text-gray-600">Enter a search term to find products</p>
          </div>
        )}
      </div>
    </div>
  );
}