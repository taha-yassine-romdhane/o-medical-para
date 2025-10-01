'use client';

import { Store, Truck, CreditCard, Bell, Shield, Globe } from 'lucide-react';

export default function SettingsPage() {

  const settingsSections = [
    {
      icon: <Store className="h-6 w-6" />,
      title: 'Informations de la boutique',
      description: 'Nom, logo, coordonnées et informations générales',
      href: '/dashboard/admin/settings/store',
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'Livraison',
      description: 'Zones de livraison, tarifs et délais',
      href: '/dashboard/admin/settings/shipping',
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Paiement',
      description: 'Méthodes de paiement et configuration',
      href: '/dashboard/admin/settings/payment',
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Notifications',
      description: 'Emails et notifications clients',
      href: '/dashboard/admin/settings/notifications',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Sécurité',
      description: 'Gestion des accès et sécurité',
      href: '/dashboard/admin/settings/security',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'SEO & Analytics',
      description: 'Référencement et statistiques',
      href: '/dashboard/admin/settings/seo',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937' }}>
          Paramètres
        </h1>
        <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
          Gérez les paramètres de votre boutique
        </p>
      </div>

      {/* Settings Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {settingsSections.map((section) => (
          <a
            key={section.href}
            href={section.href}
            style={{
              display: 'block',
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E5E7EB',
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 211, 33, 0.2)';
              e.currentTarget.style.borderColor = '#7ED321';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
          >
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.1) 0%, rgba(107, 184, 30, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7ED321',
                marginBottom: '1rem',
              }}
            >
              {section.icon}
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
              {section.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.5' }}>
              {section.description}
            </p>
          </a>
        ))}
      </div>

      {/* Quick Actions */}
      <div
        style={{
          marginTop: '2rem',
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>
          Actions rapides
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              background: '#F3F4F6',
              color: '#4A4A4A',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
          >
            Vider le cache
          </button>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              background: '#F3F4F6',
              color: '#4A4A4A',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
          >
            Exporter les données
          </button>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              background: '#F3F4F6',
              color: '#4A4A4A',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
          >
            Sauvegarder la configuration
          </button>
        </div>
      </div>
    </div>
  );
}