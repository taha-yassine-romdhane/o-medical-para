'use client';

import { Shield, Truck, HeadphonesIcon, Clock } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Truck,
      title: "Livraison Rapide",
      description: "Livraison gratuite dès 50 TND",
    },
    {
      icon: Shield,
      title: "Qualité Garantie",
      description: "Produits certifiés et contrôlés",
    },
    {
      icon: HeadphonesIcon,
      title: "Support Client",
      description: "Assistance 7j/7 par téléphone",
    },
    {
      icon: Clock,
      title: "Service 24/7",
      description: "Commandes en ligne 24h/24",
    },
  ];

  return (
    <section
      className="py-6"
      style={{
        background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.02) 0%, rgba(107, 195, 24, 0.04) 100%)',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-center p-4 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  padding: '1rem 1.5rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(126, 211, 33, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '1rem',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  cursor: 'pointer',
                  minHeight: '80px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(126, 211, 33, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(126, 211, 33, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(126, 211, 33, 0.08)';
                }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.1) 0%, rgba(107, 195, 24, 0.15) 100%)',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(126, 211, 33, 0.1)',
                    flexShrink: 0
                  }}
                >
                  <IconComponent
                    className="h-6 w-6"
                    style={{
                      color: '#7ED321',
                      width: '1.5rem',
                      height: '1.5rem'
                    }}
                  />
                </div>
                <div className="flex-1" style={{ textAlign: 'left' }}>
                  <h3
                    className="font-semibold mb-1"
                    style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#4A4A4A',
                      marginBottom: '0.25rem',
                      lineHeight: '1.2'
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      lineHeight: '1.4',
                      margin: 0
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;