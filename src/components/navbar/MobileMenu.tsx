import Link from 'next/link';
import { User, Pill, Sparkles, Droplet, HeartPulse, Baby, Leaf, Shield, Stethoscope, ChevronRight } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const categories = [
    { name: 'Vitamines & Compléments', icon: Pill },
    { name: 'Capillaires', icon: Sparkles },
    { name: 'Soins Visage', icon: Droplet },
    { name: 'Soins Corps', icon: HeartPulse },
    { name: 'Bébé & Maman', icon: Baby },
    { name: 'Bio & Naturel', icon: Leaf },
    { name: 'Hygiène intime', icon: Shield },
    { name: 'Matériel Médical', icon: Stethoscope }
  ];

  if (!isOpen) return null;

  return (
    <div
      className="md:hidden border-t backdrop-blur-md"
      style={{
        background: 'linear-gradient(to bottom, #1F4D1A, #2D5F2A)',
        borderTopColor: 'rgba(126, 211, 33, 0.3)',
        maxHeight: '70vh',
        overflowY: 'auto'
      }}
    >
      {/* Mobile Account Link */}
      <div style={{ padding: '1rem 1rem 0.5rem' }}>
        <Link
          href="/compte"
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1rem',
            borderRadius: '0.75rem',
            transition: 'all 0.2s ease',
            color: 'rgba(255, 255, 255, 0.95)',
            backgroundColor: 'rgba(126, 211, 33, 0.15)',
            border: '1px solid rgba(126, 211, 33, 0.3)',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(126, 211, 33, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(126, 211, 33, 0.3)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <User style={{ width: '1.25rem', height: '1.25rem' }} />
            <span style={{ fontWeight: '600', fontSize: '0.9375rem' }}>Mon Compte</span>
          </div>
          <ChevronRight style={{ width: '1rem', height: '1rem' }} />
        </Link>
      </div>

      {/* Categories Title */}
      <div style={{ padding: '1rem 1.5rem 0.5rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Catégories
        </h3>
      </div>

      {/* Mobile Categories */}
      <nav style={{ padding: '0 1rem 1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                href={`/categorie/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'et')}`}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: '0.625rem',
                  transition: 'all 0.2s ease',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: 'transparent',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.12)';
                  e.currentTarget.style.color = '#9FE834';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <IconComponent style={{ width: '1.125rem', height: '1.125rem' }} />
                  <span>{category.name}</span>
                </div>
                <ChevronRight style={{ width: '0.875rem', height: '0.875rem', opacity: 0.6 }} />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;