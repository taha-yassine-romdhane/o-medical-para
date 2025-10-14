'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlider {
  id: string;
  image: string;
  url: string | null;
}

interface Event {
  id: string;
  image: string;
  url: string | null;
  startDate: string;
  endDate: string;
  sortOrder: number;
  isActive: boolean;
}


const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mainSlides, setMainSlides] = useState<HeroSlider[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sliders from API
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch('/api/hero-sliders');
        const data = await res.json();
        if (data.sliders && data.sliders.length > 0) {
          setMainSlides(data.sliders);
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Auto-slide effect for main slider
  useEffect(() => {
    if (mainSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [mainSlides.length]);

  if (mainSlides.length === 0 && !isLoading) {
    return null; // Don't show anything if no sliders
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.03) 0%, rgba(107, 195, 24, 0.05) 100%)',
        paddingTop: '0',
        paddingBottom: 'clamp(0.5rem, 2vw, 1.5rem)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(0.5rem, 2vw, 1rem)' }}>

        {/* Main Hero Slider */}
        {mainSlides.length > 0 && (
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              height: 'clamp(250px, 50vw, 500px)',
              borderRadius: '1rem',
              marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
              marginTop: '0',
              position: 'relative'
            }}
          >
            <div className="absolute inset-0">
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {mainSlides.map((slide, index) => {
                  const SlideWrapper = slide.url ? Link : 'div';
                  const wrapperProps = slide.url ? { href: slide.url } : {};

                  return (
                    <div key={slide.id} className="w-full h-full flex-shrink-0" style={{ position: 'relative' }}>
                      <SlideWrapper
                        {...wrapperProps}
                        style={{
                          display: 'block',
                          width: '100%',
                          height: '100%',
                          position: 'relative',
                          cursor: slide.url ? 'pointer' : 'default',
                        }}
                      >
                        <Image
                          src={slide.image}
                          alt={`Slider ${index + 1}`}
                          fill
                          style={{ objectFit: 'contain', objectPosition: 'center' }}
                          unoptimized={slide.image.startsWith('http')}
                          priority={index === 0}
                        />
                      </SlideWrapper>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slider Navigation */}
            {mainSlides.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentSlide(currentSlide === 0 ? mainSlides.length - 1 : currentSlide - 1)}
                  className="absolute left-2 md:left-4 top-1/2 p-2 md:p-3 rounded-full transition-all hidden sm:flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#4A4A4A',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 10,
                    transform: 'translateY(-50%)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(126, 211, 33, 0.3)';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) (icon as HTMLElement).style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) (icon as HTMLElement).style.transform = 'scale(1)';
                  }}
                  aria-label="Slide précédent"
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" style={{ transition: 'transform 0.2s ease' }} />
                </button>
                <button
                  onClick={() => setCurrentSlide((currentSlide + 1) % mainSlides.length)}
                  className="absolute right-2 md:right-4 top-1/2 p-2 md:p-3 rounded-full transition-all hidden sm:flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#4A4A4A',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 10,
                    transform: 'translateY(-50%)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(126, 211, 33, 0.3)';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) (icon as HTMLElement).style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) (icon as HTMLElement).style.transform = 'scale(1)';
                  }}
                  aria-label="Slide suivant"
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6" style={{ transition: 'transform 0.2s ease' }} />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {mainSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className="w-3 h-3 rounded-full transition-all"
                      style={{
                        backgroundColor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                        border: 'none',
                        cursor: 'pointer',
                        transform: currentSlide === index ? 'scale(1.2)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Event Slider - Under Main Slider */}
        {events.length > 0 && events[0] && (
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              height: 'clamp(200px, 35vw, 350px)',
              borderRadius: '1rem',
              marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)',
              marginTop: '0',
              position: 'relative'
            }}
          >
            {(() => {
              const event = events[0];
              const EventWrapper = event.url ? Link : 'div';
              const wrapperProps = event.url ? { href: event.url } : {};

              return (
                <EventWrapper
                  {...wrapperProps}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    cursor: event.url ? 'pointer' : 'default',
                  }}
                >
                  <Image
                    src={event.image}
                    alt="Event"
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                    unoptimized={event.image.startsWith('http')}
                  />
                </EventWrapper>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
