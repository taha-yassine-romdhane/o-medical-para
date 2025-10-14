'use client';

import { Truck, Clock, MapPin, Package, CheckCircle, Phone } from 'lucide-react';
import Link from 'next/link';

export default function LivraisonPage() {
  const deliveryZones = [
    { zone: 'Sousse et environs', delay: '24-48h', price: 'Gratuite dès 50 TND' },
    { zone: 'Autres gouvernorats', delay: '48-72h', price: '7 TND (Gratuite dès 100 TND)' },
  ];

  const deliverySteps = [
    { icon: Package, title: 'Commande validée', description: 'Votre commande est confirmée et préparée' },
    { icon: Truck, title: 'Expédition', description: 'Votre colis est en route' },
    { icon: MapPin, title: 'En cours de livraison', description: 'Le livreur est en chemin' },
    { icon: CheckCircle, title: 'Livraison effectuée', description: 'Votre commande est livrée' },
  ];

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1F4D1A 0%, #2D5F2A 100%)',
          padding: '3rem 1.5rem',
          marginBottom: '3rem'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Truck className="h-10 w-10" style={{ color: '#7ED321' }} />
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'white',
              margin: 0
            }}>
              Livraison
            </h1>
          </div>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Recevez vos produits rapidement et en toute sécurité
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
        {/* Delivery Zones */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '1.5rem' }}>
            Zones et délais de livraison
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {deliveryZones.map((zone, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #E5E7EB',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#7ED321';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <MapPin style={{ width: '1.5rem', height: '1.5rem', color: '#7ED321' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', margin: 0 }}>
                    {zone.zone}
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
                  <p style={{ color: '#6B7280', margin: 0 }}>{zone.delay}</p>
                </div>
                <div style={{
                  backgroundColor: 'rgba(126, 211, 33, 0.1)',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  marginTop: '1rem'
                }}>
                  <p style={{ color: '#1F4D1A', fontWeight: '600', margin: 0 }}>
                    {zone.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Steps */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '1.5rem' }}>
            Suivi de votre commande
          </h2>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              {deliverySteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '4rem',
                      height: '4rem',
                      backgroundColor: 'rgba(126, 211, 33, 0.1)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}>
                      <IconComponent style={{ width: '2rem', height: '2rem', color: '#7ED321' }} />
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                      {step.title}
                    </h3>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
              Modalités de paiement
            </h3>
            <ul style={{ color: '#6B7280', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Paiement à la livraison (espèces)</li>
              <li>Carte bancaire en ligne</li>
              <li>Virement bancaire</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
              Conditions de livraison
            </h3>
            <ul style={{ color: '#6B7280', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Vérification du colis avant signature</li>
              <li>Emballage sécurisé et discret</li>
              <li>Livraison 7j/7</li>
            </ul>
          </div>
        </div>

        {/* Contact CTA */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
            Questions sur votre livraison ?
          </h3>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                backgroundColor: '#7ED321',
                color: 'white',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#6AB81E';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#7ED321';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Nous contacter
            </Link>
            <a
              href="tel:+21653000666"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#7ED321',
                border: '2px solid #7ED321',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Phone style={{ width: '1.25rem', height: '1.25rem' }} />
              +216 53 000 666
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
