import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { ProductGrid } from '@/components/product-grid';
import { fetchProductsByCategory, fetchCategories } from '@/lib/api';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  try {
    const categories = await fetchCategories();
    return categories.map((category) => ({
      category: encodeURIComponent(category.toLowerCase()),
    }));
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    return [];
  }
}

async function CategoryProducts({ category }: { category: string }) {
  try {
    const decodedCategory = decodeURIComponent(category);
    const products = await fetchProductsByCategory(decodedCategory);

    if (products.length === 0) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h1>
            <p className="text-gray-600">
              We couldn't find any products in the "{decodedCategory}" category.
            </p>
          </div>
        </div>
      );
    }

    const categoryName = decodedCategory
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <span>Home</span> / <span className="text-gray-900">{categoryName}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName}</h1>
          <p className="text-gray-600">Showing {products.length} products</p>
        </div>
        <ProductGrid products={products} />
      </div>
    );
  } catch (error) {
    console.error('Error loading category products:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h1>
          <p className="text-gray-600">
            There was an error loading products for this category. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

function CategoryLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-4 bg-gray-200 skeleton animate-pulse w-32 mb-4" />
        <div className="h-8 bg-gray-200 skeleton animate-pulse w-48 mb-2" />
        <div className="h-4 bg-gray-200 skeleton animate-pulse w-32" />
      </div>
      <ProductGrid products={[]} loading />
    </div>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={<CategoryLoadingSkeleton />}>
        <CategoryProducts category={params.category} />
      </Suspense>
    </div>
  );
}