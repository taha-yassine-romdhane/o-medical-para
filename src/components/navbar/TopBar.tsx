'use client';

import { useEffect, useState } from 'react';
import { Phone, Mail, Truck } from 'lucide-react';
import { Button } from '../ui/button';

const TopBar = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Phone,
      text: '+216 53 000 666',
      color: '#2D5016'
    },
    {
      icon: Mail,
      text: 'contact@omedical-para.tn',
      color: '#2D5016'
    },
    {
      icon: Truck,
      text: 'Livraison gratuite dès 50 TND',
      color: '#2D5016'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div
      className="border-b"
      style={{
        background: 'linear-gradient(to right, #6BC318, #7ED321, #6BC318)',
        borderBottomColor: 'rgba(45, 80, 22, 0.3)',
        color: '#2D5016'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Desktop View */}
        <div className="hidden md:flex justify-between items-center h-10 text-sm">
          <div className="flex items-center gap-8">
            {/* Phone */}
            <div className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 cursor-pointer group">
              <div
                className="p-2 rounded-full transition-colors"
                style={{
                  backgroundColor: 'rgba(45, 80, 22, 0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(45, 80, 22, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(45, 80, 22, 0.15)';
                }}
              >
                <Phone className="h-4 w-4" style={{ color: '#2D5016' }} />
              </div>
              <span className="font-medium text-sm">+216 53 000 666</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 cursor-pointer group">
              <div
                className="p-2 rounded-full transition-colors"
                style={{
                  backgroundColor: 'rgba(45, 80, 22, 0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(45, 80, 22, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(45, 80, 22, 0.15)';
                }}
              >
                <Mail className="h-4 w-4" style={{ color: '#2D5016' }} />
              </div>
              <span className="font-medium">contact@omedical-para.tn</span>
            </div>
          </div>

          {/* Free Delivery */}
          <div className="flex items-center gap-3 hover:opacity-90 transition-all duration-200">
            <div
              className="p-2 rounded-full transition-colors"
              style={{
                backgroundColor: 'rgba(45, 80, 22, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(45, 80, 22, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(45, 80, 22, 0.15)';
              }}
            >
              <Truck className="h-4 w-4" style={{ color: '#2D5016' }} />
            </div>
            <span className="font-semibold text-sm" style={{ color: '#2D5016' }}>
              Livraison gratuite dès 50 TND
            </span>
          </div>
        </div>

        {/* Mobile View - Sliding Animation */}
        <div className="md:hidden flex justify-center items-center h-10 overflow-hidden relative">
          {slides.map((slide, index) => {
            const IconComponent = slide.icon;
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.5s ease-in-out',
                  opacity: currentSlide === index ? 1 : 0,
                  transform: currentSlide === index ? 'translateY(0)' : 'translateY(10px)'
                }}
              >
                <div
                  style={{
                    padding: '0.375rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(45, 80, 22, 0.15)',
                  }}
                >
                  <IconComponent style={{ width: '0.875rem', height: '0.875rem', color: slide.color }} />
                </div>
                <span style={{ fontWeight: '500', fontSize: '0.75rem' }}>{slide.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopBar;