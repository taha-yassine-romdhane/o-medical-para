'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navigationLinks = [
    { href: "/produits", label: "Nos Produits" },
    { href: "/promotions", label: "Promotions" },
    { href: "/marques", label: "Marques" },
    { href: "/conseils", label: "Conseils Santé" },
  ];

  const serviceLinks = [
    { href: "/contact", label: "Nous Contacter" },
    { href: "/livraison", label: "Livraison" },
    { href: "/retours", label: "Retours" },
    { href: "/faq", label: "FAQ" },
  ];

  const contactInfo = [
    { icon: Phone, text: "+216 XX XXX XXX" },
    { icon: Mail, text: "contact@omedical-para.tn" },
    { icon: MapPin, text: "Sousse, Tunisie" },
    { icon: Clock, text: "7j/7 - 24h/24" },
  ];

  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #1F4D1A 0%, #2D5F2A 100%)',
        color: 'white',
        paddingTop: '3rem',
        paddingBottom: '2rem',
        borderTop: '1px solid rgba(126, 211, 33, 0.2)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Company Info */}
          <div>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                marginBottom: '1.5rem',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Image
                src="/logo/logo-web.png"
                alt="Medical Store Parapharmacie"
                width={180}
                height={90}
                quality={100}
                style={{
                  height: 'auto',
                  width: '180px',
                  borderRadius: '0.75rem',
                  background: 'white',
                  padding: '0.5rem'
                }}
              />
            </Link>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.6' }}>
              Votre parapharmacie de confiance en Tunisie. Qualité, expertise et service client d&apos;exception.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontWeight: '700',
                fontSize: '1.125rem',
                color: 'white',
                marginBottom: '1.5rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid rgba(126, 211, 33, 0.3)'
              }}
            >
              Navigation
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    onMouseEnter={() => setHoveredLink(`nav-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{
                      color: hoveredLink === `nav-${index}` ? '#7ED321' : 'rgba(255, 255, 255, 0.8)',
                      backgroundColor: hoveredLink === `nav-${index}` ? 'rgba(126, 211, 33, 0.1)' : 'transparent',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      transition: 'all 0.2s ease',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'block',
                      textDecoration: 'none'
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Client */}
          <div>
            <h4
              style={{
                fontWeight: '700',
                fontSize: '1.125rem',
                color: 'white',
                marginBottom: '1.5rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid rgba(126, 211, 33, 0.3)'
              }}
            >
              Service Client
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    onMouseEnter={() => setHoveredLink(`service-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{
                      color: hoveredLink === `service-${index}` ? '#7ED321' : 'rgba(255, 255, 255, 0.8)',
                      backgroundColor: hoveredLink === `service-${index}` ? 'rgba(126, 211, 33, 0.1)' : 'transparent',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      transition: 'all 0.2s ease',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'block',
                      textDecoration: 'none'
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontWeight: '700',
                fontSize: '1.125rem',
                color: 'white',
                marginBottom: '1.5rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid rgba(126, 211, 33, 0.3)'
              }}
            >
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        background: 'rgba(126, 211, 33, 0.2)',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        marginRight: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <IconComponent style={{ width: '1rem', height: '1rem', color: '#7ED321' }} />
                    </div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', fontWeight: '500' }}>
                      {contact.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(126, 211, 33, 0.3)',
            marginTop: '3rem',
            paddingTop: '2rem',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              background: 'rgba(126, 211, 33, 0.1)',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', fontWeight: '500' }}>
              © {currentYear} Medical Store Parapharmacie. Tous droits réservés.
            </p>
            <p
              style={{
                color: '#9FE834',
                fontSize: '0.875rem',
                marginTop: '0.5rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              Votre santé, notre engagement
              <Heart style={{ width: '1rem', height: '1rem', fill: '#9FE834' }} />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;