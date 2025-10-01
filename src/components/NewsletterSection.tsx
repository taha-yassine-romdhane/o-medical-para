'use client';

import { useState } from 'react';
import { Mail, Send, Shield } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription for:', email);
    setEmail('');
  };

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
        paddingTop: '3rem',
        paddingBottom: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: '700',
              color: 'white',
              marginBottom: '0.5rem',
              lineHeight: '1.2'
            }}
          >
            Restez Informé
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}
          >
            Recevez nos dernières offres et conseils santé
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.75rem',
              maxWidth: '550px',
              margin: '0 auto',
              flexWrap: 'wrap'
            }}
          >
            <div
              style={{
                flex: '1 1 280px',
                position: 'relative',
                minWidth: '0'
              }}
            >
              <Mail
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: '#6B7280'
                }}
              />
              <input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  borderRadius: '0.75rem',
                  border: '2px solid transparent',
                  background: 'white',
                  color: '#1F2937',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                flex: '0 1 auto',
                padding: '0.875rem 1.75rem',
                borderRadius: '0.75rem',
                border: '2px solid white',
                background: 'white',
                color: '#7ED321',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 6px 16px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              S&apos;inscrire
              <Send style={{ width: '1rem', height: '1rem' }} />
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.9)',
              marginTop: '1.25rem'
            }}
          >
            <Shield style={{ width: '1rem', height: '1rem' }} />
            <span>Vos données sont sécurisées. Pas de spam, promis !</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;