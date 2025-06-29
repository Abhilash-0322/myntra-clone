import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { ProductGrid } from '@/components/product-grid';
import { fetchProducts } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function FeaturedProducts() {
  try {
    const products = await fetchProducts();
    const featuredProducts = products.slice(0, 8); // Show first 8 products

    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-600">Discover our handpicked selection of trending items</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">View All</Link>
          </Button>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    );
  } catch (error) {
    console.error('Error loading featured products:', error);
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-gray-600">Unable to load featured products. Please try again later.</p>
        </div>
      </section>
    );
  }
}

function CategorySection() {
  const categories = [
    { 
      name: 'Women\'s Fashion', 
      href: '/category/women\'s clothing',
      image: 'https://images.pexels.com/photos/794064/pexels-photo-794064.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop'
    },
    { 
      name: 'Men\'s Fashion', 
      href: '/category/men\'s clothing',
      image: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop'
    },
    { 
      name: 'Electronics', 
      href: '/category/electronics',
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop'
    },
    { 
      name: 'Jewelry', 
      href: '/category/jewelery',
      image: 'https://images.pexels.com/photos/1454/hand-woman-girl-flowers.jpg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop'
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our diverse range of products across different categories
        </p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative overflow-hidden rounded-xl aspect-square hover:shadow-xl transition-all duration-300"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundImage: `url(${category.image})` }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-xl font-bold text-center px-4">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 bg-gray-200 skeleton animate-pulse w-64 mb-2" />
          <div className="h-4 bg-gray-200 skeleton animate-pulse w-96" />
        </div>
        <div className="h-10 bg-gray-200 skeleton animate-pulse w-24" />
      </div>
      <ProductGrid products={[]} loading />
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <Suspense fallback={<LoadingSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </div>
  );
}