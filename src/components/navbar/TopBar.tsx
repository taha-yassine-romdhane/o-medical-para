'use client';

import { useEffect, useState } from 'react';
import { Phone, Mail, Truck } from 'lucide-react';
import { Button } from '../ui/button';

const TopBar = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Phone,
      text: '+216 123 456 789',
      color: '#7ED321'
    },
    {
      icon: Mail,
      text: 'contact@omedical-para.tn',
      color: '#7ED321'
    },
    {
      icon: Truck,
      text: 'Livraison gratuite dès 50 TND',
      color: '#7ED321'
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
        background: 'linear-gradient(to right, #2D5016, #3A6B1B, #2D5016)',
        borderBottomColor: 'rgba(126, 211, 33, 0.3)',
        color: 'white'
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
                  backgroundColor: 'rgba(126, 211, 33, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.2)';
                }}
              >
                <Phone className="h-4 w-4" style={{ color: '#7ED321' }} />
              </div>
              <span className="font-medium text-sm">+216 123 456 789</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 cursor-pointer group">
              <div
                className="p-2 rounded-full transition-colors"
                style={{
                  backgroundColor: 'rgba(126, 211, 33, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.2)';
                }}
              >
                <Mail className="h-4 w-4" style={{ color: '#7ED321' }} />
              </div>
              <span className="font-medium">contact@omedical-para.tn</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Free Delivery */}
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4" style={{ color: '#7ED321' }} />
              <span className="font-semibold text-sm" style={{ color: 'white' }}>
                Livraison gratuite dès 50 TND
              </span>
            </div>

            {/* Help Button */}
            <Button
              variant="outline"
              size="sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '4px 12px',
                fontSize: '0.75rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7ED321';
                e.currentTarget.style.borderColor = '#7ED321';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = 'white';
              }}
            >
              Aide
            </Button>
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
                    backgroundColor: 'rgba(126, 211, 33, 0.2)',
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