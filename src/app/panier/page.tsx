'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Package } from 'lucide-react';

export default function PanierPage() {
  const { items, removeFromCart, removePack, updateQuantity, getCartTotal, clearCart } = useCart();

  // Group items by pack
  const groupedItems = items.reduce((acc, item) => {
    if (item.packId) {
      if (!acc.packs[item.packId]) {
        acc.packs[item.packId] = {
          packName: item.packName || 'Pack',
          items: []
        };
      }
      acc.packs[item.packId].items.push(item);
    } else {
      acc.individual.push(item);
    }
    return acc;
  }, { packs: {} as Record<string, { packName: string; items: typeof items }>, individual: [] as typeof items });

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
          <ShoppingBag style={{
            width: '4rem',
            height: '4rem',
            color: '#9CA3AF',
            margin: '0 auto 1.5rem'
          }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
            Votre panier est vide
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
            Découvrez nos produits et ajoutez-les à votre panier
          </p>
          <Link
            href="/produits"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              backgroundColor: '#7ED321',
              color: 'white',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6AB81E';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#7ED321';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Découvrir nos produits
            <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
          </Link>
        </div>
      </div>
    );
  }

  const total = getCartTotal();
  const packCount = Object.keys(groupedItems.packs).length;
  const individualCount = groupedItems.individual.length;

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>
            Mon Panier
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>
            {packCount > 0 && `${packCount} pack${packCount > 1 ? 's' : ''}`}
            {packCount > 0 && individualCount > 0 && ' • '}
            {individualCount > 0 && `${individualCount} produit${individualCount > 1 ? 's' : ''} individuel${individualCount > 1 ? 's' : ''}`}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Cart Items */}
            <div style={{ gridColumn: 'span 2' }}>
              {/* Clear Cart Button */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem 1rem 0 0',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937' }}>
                  Articles
                </h2>
                <button
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
                      clearCart();
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: '#DC2626',
                    border: '1px solid #DC2626',
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
                  Vider le panier
                </button>
              </div>

              <div style={{
                backgroundColor: 'white',
                borderRadius: '0 0 1rem 1rem',
                border: '1px solid #E5E7EB',
                borderTop: 'none',
                overflow: 'hidden'
              }}>
                {/* Packs Section */}
                {Object.entries(groupedItems.packs).map(([packId, pack]) => {
                  const packTotal = pack.items.reduce((sum, item) => {
                    const price = item.promoPrice || item.price;
                    return sum + price * item.quantity;
                  }, 0);

                  return (
                    <div key={packId} style={{
                      borderBottom: '1px solid #E5E7EB',
                      padding: '1.5rem',
                      backgroundColor: 'rgba(126, 211, 33, 0.02)'
                    }}>
                      {/* Pack Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Package style={{ width: '1.5rem', height: '1.5rem', color: '#7ED321' }} />
                          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937' }}>
                            {pack.packName}
                          </h3>
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#7ED321',
                            backgroundColor: 'rgba(126, 211, 33, 0.1)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontWeight: '600'
                          }}>
                            Pack
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer le pack "${pack.packName}" du panier ?`)) {
                              removePack(packId);
                            }
                          }}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#DC2626',
                            cursor: 'pointer',
                            borderRadius: '0.375rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
                        </button>
                      </div>

                      {/* Pack Items */}
                      <div style={{ display: 'grid', gap: '0.75rem', marginLeft: '2.25rem' }}>
                        {pack.items.map((item) => {
                          const displayPrice = item.promoPrice || item.price;
                          const itemTotal = displayPrice * item.quantity;

                          return (
                            <div key={item.id} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem',
                              padding: '0.75rem',
                              backgroundColor: 'white',
                              borderRadius: '0.5rem',
                              border: '1px solid #E5E7EB'
                            }}>
                              <div style={{
                                width: '60px',
                                height: '60px',
                                position: 'relative',
                                borderRadius: '0.5rem',
                                overflow: 'hidden',
                                backgroundColor: '#F3F4F6',
                                flexShrink: 0
                              }}>
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    unoptimized={item.image.startsWith('http')}
                                  />
                                ) : (
                                  <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <Package style={{ width: '1.5rem', height: '1.5rem', color: '#D1D5DB' }} />
                                  </div>
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1F2937' }}>
                                  {item.name}
                                </h4>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                  Qté: {item.quantity}
                                </p>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#7ED321' }}>
                                  {itemTotal.toFixed(2)} TND
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Pack Total */}
                      <div style={{
                        marginTop: '1rem',
                        marginLeft: '2.25rem',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(126, 211, 33, 0.1)',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                          Total du pack:
                        </span>
                        <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#7ED321' }}>
                          {packTotal.toFixed(2)} TND
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Individual Products Section */}
                {groupedItems.individual.length > 0 && (
                  <>
                    {packCount > 0 && (
                      <div style={{
                        padding: '1rem 1.5rem',
                        backgroundColor: '#F9FAFB',
                        borderBottom: '1px solid #E5E7EB'
                      }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937' }}>
                          Produits individuels
                        </h3>
                      </div>
                    )}
                    {groupedItems.individual.map((item) => {
                      const displayPrice = item.promoPrice || item.price;
                      const itemTotal = displayPrice * item.quantity;

                      return (
                        <div key={item.id} style={{
                          padding: '1.5rem',
                          borderBottom: '1px solid #E5E7EB',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.5rem'
                        }}>
                          <Link
                            href={`/produits/${item.slug}`}
                            style={{
                              width: '100px',
                              height: '100px',
                              position: 'relative',
                              borderRadius: '0.75rem',
                              overflow: 'hidden',
                              backgroundColor: '#F3F4F6',
                              flexShrink: 0,
                              display: 'block'
                            }}
                          >
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                unoptimized={item.image.startsWith('http')}
                              />
                            ) : (
                              <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <ShoppingBag style={{ width: '2.5rem', height: '2.5rem', color: '#D1D5DB' }} />
                              </div>
                            )}
                          </Link>

                          <div style={{ flex: 1 }}>
                            <Link href={`/produits/${item.slug}`} style={{ textDecoration: 'none' }}>
                              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                                {item.name}
                              </h3>
                            </Link>
                            {item.brand && (
                              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                                {item.brand}
                              </p>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '0.5rem' }}>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  style={{
                                    padding: '0.5rem',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                    opacity: item.quantity <= 1 ? 0.5 : 1
                                  }}
                                >
                                  <Minus style={{ width: '1rem', height: '1rem', color: '#1F2937' }} />
                                </button>
                                <span style={{ padding: '0 1rem', fontSize: '1rem', fontWeight: '500' }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  disabled={item.quantity >= item.stockQuantity}
                                  style={{
                                    padding: '0.5rem',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: item.quantity >= item.stockQuantity ? 'not-allowed' : 'pointer',
                                    opacity: item.quantity >= item.stockQuantity ? 0.5 : 1
                                  }}
                                >
                                  <Plus style={{ width: '1rem', height: '1rem', color: '#1F2937' }} />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                style={{
                                  padding: '0.5rem',
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  color: '#DC2626',
                                  cursor: 'pointer',
                                  borderRadius: '0.375rem',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
                              </button>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#7ED321', marginBottom: '0.25rem' }}>
                              {itemTotal.toFixed(2)} TND
                            </p>
                            {item.promoPrice && (
                              <p style={{ fontSize: '0.875rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                                {(item.price * item.quantity).toFixed(2)} TND
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid #E5E7EB',
                position: 'sticky',
                top: '2rem'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937', marginBottom: '1.5rem' }}>
                  Récapitulatif
                </h2>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#6B7280' }}>Total</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#7ED321' }}>
                      {total.toFixed(2)} TND
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#7ED321',
                    color: 'white',
                    borderRadius: '0.75rem',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1.125rem',
                    transition: 'all 0.2s',
                    marginBottom: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#6AB81E';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#7ED321';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Commander
                  <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
                </Link>

                <Link
                  href="/produits"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'transparent',
                    color: '#7ED321',
                    border: '1px solid #7ED321',
                    borderRadius: '0.75rem',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
