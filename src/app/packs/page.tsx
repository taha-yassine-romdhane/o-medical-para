'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, ShoppingCart, Tag, TrendingDown } from 'lucide-react';

interface PackItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    promoPrice: number | null;
    reference: string;
    brand: { name: string } | null;
    images: { url: string }[];
  };
}

interface Pack {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string;
  packPrice: number;
  totalPrice: number;
  isActive: boolean;
  isFeatured: boolean;
  items: PackItem[];
}

export default function PacksPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const res = await fetch('/api/packs?active=true');
        const data = await res.json();
        setPacks(data.packs || []);
      } catch (error) {
        console.error('Error fetching packs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPacks();
  }, []);

  const calculateSavings = (totalPrice: number, packPrice: number) => {
    const savings = totalPrice - packPrice;
    const percentage = ((savings / totalPrice) * 100).toFixed(0);
    return { savings, percentage };
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Package className="h-12 w-12 mx-auto mb-4" style={{ color: '#7ED321' }} />
          <p style={{ color: '#6B7280' }}>Chargement des packs...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1F4D1A 0%, #2D5F2A 100%)',
          padding: '3rem 1.5rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Package className="h-10 w-10" style={{ color: '#7ED321' }} />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'white',
              margin: 0
            }}>
              Nos Packs Exclusifs
            </h1>
          </div>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Découvrez nos packs de produits à prix avantageux
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
        {packs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <Package className="h-16 w-16 mx-auto mb-4" style={{ color: '#D1D5DB' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
              Aucun pack disponible
            </h3>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Revenez plus tard pour découvrir nos offres exclusives
            </p>
            <Link
              href="/produits"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#7ED321',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600'
              }}
            >
              Voir tous les produits
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {packs.map((pack) => {
              const { savings, percentage } = calculateSavings(pack.totalPrice, pack.packPrice);

              return (
                <Link
                  key={pack.id}
                  href={`/packs/${pack.slug}`}
                  style={{
                    textDecoration: 'none',
                    display: 'block'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Pack Image */}
                    <div style={{ position: 'relative', paddingBottom: '75%', backgroundColor: '#F3F4F6' }}>
                      {pack.image ? (
                        <Image
                          src={pack.image}
                          alt={pack.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized={pack.image.startsWith('http')}
                        />
                      ) : (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Package style={{ width: '4rem', height: '4rem', color: '#D1D5DB' }} />
                        </div>
                      )}

                      {/* Savings Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        backgroundColor: '#DC2626',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}>
                        -{percentage}%
                      </div>

                      {/* Featured Badge */}
                      {pack.isFeatured && (
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          left: '1rem',
                          backgroundColor: '#7ED321',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          Exclusif
                        </div>
                      )}
                    </div>

                    {/* Pack Info */}
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: '#1F2937',
                        marginBottom: '0.5rem',
                        lineHeight: '1.3'
                      }}>
                        {pack.name}
                      </h3>

                      {pack.description && (
                        <p style={{
                          color: '#6B7280',
                          fontSize: '0.875rem',
                          marginBottom: '1rem',
                          lineHeight: '1.5'
                        }}>
                          {pack.description.length > 80 ? pack.description.substring(0, 80) + '...' : pack.description}
                        </p>
                      )}

                      {/* Products Count */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        color: '#6B7280'
                      }}>
                        <Package className="h-4 w-4" />
                        <span>{pack.items.length} produit{pack.items.length > 1 ? 's' : ''}</span>
                      </div>

                      {/* Pricing */}
                      <div style={{ marginTop: 'auto' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                            Prix normal:
                          </span>
                          <span style={{
                            fontSize: '1rem',
                            color: '#9CA3AF',
                            textDecoration: 'line-through'
                          }}>
                            {pack.totalPrice.toFixed(2)} TND
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                            Prix du pack:
                          </span>
                          <span style={{
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            color: '#7ED321'
                          }}>
                            {pack.packPrice.toFixed(2)} TND
                          </span>
                        </div>
                        <div style={{
                          marginTop: '0.5rem',
                          padding: '0.5rem',
                          backgroundColor: 'rgba(126, 211, 33, 0.1)',
                          borderRadius: '0.375rem',
                          textAlign: 'center'
                        }}>
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#1F4D1A'
                          }}>
                            Économisez {savings.toFixed(2)} TND
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
