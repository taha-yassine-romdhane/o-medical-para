'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus, X, ShoppingBag, ArrowRight, Package, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen && items.length === 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, items.length]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 999,
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Dropdown */}
      <div
        style={{
          position: 'fixed',
          top: '5rem',
          right: '1rem',
          width: '420px',
          maxWidth: 'calc(100vw - 2rem)',
          maxHeight: 'calc(100vh - 7rem)',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'slideInFromTop 0.3s ease-out',
        }}
      >
        <style jsx>{`
          @keyframes slideInFromTop {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes wiggle {
            0%, 100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(-10deg);
            }
            75% {
              transform: rotate(10deg);
            }
          }

          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes sparkle {
            0%, 100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.2) rotate(180deg);
            }
          }

          .bounce-animation {
            animation: bounce 1s ease-in-out infinite;
          }

          .wiggle-animation {
            animation: wiggle 0.5s ease-in-out infinite;
          }

          .sparkle-animation {
            animation: sparkle 1.5s ease-in-out infinite;
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            padding: '1.25rem',
            borderBottom: '2px solid #F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                borderRadius: '0.75rem',
                padding: '0.625rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingCart style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                Mon Panier
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>
                {items.length} article{items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE2E2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem', color: '#4A4A4A' }} />
          </button>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              background: 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 50%, #F0FDF4 100%)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <div
                className={animate ? 'bounce-animation' : ''}
                style={{
                  background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                  borderRadius: '50%',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(126, 211, 33, 0.3)',
                }}
              >
                <ShoppingBag
                  className={animate ? 'wiggle-animation' : ''}
                  style={{ width: '3rem', height: '3rem', color: 'white' }}
                />
              </div>
              <Zap
                className={animate ? 'sparkle-animation' : ''}
                style={{
                  position: 'absolute',
                  top: '-0.5rem',
                  right: '-0.5rem',
                  width: '1.5rem',
                  height: '1.5rem',
                  color: '#FBBF24',
                  fill: '#FBBF24',
                }}
              />
            </div>

            <div>
              <h4
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#1F2937',
                  marginBottom: '0.5rem',
                }}
              >
                Votre panier est vide
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.6' }}>
                Découvrez nos produits et commencez<br />
                votre shopping dès maintenant ! 🎉
              </p>
            </div>

            <Link
              href="/produits"
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.75rem',
                background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                color: 'white',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9375rem',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(126, 211, 33, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(126, 211, 33, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 211, 33, 0.3)';
              }}
            >
              <ShoppingBag style={{ width: '1.125rem', height: '1.125rem' }} />
              Commencer mes achats
              <ArrowRight style={{ width: '1.125rem', height: '1.125rem' }} />
            </Link>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '1rem',
              }}
            >
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#FEF3C7',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#92400E',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <Zap style={{ width: '0.875rem', height: '0.875rem' }} />
                Livraison rapide
              </div>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#DBEAFE',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#1E40AF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <Package style={{ width: '0.875rem', height: '0.875rem' }} />
                Meilleurs prix
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div
              style={{
                maxHeight: 'calc(100vh - 19rem)',
                overflowY: 'auto',
                padding: '1rem',
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #E5E7EB',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px',
                      flexShrink: 0,
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      backgroundColor: 'white',
                    }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#F3F4F6',
                        }}
                      >
                        <ShoppingCart style={{ width: '2rem', height: '2rem', color: '#9CA3AF' }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      href={`/produits/${item.slug}`}
                      onClick={onClose}
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#1F2937',
                        textDecoration: 'none',
                        display: 'block',
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#7ED321';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#1F2937';
                      }}
                    >
                      {item.name}
                    </Link>

                    {item.brand && (
                      <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0 0 0.5rem 0' }}>
                        {item.brand}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          style={{
                            width: '1.75rem',
                            height: '1.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #E5E7EB',
                            backgroundColor: 'white',
                            color: '#4A4A4A',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#7ED321';
                            e.currentTarget.style.color = '#7ED321';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#E5E7EB';
                            e.currentTarget.style.color = '#4A4A4A';
                          }}
                        >
                          <Minus style={{ width: '0.875rem', height: '0.875rem' }} />
                        </button>

                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', minWidth: '1.5rem', textAlign: 'center' }}>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          style={{
                            width: '1.75rem',
                            height: '1.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #E5E7EB',
                            backgroundColor: 'white',
                            color: '#4A4A4A',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#7ED321';
                            e.currentTarget.style.color = '#7ED321';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#E5E7EB';
                            e.currentTarget.style.color = '#4A4A4A';
                          }}
                        >
                          <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
                        </button>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#7ED321', margin: 0 }}>
                          {((item.promoPrice || item.price) * item.quantity).toFixed(2)} TND
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      color: '#DC2626',
                      transition: 'all 0.2s',
                      alignSelf: 'flex-start',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <X style={{ width: '1.125rem', height: '1.125rem' }} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '1.25rem',
                borderTop: '2px solid #F3F4F6',
                backgroundColor: '#F9FAFB',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: '600', color: '#4A4A4A' }}>Total</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#7ED321' }}>
                  {getCartTotal().toFixed(2)} TND
                </span>
              </div>

              <Link
                href="/panier"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.875rem',
                  background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                  color: 'white',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(126, 211, 33, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(126, 211, 33, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 211, 33, 0.3)';
                }}
              >
                Voir mon panier
                <ArrowRight style={{ width: '1.125rem', height: '1.125rem' }} />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
