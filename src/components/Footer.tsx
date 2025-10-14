'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Heart, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navigationLinks = [
    { href: "/produits", label: "Nos Produits" },
    { href: "/packs", label: "Nos Packs" },
    { href: "/promotions", label: "Promotions" },
    { href: "/conseils", label: "Conseils Santé" },
  ];

  const serviceLinks = [
    { href: "/contact", label: "Nous Contacter" },
    { href: "/livraison", label: "Livraison" },
    { href: "/retours", label: "Retours" },
    { href: "/faq", label: "FAQ" },
  ];

  const contactInfo = [
    { icon: Phone, text: "+216 53 000 666" },
    { icon: Mail, text: "contact@omedical-para.tn" },
    { icon: MapPin, text: "Sousse, Tunisie" },
    { icon: Clock, text: "7j/7 de 9h à 20h" },
  ];

  const socialMediaLinks = [
    {
      icon: Facebook,
      url: 'https://www.facebook.com/OMedicalStoreMsaken',
      label: 'Facebook',
      color: '#1877F2'
    },
    {
      icon: Instagram,
      url: 'https://www.instagram.com/omedical_store',
      label: 'Instagram',
      color: '#E1306C'
    }
  ];

  return (
    <footer
      style={{
        background: 'white',
        color: '#1F2937',
        paddingTop: '3rem',
        paddingBottom: '2rem',
        borderTop: '2px solid #E5E7EB'
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
            <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Votre parapharmacie de confiance en Tunisie. Qualité, expertise et service client d&apos;exception.
            </p>
            <div className="flex space-x-6 mt-4">
              {socialMediaLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-3 rounded-full transition-all duration-300"
                  style={{
                    color: '#4A4A4A',
                    backgroundColor: '#F3F4F6',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.color;
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                    e.currentTarget.style.color = '#4A4A4A';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontWeight: '700',
                fontSize: '1.125rem',
                color: '#1F2937',
                marginBottom: '1.5rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #E5E7EB'
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
                      color: hoveredLink === `nav-${index}` ? '#7ED321' : '#6B7280',
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
                color: '#1F2937',
                marginBottom: '1.5rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #E5E7EB'
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
                      color: hoveredLink === `service-${index}` ? '#7ED321' : '#6B7280',
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
                color: '#1F2937',
                marginBottom: '1.5rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #E5E7EB'
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
                        background: 'rgba(126, 211, 33, 0.15)',
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
                    <span style={{ color: '#4A4A4A', fontSize: '0.875rem', fontWeight: '500' }}>
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
            borderTop: '2px solid #E5E7EB',
            marginTop: '3rem',
            paddingTop: '2rem',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              background: '#F9FAFB',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              border: '1px solid #E5E7EB'
            }}
          >
            <p style={{ color: '#4A4A4A', fontSize: '0.875rem', fontWeight: '500' }}>
              © {currentYear} Medical Store Parapharmacie. Tous droits réservés.
            </p>
            <p
              style={{
                color: '#7ED321',
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
              <Heart style={{ width: '1rem', height: '1rem', fill: '#7ED321' }} />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;