'use client';

import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight, ArrowLeft, X } from 'lucide-react';

export default function FavorisPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
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
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px'
        }}>
          <Heart style={{
            width: '4rem',
            height: '4rem',
            color: '#9CA3AF',
            margin: '0 auto 1.5rem'
          }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
            Votre liste de favoris est vide
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
            Ajoutez vos produits préférés pour les retrouver facilement
          </p>
          <Link
            href="/produits"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              color: 'white',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Découvrir nos produits
            <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>
            Mes Favoris
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>
            {items.length} article{items.length > 1 ? 's' : ''} dans vos favoris
          </p>
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            href="/produits"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              color: '#DC2626',
              textDecoration: 'none',
              fontSize: '0.9375rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              borderRadius: '0.5rem',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE2E2';
              e.currentTarget.style.borderColor = '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            Continuer mes achats
          </Link>

          <button
            onClick={() => {
              if (confirm('Êtes-vous sûr de vouloir vider votre liste de favoris ?')) {
                clearWishlist();
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              backgroundColor: 'transparent',
              color: '#DC2626',
              border: '2px solid #DC2626',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DC2626';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#DC2626';
            }}
          >
            <Trash2 style={{ width: '1rem', height: '1rem' }} />
            Vider les favoris
          </button>
        </div>

        {/* Products Grid */}
        <div className="favoris-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem'
        }}>
          <style jsx>{`
            @media (min-width: 768px) {
              .favoris-grid {
                grid-template-columns: repeat(4, 1fr) !important;
              }
            }
          `}</style>
          {items.map((item) => {
            const displayPrice = item.promoPrice || item.price;

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  border: '2px solid #FEE2E2',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(220, 38, 38, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#DC2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#FEE2E2';
                }}
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '2.5rem',
                    height: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#DC2626';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon instanceof SVGElement) {
                      (icon as any).style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon instanceof SVGElement) {
                      (icon as any).style.color = '#DC2626';
                    }
                  }}
                >
                  <X style={{ width: '1.125rem', height: '1.125rem', color: '#DC2626' }} />
                </button>

                {/* Product Image */}
                <Link href={`/produits/${item.slug}`}>
                  <div style={{ position: 'relative', paddingTop: '100%', backgroundColor: '#F3F4F6' }}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Heart style={{ width: '3rem', height: '3rem', color: '#9CA3AF' }} />
                      </div>
                    )}

                    {/* Heart Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        backgroundColor: '#FEE2E2',
                        border: '2px solid #DC2626',
                        borderRadius: '50%',
                        width: '2.5rem',
                        height: '2.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 5
                      }}
                    >
                      <Heart style={{ width: '1.125rem', height: '1.125rem', color: '#DC2626', fill: '#DC2626' }} />
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div style={{ padding: '1.25rem' }}>
                  {/* Brand */}
                  {item.brand && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#DC2626',
                      fontWeight: '700',
                      marginBottom: '0.25rem',
                      textTransform: 'uppercase'
                    }}>
                      {item.brand}
                    </p>
                  )}

                  {/* Product Name */}
                  <Link
                    href={`/produits/${item.slug}`}
                    style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1F2937',
                      textDecoration: 'none',
                      display: 'block',
                      marginBottom: '0.75rem',
                      lineHeight: '1.4',
                      minHeight: '2.8rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#DC2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#1F2937';
                    }}
                  >
                    {item.name}
                  </Link>

                  {/* Price */}
                  <div style={{ marginBottom: '1rem' }}>
                    {item.promoPrice ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          fontSize: '1.25rem',
                          fontWeight: '700',
                          color: '#DC2626'
                        }}>
                          {item.promoPrice.toFixed(2)} TND
                        </span>
                        <span style={{
                          fontSize: '0.875rem',
                          color: '#9CA3AF',
                          textDecoration: 'line-through'
                        }}>
                          {item.price.toFixed(2)} TND
                        </span>
                      </div>
                    ) : (
                      <span style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: '#1F2937'
                      }}>
                        {item.price.toFixed(2)} TND
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div style={{ marginBottom: '1rem' }}>
                    {item.inStock ? (
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#059669',
                        fontWeight: '600'
                      }}>
                        ✓ En stock
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#DC2626',
                        fontWeight: '600'
                      }}>
                        ✗ Rupture de stock
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => {
                        if (item.inStock) {
                          addToCart({
                            id: `cart-${item.productId}`,
                            productId: item.productId,
                            name: item.name,
                            slug: item.slug,
                            price: item.price,
                            promoPrice: item.promoPrice,
                            image: item.image,
                            brand: item.brand,
                            inStock: item.inStock,
                            stockQuantity: 100, // Default, you might want to fetch actual stock
                          }, 1);
                        }
                      }}
                      disabled={!item.inStock}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: item.inStock ? 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)' : '#E5E7EB',
                        color: item.inStock ? 'white' : '#9CA3AF',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: item.inStock ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (item.inStock) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 211, 33, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (item.inStock) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <ShoppingCart style={{ width: '1rem', height: '1rem' }} />
                      {item.inStock ? 'Ajouter' : 'Indisponible'}
                    </button>

                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        color: '#DC2626',
                        border: '2px solid #DC2626',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#DC2626';
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon instanceof SVGElement) {
                          (icon as any).style.color = 'white';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon instanceof SVGElement) {
                          (icon as any).style.color = '#DC2626';
                        }
                      }}
                    >
                      <Trash2 style={{ width: '1rem', height: '1rem' }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
