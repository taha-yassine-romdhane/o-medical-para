'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Star, Calendar, Gift } from "lucide-react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentEvent, setCurrentEvent] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(0);

  // Main slider data
  const mainSlides = [
    {
      title: "Votre Santé,",
      subtitle: "Notre Priorité",
      description: "Découvrez notre large gamme de produits parapharmaceutiques de qualité",
      image: "/logo.jpeg",
      ctaText: "Découvrir nos produits",
      ctaLink: "/produits"
    },
    {
      title: "Promotion Spéciale",
      subtitle: "Jusqu'à -30%",
      description: "Profitez de nos offres exceptionnelles sur les vitamines et compléments",
      image: "/logo.jpeg",
      ctaText: "Voir les promotions",
      ctaLink: "/promotions"
    },
    {
      title: "Livraison Gratuite",
      subtitle: "Dès 50 TND",
      description: "Commandez en ligne et recevez vos produits directement chez vous",
      image: "/logo.jpeg",
      ctaText: "Commander maintenant",
      ctaLink: "/produits"
    }
  ];

  // Events data
  const events = [
    {
      title: "Journée Mondiale de la Santé",
      date: "7 Avril 2024",
      description: "Consultations gratuites et conseils personnalisés",
      image: "/logo.jpeg"
    },
    {
      title: "Semaine du Bien-être",
      date: "15-22 Mars 2024",
      description: "Ateliers et formations sur la nutrition",
      image: "/logo.jpeg"
    },
    {
      title: "Mois de la Beauté",
      date: "Mai 2024",
      description: "Nouveaux produits cosmétiques et soins",
      image: "/logo.jpeg"
    }
  ];

  // Special products data
  const specialProducts = [
    {
      name: "Vitamine C 1000mg",
      price: "45 TND",
      originalPrice: "60 TND",
      rating: 4.8,
      image: "/logo.jpeg",
      badge: "Bestseller"
    },
    {
      name: "Crème Anti-âge",
      price: "85 TND",
      originalPrice: "120 TND",
      rating: 4.9,
      image: "/logo.jpeg",
      badge: "Nouveau"
    },
    {
      name: "Complément Fer",
      price: "32 TND",
      originalPrice: "42 TND",
      rating: 4.7,
      image: "/logo.jpeg",
      badge: "Promo"
    }
  ];

  // Auto-slide effects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [mainSlides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEvent((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  return (
    <section
      className="relative py-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.03) 0%, rgba(107, 195, 24, 0.05) 100%)',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Main Hero Slider */}
        <div
          className="relative rounded-2xl overflow-hidden mb-6"
          style={{
            height: '380px',
            background: 'linear-gradient(135deg, #2D5016 0%, #3A6B1B 50%, #2D5016 100%)',
            borderRadius: '1rem',
            marginBottom: '1.5rem',
            marginTop: '0.5rem'
          }}
        >
          <div className="absolute inset-0">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {mainSlides.map((slide, index) => (
                <div key={index} className="w-full h-full flex-shrink-0">
                  <div
                    className="grid lg:grid-cols-2 h-full items-center"
                    style={{
                      padding: '1.5rem 2rem',
                      gap: '1.5rem'
                    }}
                  >
                    <div className="flex justify-center lg:justify-start">
                      <div className="text-white w-full" style={{ maxWidth: '36rem' }}>
                        <h1
                        className="text-3xl lg:text-5xl font-bold mb-4"
                        style={{
                          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                          fontWeight: '700',
                          lineHeight: '1.1',
                          marginBottom: '1rem'
                        }}
                      >
                        {slide.title}<br />
                        <span className="text-white/90">{slide.subtitle}</span>
                        </h1>
                        <p
                        className="text-lg mb-6 max-w-lg"
                        style={{
                          fontSize: '1.125rem',
                          lineHeight: '1.6',
                          marginBottom: '1.5rem',
                          maxWidth: '28rem',
                          color: 'rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        {slide.description}
                        </p>
                        <Link
                        href={slide.ctaLink}
                        className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                        style={{
                          backgroundColor: 'white',
                          color: '#7ED321',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '0.75rem',
                          fontWeight: '600',
                          textDecoration: 'none',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          transform: 'translateY(0)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        {slide.ctaText}
                        <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                    <div className="hidden lg:flex justify-center">
                      <div
                        className="relative"
                        style={{
                          width: '300px',
                          height: '300px',
                          borderRadius: '1rem',
                          overflow: 'hidden',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                          border: '4px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        <Image
                          src={slide.image}
                          alt={`${slide.title} ${slide.subtitle}`}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Navigation */}
          <button
            onClick={() => setCurrentSlide(currentSlide === 0 ? mainSlides.length - 1 : currentSlide - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setCurrentSlide((currentSlide + 1) % mainSlides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {mainSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="w-3 h-3 rounded-full transition-colors"
                style={{
                  backgroundColor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div
          className="grid lg:grid-cols-2 gap-6"
          style={{
            gap: '1.5rem',
            marginTop: '0.5rem',
            paddingTop: '0.5rem'
          }}
        >

          {/* Events Slider */}
          <div
            className="bg-white rounded-xl p-6 shadow-lg"
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(126, 211, 33, 0.1)'
            }}
          >
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 mr-2" style={{ color: '#7ED321' }} />
              <h3
                className="text-lg font-semibold"
                style={{ color: '#4A4A4A', fontSize: '1.125rem', fontWeight: '600' }}
              >
                Événements à venir
              </h3>
            </div>
            <div className="relative overflow-hidden" style={{ height: '200px' }}>
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentEvent * 100}%)` }}
              >
                {events.map((event, index) => (
                  <div key={index} className="w-full flex-shrink-0 pr-4">
                    <div className="flex gap-4">
                      <div
                        className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ borderRadius: '0.5rem' }}
                      >
                        <Image
                          src={event.image}
                          alt={event.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4
                          className="font-semibold mb-1"
                          style={{ color: '#4A4A4A', fontSize: '0.875rem', fontWeight: '600' }}
                        >
                          {event.title}
                        </h4>
                        <p
                          className="text-sm mb-2"
                          style={{ color: '#7ED321', fontSize: '0.75rem' }}
                        >
                          {event.date}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: '1.4' }}
                        >
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Special Products Carousel */}
          <div
            className="bg-white rounded-xl p-6 shadow-lg"
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(126, 211, 33, 0.1)',
              margin: '0.5rem'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Gift className="h-5 w-5 mr-2" style={{ color: '#7ED321' }} />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: '#4A4A4A', fontSize: '1.125rem', fontWeight: '600' }}
                >
                  Produits Spéciaux
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentProduct(currentProduct === 0 ? specialProducts.length - 1 : currentProduct - 1)}
                  className="p-1 rounded-full transition-colors"
                  style={{
                    backgroundColor: 'rgba(126, 211, 33, 0.1)',
                    color: '#7ED321',
                    border: 'none'
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentProduct((currentProduct + 1) % specialProducts.length)}
                  className="p-1 rounded-full transition-colors"
                  style={{
                    backgroundColor: 'rgba(126, 211, 33, 0.1)',
                    color: '#7ED321',
                    border: 'none'
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden" style={{ height: '200px' }}>
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentProduct * 100}%)` }}
              >
                {specialProducts.map((product, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="flex gap-4">
                      <div className="relative">
                        <div
                          className="w-20 h-20 rounded-lg overflow-hidden"
                          style={{ borderRadius: '0.5rem' }}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span
                          className="absolute -top-2 -right-2 text-xs px-2 py-1 rounded-full text-white font-medium"
                          style={{
                            backgroundColor: '#7ED321',
                            fontSize: '0.625rem'
                          }}
                        >
                          {product.badge}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4
                          className="font-semibold mb-1"
                          style={{ color: '#4A4A4A', fontSize: '0.875rem', fontWeight: '600' }}
                        >
                          {product.name}
                        </h4>
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-3 w-3"
                                style={{
                                  color: i < Math.floor(product.rating) ? '#F59E0B' : '#E5E7EB',
                                  fill: i < Math.floor(product.rating) ? '#F59E0B' : '#E5E7EB'
                                }}
                              />
                            ))}
                            <span
                              className="ml-1 text-xs"
                              style={{ color: '#6B7280', fontSize: '0.75rem' }}
                            >
                              ({product.rating})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-bold"
                            style={{ color: '#7ED321', fontSize: '1rem', fontWeight: '700' }}
                          >
                            {product.price}
                          </span>
                          <span
                            className="line-through text-sm"
                            style={{ color: '#9CA3AF', fontSize: '0.875rem' }}
                          >
                            {product.originalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;