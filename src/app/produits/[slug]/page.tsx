'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Minus, Plus, ChevronRight, Star, Package, Truck, Shield, ArrowLeft, Pill, Droplet, Heart as HeartIcon, Sparkles, SprayCan } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface Product {
  id: string;
  reference: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  promoPrice: number | null;
  promoPercentage: number | null;
  isOnPromo: boolean;
  stockQuantity: number;
  inStock: boolean;
  brand: { id: string; name: string; slug: string } | null;
  category: { id: string; name: string; slug: string } | null;
  family: { id: string; name: string; slug: string } | null;
  subfamily: { id: string; name: string; slug: string } | null;
  images: ProductImage[];
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products?slug=${slug}`);
        const data = await response.json();

        if (response.ok && data.product) {
          setProduct(data.product);
          // Set primary image as selected
          const primaryImage = data.product.images?.find((img: ProductImage) => img.isPrimary);
          setSelectedImage(primaryImage?.url || data.product.images?.[0]?.url || '/placeholder-product.png');
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#6B7280' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: '500' }}>Chargement du produit...</div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
            Produit non trouvé
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            href="/produits"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#7ED321',
              color: 'white',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6AB81E';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#7ED321';
            }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const displayPrice = product.isOnPromo && product.promoPrice ? product.promoPrice : product.price;
  const sortedImages = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);

  // Get placeholder icon based on category
  const getPlaceholderIcon = () => {
    const categoryName = product.category?.name?.toLowerCase() || '';

    if (categoryName.includes('bébé') || categoryName.includes('bebe') || categoryName.includes('maman')) {
      return <HeartIcon style={{ width: '10rem', height: '10rem', color: '#7ED321', strokeWidth: 1.5 }} />;
    } else if (categoryName.includes('soin') || categoryName.includes('crème') || categoryName.includes('creme') || categoryName.includes('hydrat')) {
      return <Droplet style={{ width: '10rem', height: '10rem', color: '#7ED321', strokeWidth: 1.5 }} />;
    } else if (categoryName.includes('complément') || categoryName.includes('complement') || categoryName.includes('vitamine')) {
      return <Pill style={{ width: '10rem', height: '10rem', color: '#7ED321', strokeWidth: 1.5 }} />;
    } else if (categoryName.includes('maquillage') || categoryName.includes('beauté') || categoryName.includes('beaute')) {
      return <Sparkles style={{ width: '10rem', height: '10rem', color: '#7ED321', strokeWidth: 1.5 }} />;
    } else if (categoryName.includes('parfum') || categoryName.includes('eau')) {
      return <SprayCan style={{ width: '10rem', height: '10rem', color: '#7ED321', strokeWidth: 1.5 }} />;
    } else {
      return <Package style={{ width: '10rem', height: '10rem', color: '#7ED321', strokeWidth: 1.5 }} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#7ED321'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
              Accueil
            </Link>
            <ChevronRight style={{ width: '1rem', height: '1rem' }} />
            <Link href="/produits" style={{ color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#7ED321'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
              Produits
            </Link>
            {product.category && (
              <>
                <ChevronRight style={{ width: '1rem', height: '1rem' }} />
                <Link
                  href={`/produits?category=${product.category.slug}`}
                  style={{ color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#7ED321'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight style={{ width: '1rem', height: '1rem' }} />
            <span style={{ color: '#1F2937', fontWeight: '600' }}>{product.name}</span>
          </div>
        </nav>

        {/* Product Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Images Section */}
            <div>
              {/* Main Image */}
              <div style={{
                position: 'relative',
                backgroundColor: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                marginBottom: '1rem',
                border: '1px solid #E5E7EB',
                paddingTop: '100%'
              }}>
                {product.isOnPromo && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#DC2626',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '700',
                    zIndex: 10
                  }}>
                    -{product.promoPercentage}%
                  </div>
                )}
                {selectedImage && selectedImage !== '/placeholder-product.png' ? (
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                ) : (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)'
                  }}>
                    <div style={{
                      textAlign: 'center',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}>
                      {getPlaceholderIcon()}
                      <p style={{
                        marginTop: '1.5rem',
                        fontSize: '1.125rem',
                        color: '#6B7280',
                        fontWeight: '600'
                      }}>
                        Image non disponible
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {sortedImages.length > 1 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {sortedImages.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image.url)}
                      style={{
                        position: 'relative',
                        paddingTop: '100%',
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        border: selectedImage === image.url ? '2px solid #7ED321' : '1px solid #E5E7EB',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedImage !== image.url) {
                          e.currentTarget.style.borderColor = '#7ED321';
                          e.currentTarget.style.opacity = '0.8';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedImage !== image.url) {
                          e.currentTarget.style.borderColor = '#E5E7EB';
                          e.currentTarget.style.opacity = '1';
                        }
                      }}
                    >
                      <Image
                        src={image.url}
                        alt={`${product.name} - Image ${image.sortOrder + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div>
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid #E5E7EB'
              }}>
                {/* Brand */}
                {product.brand && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <Link
                      href={`/produits?brand=${product.brand.slug}`}
                      style={{
                        display: 'inline-block',
                        fontSize: '0.875rem',
                        color: '#7ED321',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#6AB81E'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#7ED321'}
                    >
                      {product.brand.name}
                    </Link>
                  </div>
                )}

                {/* Product Name */}
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#1F2937',
                  marginBottom: '1rem',
                  lineHeight: '1.2'
                }}>
                  {product.name}
                </h1>

                {/* Reference */}
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  marginBottom: '1.5rem'
                }}>
                  Référence: <strong>{product.reference}</strong>
                </p>

                {/* Rating (placeholder) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        style={{
                          width: '1.25rem',
                          height: '1.25rem',
                          fill: i < 4 ? '#FBBF24' : '#E5E7EB',
                          color: i < 4 ? '#FBBF24' : '#E5E7EB'
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    (24 avis)
                  </span>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '2rem' }}>
                  {product.isOnPromo && product.promoPrice ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <span style={{
                          fontSize: '2.5rem',
                          fontWeight: '700',
                          color: '#DC2626'
                        }}>
                          {product.promoPrice.toFixed(2)} TND
                        </span>
                        <span style={{
                          fontSize: '1.5rem',
                          color: '#9CA3AF',
                          textDecoration: 'line-through'
                        }}>
                          {product.price.toFixed(2)} TND
                        </span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#DC2626', fontWeight: '600' }}>
                        Vous économisez {(product.price - product.promoPrice).toFixed(2)} TND ({product.promoPercentage}%)
                      </p>
                    </div>
                  ) : (
                    <span style={{
                      fontSize: '2.5rem',
                      fontWeight: '700',
                      color: '#1F2937'
                    }}>
                      {product.price.toFixed(2)} TND
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: product.inStock ? '#ECFDF5' : '#FEE2E2',
                  borderRadius: '0.5rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      color: product.inStock ? '#059669' : '#DC2626'
                    }} />
                    <span style={{
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      color: product.inStock ? '#059669' : '#DC2626'
                    }}>
                      {product.inStock ? `En stock (${product.stockQuantity} disponible${product.stockQuantity > 1 ? 's' : ''})` : 'Rupture de stock'}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                {product.inStock && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#4A4A4A',
                      marginBottom: '0.5rem'
                    }}>
                      Quantité
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        overflow: 'hidden'
                      }}>
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                          style={{
                            padding: '0.75rem 1rem',
                            backgroundColor: 'white',
                            border: 'none',
                            cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                            color: quantity <= 1 ? '#9CA3AF' : '#4A4A4A',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (quantity > 1) e.currentTarget.style.backgroundColor = '#F3F4F6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                          }}
                        >
                          <Minus style={{ width: '1.25rem', height: '1.25rem' }} />
                        </button>
                        <span style={{
                          padding: '0.75rem 1.5rem',
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          color: '#1F2937',
                          minWidth: '60px',
                          textAlign: 'center'
                        }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= product.stockQuantity}
                          style={{
                            padding: '0.75rem 1rem',
                            backgroundColor: 'white',
                            border: 'none',
                            cursor: quantity >= product.stockQuantity ? 'not-allowed' : 'pointer',
                            color: quantity >= product.stockQuantity ? '#9CA3AF' : '#4A4A4A',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (quantity < product.stockQuantity) e.currentTarget.style.backgroundColor = '#F3F4F6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                          }}
                        >
                          <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                  <button
                    onClick={() => {
                      if (product) {
                        const primaryImage = product.images.find(img => img.isPrimary);
                        addToCart({
                          id: `cart-${product.id}`,
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          promoPrice: product.promoPrice,
                          image: primaryImage?.url || product.images[0]?.url || null,
                          brand: product.brand?.name || null,
                          inStock: product.inStock,
                          stockQuantity: product.stockQuantity,
                        }, quantity);
                      }
                    }}
                    disabled={!product.inStock}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      padding: '1rem',
                      backgroundColor: product.inStock ? '#7ED321' : '#E5E7EB',
                      color: product.inStock ? 'white' : '#9CA3AF',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      cursor: product.inStock ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (product.inStock) {
                        e.currentTarget.style.backgroundColor = '#6AB81E';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 211, 33, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (product.inStock) {
                        e.currentTarget.style.backgroundColor = '#7ED321';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <ShoppingCart style={{ width: '1.5rem', height: '1.5rem' }} />
                    {product.inStock ? 'Ajouter au panier' : 'Indisponible'}
                  </button>

                  <button
                    onClick={() => {
                      if (product) {
                        const inWishlist = isInWishlist(product.id);
                        if (inWishlist) {
                          removeFromWishlist(product.id);
                        } else {
                          const primaryImage = product.images.find(img => img.isPrimary);
                          addToWishlist({
                            id: `wishlist-${product.id}`,
                            productId: product.id,
                            name: product.name,
                            slug: product.slug,
                            price: product.price,
                            promoPrice: product.promoPrice,
                            image: primaryImage?.url || product.images[0]?.url || null,
                            brand: product.brand?.name || null,
                            inStock: product.inStock,
                          });
                        }
                      }
                    }}
                    style={{
                      padding: '1rem',
                      backgroundColor: product && isInWishlist(product.id) ? '#FEE2E2' : 'white',
                      border: `2px solid ${product && isInWishlist(product.id) ? '#DC2626' : '#E5E7EB'}`,
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#DC2626';
                      e.currentTarget.style.backgroundColor = '#FEE2E2';
                    }}
                    onMouseLeave={(e) => {
                      if (product && isInWishlist(product.id)) {
                        e.currentTarget.style.borderColor = '#DC2626';
                        e.currentTarget.style.backgroundColor = '#FEE2E2';
                      } else {
                        e.currentTarget.style.borderColor = '#E5E7EB';
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <Heart
                      style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        color: '#DC2626',
                        fill: product && isInWishlist(product.id) ? '#DC2626' : 'none'
                      }}
                    />
                  </button>
                </div>

                {/* Features */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  padding: '1.5rem',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Truck style={{ width: '1.5rem', height: '1.5rem', color: '#7ED321' }} />
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>Livraison rapide</p>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>2-3 jours ouvrés</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Shield style={{ width: '1.5rem', height: '1.5rem', color: '#7ED321' }} />
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>Paiement sécurisé</p>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>100% sécurisé</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {product.description && (
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1F2937',
                marginBottom: '1rem'
              }}>
                Description
              </h2>
              <div style={{
                fontSize: '1rem',
                lineHeight: '1.7',
                color: '#4A4A4A',
                whiteSpace: 'pre-wrap'
              }}>
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
