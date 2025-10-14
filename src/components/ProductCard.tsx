'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, Percent, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  reference: string;
  price: number;
  promoPrice: number | null;
  isOnPromo?: boolean;
  inStock: boolean;
  stockQuantity: number;
  brand: { name: string } | null;
  images: { url: string }[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const discountPercentage = product.promoPrice
    ? Math.round(((product.price - product.promoPrice) / product.price) * 100)
    : 0;

  const displayPrice = product.promoPrice || product.price;
  const originalPrice = product.promoPrice ? product.price : null;
  const productImage = product.images && product.images.length > 0 ? product.images[0].url : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      promoPrice: product.promoPrice,
      image: productImage,
      brand: product.brand?.name || null,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        promoPrice: product.promoPrice,
        image: productImage,
        brand: product.brand?.name || null,
        inStock: product.inStock,
      });
    }
  };

  // Get placeholder icon
  const getPlaceholderIcon = () => {
    return <Package className="h-24 w-24 mx-auto" style={{ color: '#7ED321' }} strokeWidth={1.5} />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
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
        <Link href={`/produits/${product.slug}`}>
          <div className="aspect-square bg-gradient-to-br from-green-50 via-gray-50 to-green-100 relative">
            {!imageError && productImage ? (
              <Image
                src={productImage}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
                unoptimized={productImage.startsWith('http')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100 animate-pulse"></div>

                {/* Decorative circles */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-green-100 opacity-50"></div>
                <div className="absolute bottom-6 left-6 w-16 h-16 rounded-full bg-green-50 opacity-50"></div>

                {/* Icon and text */}
                <div className="text-center relative z-10">
                  {getPlaceholderIcon()}
                  <p className="mt-4 text-sm font-medium text-gray-400">Image non disponible</p>
                  <div className="space-y-2 px-4 mt-3">
                    <div className="h-1.5 rounded-full w-20 mx-auto animate-pulse" style={{ backgroundColor: 'rgba(126, 211, 33, 0.3)' }}></div>
                    <div className="h-1.5 rounded-full w-12 mx-auto animate-pulse" style={{ backgroundColor: 'rgba(126, 211, 33, 0.2)' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.isOnPromo && (
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

            {/* Action Buttons - Always show on mobile, hover on desktop */}
            <div className={`absolute top-2 right-2 flex flex-col space-y-2 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'lg:opacity-0 opacity-100'
            }`}>
              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full shadow-md transition-colors ${
                  isWishlisted
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray hover:bg-primary hover:text-white'
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/produits/${product.slug}`;
                }}
                className="p-2 bg-white text-gray rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Link>

        {/* Quick Add to Cart - Desktop only (hover) */}
        <div className={`hidden lg:block absolute bottom-0 left-0 right-0 transform transition-transform duration-300 ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <button
            onClick={handleAddToCart}
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
        {/* Brand & Reference */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700 bg-accent-green/20 px-2 py-1 rounded">
            {product.brand?.name || 'Sans marque'}
          </span>
          <span className="text-xs text-gray-500">{product.reference}</span>
        </div>

        {/* Product Name */}
        <Link href={`/produits/${product.slug}`}>
          <h3 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Stock Status */}
        <div className="mb-3">
          {product.inStock ? (
            <span className="text-xs text-green-600">
              En stock ({product.stockQuantity} disponibles)
            </span>
          ) : (
            <span className="text-xs text-red-600">Rupture de stock</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900">
              {formatPrice(displayPrice)}
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Add to Cart Icon */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="lg:hidden p-2 bg-primary text-white rounded-full hover:bg-secondary-green disabled:bg-gray disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;