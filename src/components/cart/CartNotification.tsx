'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Check, ShoppingCart, ArrowRight } from 'lucide-react';
import { CartItem } from '@/contexts/CartContext';

interface CartNotificationProps {
  item: CartItem | null;
  isVisible: boolean;
  onClose: () => void;
}

export default function CartNotification({ item, isVisible, onClose }: CartNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          onClose();
        }, 300); // Wait for exit animation
      }, 3000); // Show for 3 seconds

      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);

  if (!isVisible && !isAnimating) return null;
  if (!item) return null;

  const displayPrice = item.promoPrice || item.price;

  return (
    <>
      {/* Overlay - only on mobile */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          opacity: isAnimating ? 1 : 0,
          transition: 'opacity 0.3s ease',
          display: 'block',
          pointerEvents: isAnimating ? 'auto' : 'none'
        }}
        className="md:hidden"
      />

      {/* Notification */}
      <div
        style={{
          position: 'fixed',
          top: isAnimating ? '20px' : '-200px',
          right: '20px',
          width: 'calc(100% - 40px)',
          maxWidth: '400px',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          border: '2px solid #7ED321'
        }}
      >
        {/* Success Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Check style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', margin: 0 }}>
                Ajouté au panier !
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                Article ajouté avec succès
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
          </button>
        </div>

        {/* Product Details */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Product Image */}
            <div
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                backgroundColor: '#F3F4F6',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                flexShrink: 0
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
                    justifyContent: 'center'
                  }}
                >
                  <ShoppingCart style={{ width: '2rem', height: '2rem', color: '#9CA3AF' }} />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {item.brand && (
                <p
                  style={{
                    fontSize: '0.6875rem',
                    color: '#7ED321',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    marginBottom: '0.25rem'
                  }}
                >
                  {item.brand}
                </p>
              )}
              <h4
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '0.5rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.name}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937' }}>
                  {displayPrice.toFixed(2)} TND
                </span>
                {item.promoPrice && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#9CA3AF',
                      textDecoration: 'line-through'
                    }}
                  >
                    {item.price.toFixed(2)} TND
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                Quantité: {item.quantity}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link
              href="/panier"
              onClick={onClose}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.875rem',
                background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                color: 'white',
                borderRadius: '0.75rem',
                fontSize: '0.9375rem',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.2s',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 211, 33, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <ShoppingCart style={{ width: '1rem', height: '1rem' }} />
              Voir le panier
            </Link>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.875rem',
                backgroundColor: 'white',
                color: '#4A4A4A',
                border: '2px solid #E5E7EB',
                borderRadius: '0.75rem',
                fontSize: '0.9375rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7ED321';
                e.currentTarget.style.color = '#7ED321';
                e.currentTarget.style.backgroundColor = '#F0FDE4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.color = '#4A4A4A';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Continuer
              <ArrowRight style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: '4px',
            backgroundColor: '#E5E7EB',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #7ED321 0%, #6AB81E 100%)',
              width: '100%',
              animation: isAnimating ? 'progress 3s linear' : 'none',
              transformOrigin: 'left'
            }}
          />
        </div>

        <style jsx>{`
          @keyframes progress {
            from {
              transform: scaleX(1);
            }
            to {
              transform: scaleX(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}
