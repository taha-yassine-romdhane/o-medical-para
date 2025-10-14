'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award } from 'lucide-react';

interface Brand {
  name: string;
  slug: string;
}

export default function BrandsSection() {
  const brands: Brand[] = [
    { name: 'SVR', slug: 'svr' },
    { name: 'Filorga', slug: 'filorga' },
    { name: 'Sensilis', slug: 'sensilis' },
    { name: 'ISDIN', slug: 'isdin' },
    { name: 'Avène', slug: 'avene' },
    { name: 'La Roche-Posay', slug: 'la-roche-posay' },
    { name: 'Pharmaceris', slug: 'pharmaceris' },
    { name: 'Dermacare', slug: 'dermacare' },
    { name: 'Vichy', slug: 'vichy' },
    { name: 'Activ', slug: 'activ' },
    { name: 'Biolane', slug: 'biolane' },
    { name: 'Mustela', slug: 'mustela' },
    { name: 'Orthomed', slug: 'orthomed' },
    { name: 'Yuwell', slug: 'yuwell' },
    { name: 'Spengler', slug: 'spengler' },
    { name: 'Rossmax', slug: 'rossmax' }
  ];

  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (slug: string) => {
    setImageErrors(prev => new Set(prev).add(slug));
  };

  // Duplicate brands for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section style={{
      padding: 'clamp(1.5rem, 4vw, 3rem) 0',
      background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.03) 0%, rgba(156, 163, 175, 0.05) 100%)',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 clamp(0.75rem, 2vw, 1.5rem)',
        marginBottom: 'clamp(1rem, 2vw, 2rem)'
      }}>
        {/* Section Header */}
        <div>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
              borderRadius: '50%',
              padding: '0.5rem',
              boxShadow: '0 4px 12px rgba(126, 211, 33, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award style={{
                color: 'white',
                width: '1.5rem',
                height: '1.5rem'
              }} />
            </div>
            Nos Marques Partenaires
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#6B7280',
            marginLeft: '3.25rem'
          }}>
            Découvrez nos produits par marque
          </p>
        </div>
      </div>

      {/* Infinite Scrolling Carousel */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        padding: 'clamp(1rem, 2vw, 2rem) 0'
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-33.333%);
              }
            }

            .brands-slider {
              animation: scroll 30s linear infinite;
            }

            .brands-slider:hover {
              animation-play-state: paused;
            }
          `
        }} />

        <div
          className="brands-slider"
          style={{
            display: 'flex',
            gap: 'clamp(1.5rem, 3vw, 3rem)',
            alignItems: 'center',
            width: 'max-content',
            padding: '0 clamp(1rem, 2vw, 2rem)'
          }}
        >
          {duplicatedBrands.map((brand, index) => {
            const hasError = imageErrors.has(brand.slug);

            return (
              <Link
                key={index}
                href={`/produits?brand=${brand.slug}`}
                style={{
                  minWidth: 'clamp(120px, 25vw, 200px)',
                  height: 'clamp(70px, 15vw, 120px)',
                  padding: 'clamp(1rem, 2vw, 2rem) clamp(1.25rem, 2.5vw, 2.5rem)',
                  background: 'white',
                  borderRadius: 'clamp(0.75rem, 1.5vw, 1rem)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(126, 211, 33, 0.25)';
                  e.currentTarget.style.borderColor = '#7ED321';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {!hasError ? (
                  <div style={{
                    position: 'relative',
                    width: 'clamp(90px, 20vw, 160px)',
                    height: 'clamp(40px, 10vw, 70px)'
                  }}>
                    <Image
                      src={`/brands/${brand.slug}.png`}
                      alt={brand.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      onError={() => handleImageError(brand.slug)}
                      unoptimized
                    />
                  </div>
                ) : (
                  <span style={{
                    fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                    fontWeight: '700',
                    color: '#1F2937',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    {brand.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
