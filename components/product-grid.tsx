'use client';

import { ProductCard } from './product-card';
import { Product } from '@/lib/api';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="aspect-square bg-gray-200 skeleton animate-pulse" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 skeleton animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 skeleton animate-pulse w-2/3 mb-2" />
        <div className="h-6 bg-gray-200 skeleton animate-pulse w-1/2" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No products found</div>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}