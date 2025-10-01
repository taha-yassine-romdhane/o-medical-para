'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye, Percent, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  inStock: boolean;
  isOnSale?: boolean;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-light hover:shadow-md transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        {/* Product Image */}
        <Link href={`/produit/${product.id}`}>
          <div className="aspect-square bg-gradient-to-br from-green-50 via-gray-50 to-green-100 relative">
            {!imageError && product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Package className="h-20 w-20 mx-auto mb-3" style={{ color: '#7ED321' }} strokeWidth={1.5} />
                  <div className="space-y-2 px-4">
                    <div className="h-2 rounded-full w-24 mx-auto animate-pulse" style={{ backgroundColor: '#9FE834' }}></div>
                    <div className="h-2 rounded-full w-16 mx-auto animate-pulse" style={{ backgroundColor: '#D1D5DB' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.isOnSale && (
                <span
                  className="bg-error text-white text-xs rounded-md font-medium flex items-center"
                  style={{
                    padding: '0.5rem 0.75rem',
                    gap: '0.375rem'
                  }}
                >
                  <Percent className="h-3.5 w-3.5" />
                  -{discountPercentage}%
                </span>
              )}
              {!product.inStock && (
                <span
                  className="bg-gray text-white text-xs rounded-md font-medium"
                  style={{
                    padding: '0.5rem 0.75rem'
                  }}
                >
                  Rupture
                </span>
              )}
            </div>

            {/* Action Buttons - Show on Hover */}
            <div className={`absolute top-2 right-2 flex flex-col space-y-2 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2 rounded-full shadow-md transition-colors ${
                  isWishlisted
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray hover:bg-primary hover:text-white'
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => window.location.href = `/produit/${product.id}`}
                className="p-2 bg-white text-gray rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Link>

        {/* Quick Add to Cart - Show on Hover */}
        <div className={`absolute bottom-0 left-0 right-0 transform transition-transform duration-300 ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <button
            disabled={!product.inStock}
            className="w-full bg-primary text-white py-2 px-4 font-medium hover:bg-secondary-green disabled:bg-gray disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700 bg-accent-green/20 px-2 py-1 rounded">
            {product.brand}
          </span>
          <span className="text-xs text-gray-500">{product.category}</span>
        </div>

        {/* Product Name */}
        <Link href={`/produit/${product.id}`}>
          <h3 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Add to Cart */}
          <button
            disabled={!product.inStock}
            className="md:hidden p-2 bg-primary text-white rounded-full hover:bg-secondary-green disabled:bg-gray disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;