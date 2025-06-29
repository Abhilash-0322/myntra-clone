'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { Product } from '@/lib/api';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price * 80); // Convert USD to INR approx
  };

  const getDiscountPrice = (price: number) => {
    const discountedPrice = price * 0.8; // 20% discount
    return formatPrice(discountedPrice);
  };

  const getCategoryBadge = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "men's clothing": "Men",
      "women's clothing": "Women",
      "electronics": "Electronics",
      "jewelery": "Jewelry"
    };
    return categoryMap[category] || category;
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group product-card bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 skeleton animate-pulse" />
          )}
          
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Image not available</p>
              </div>
            </div>
          ) : (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 ${
              wishlisted ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </Button>

          {/* Category Badge */}
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs"
          >
            {getCategoryBadge(product.category)}
          </Badge>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-md py-2 px-4 text-sm font-medium"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 ml-1">
                {product.rating?.rate || 0} ({product.rating?.count || 0})
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {getDiscountPrice(product.price)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-green-600 font-medium">20% OFF</span>
          </div>
        </div>
      </div>
    </Link>
  );
}