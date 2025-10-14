'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, ArrowRight } from 'lucide-react';
import { WishlistItem } from '@/contexts/WishlistContext';

interface WishlistNotificationProps {
  item: WishlistItem | null;
  isVisible: boolean;
  onClose: () => void;
}

export default function WishlistNotification({ item, isVisible, onClose }: WishlistNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          onClose();
        }, 300);
      }, 3000);

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
          border: '2px solid #DC2626'
        }}
      >
        {/* Success Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
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
                justifyContent: 'center',
                animation: 'heartBeat 0.6s ease-in-out'
              }}
            >
              <Heart style={{ width: '1.25rem', height: '1.25rem', color: 'white', fill: 'white' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', margin: 0 }}>
                Ajouté aux favoris !
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                Article sauvegardé avec succès
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
                  <Heart style={{ width: '2rem', height: '2rem', color: '#9CA3AF' }} />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {item.brand && (
                <p
                  style={{
                    fontSize: '0.6875rem',
                    color: '#DC2626',
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
              <p style={{ fontSize: '0.875rem', color: item.inStock ? '#059669' : '#DC2626', marginTop: '0.25rem', fontWeight: '600' }}>
                {item.inStock ? '✓ En stock' : '✗ Rupture de stock'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link
              href="/favoris"
              onClick={onClose}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.875rem',
                background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
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
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Heart style={{ width: '1rem', height: '1rem', fill: 'white' }} />
              Voir les favoris
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
                e.currentTarget.style.borderColor = '#DC2626';
                e.currentTarget.style.color = '#DC2626';
                e.currentTarget.style.backgroundColor = '#FEE2E2';
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
              background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)',
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

          @keyframes heartBeat {
            0% {
              transform: scale(1);
            }
            25% {
              transform: scale(1.3);
            }
            50% {
              transform: scale(1);
            }
            75% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </>
  );
}
