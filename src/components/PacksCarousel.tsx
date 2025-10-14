'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

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
}

const PacksCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch packs from API
  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const res = await fetch('/api/packs?active=true');
        const data = await res.json();
        if (data.packs && data.packs.length > 0) {
          setPacks(data.packs);
        }
      } catch (error) {
        console.error('Error fetching packs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPacks();
  }, []);

  // Calculate items per slide based on screen size
  const itemsPerSlide = isMobile ? 2 : 4;
  const totalSlides = Math.ceil(packs.length / itemsPerSlide);

  // Auto-slide effect
  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const handlePrevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
  };

  const handleNextSlide = () => {
    setCurrentSlide((currentSlide + 1) % totalSlides);
  };

  if (packs.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section
      className="py-8"
      style={{
        background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.02) 0%, rgba(107, 195, 24, 0.04) 100%)',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(0.5rem, 2vw, 1rem)' }}>
        {packs.length > 0 && (
          <div
            className="bg-white rounded-xl shadow-lg p-4 lg:p-8"
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(126, 211, 33, 0.15)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div style={{
                  backgroundColor: 'rgba(126, 211, 33, 0.1)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}>
                  <Package className="h-6 w-6" style={{ color: '#7ED321' }} />
                </div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: '#1F2937', fontSize: '1.25rem', fontWeight: '700' }}
                >
                  Packs Exclusifs
                </h3>
              </div>
              {totalSlides > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevSlide}
                    className="p-2 rounded-lg transition-all"
                    style={{
                      backgroundColor: 'rgba(126, 211, 33, 0.1)',
                      color: '#7ED321',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#7ED321';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.1)';
                      e.currentTarget.style.color = '#7ED321';
                    }}
                    aria-label="Packs précédents"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="p-2 rounded-lg transition-all"
                    style={{
                      backgroundColor: 'rgba(126, 211, 33, 0.1)',
                      color: '#7ED321',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#7ED321';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.1)';
                      e.currentTarget.style.color = '#7ED321';
                    }}
                    aria-label="Packs suivants"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Carousel Container */}
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="w-full flex-shrink-0"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                      gap: '1rem',
                      padding: '0.5rem'
                    }}
                  >
                    {packs
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((pack) => {
                        const savings = pack.totalPrice - pack.packPrice;
                        const savingsPercent = ((savings / pack.totalPrice) * 100).toFixed(0);

                        return (
                          <Link
                            key={pack.id}
                            href={`/packs/${pack.slug}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <div
                              className="flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300"
                              style={{
                                backgroundColor: 'white',
                                border: '1px solid rgba(126, 211, 33, 0.1)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                cursor: 'pointer',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(126, 211, 33, 0.15)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                              }}
                            >
                              {/* Image */}
                              <div className="relative" style={{ paddingTop: '100%', position: 'relative' }}>
                                {pack.image && pack.image.trim() !== '' ? (
                                  <Image
                                    src={pack.image}
                                    alt={pack.name}
                                    fill
                                    className="object-cover"
                                    unoptimized={pack.image.startsWith('http')}
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
                                    justifyContent: 'center',
                                    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)'
                                  }}>
                                    <Package style={{ width: '3rem', height: '3rem', color: '#9CA3AF' }} />
                                  </div>
                                )}
                                <span
                                  className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full text-white font-bold shadow-lg"
                                  style={{
                                    backgroundColor: '#DC2626',
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  -{savingsPercent}%
                                </span>
                              </div>

                              {/* Content */}
                              <div style={{ padding: '1rem' }}>
                                <h4
                                  className="font-bold mb-2"
                                  style={{
                                    color: '#1F2937',
                                    fontSize: '0.95rem',
                                    fontWeight: '700',
                                    lineHeight: '1.3',
                                    minHeight: '2.6rem',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {pack.name}
                                </h4>
                                {pack.description && (
                                  <p
                                    className="text-sm mb-3"
                                    style={{
                                      color: '#9CA3AF',
                                      fontSize: '0.8rem',
                                      lineHeight: '1.4',
                                      minHeight: '2.4rem',
                                      overflow: 'hidden',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                    }}
                                  >
                                    {pack.description}
                                  </p>
                                )}
                                <div className="flex flex-col gap-1">
                                  <span
                                    className="font-bold"
                                    style={{ color: '#7ED321', fontSize: '1.25rem', fontWeight: '700' }}
                                  >
                                    {pack.packPrice.toFixed(2)} TND
                                  </span>
                                  <span
                                    className="line-through"
                                    style={{ color: '#9CA3AF', fontSize: '0.875rem' }}
                                  >
                                    {pack.totalPrice.toFixed(2)} TND
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            {totalSlides > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      backgroundColor: currentSlide === index ? '#7ED321' : 'rgba(126, 211, 33, 0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      transform: currentSlide === index ? 'scale(1.3)' : 'scale(1)',
                    }}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PacksCarousel;
