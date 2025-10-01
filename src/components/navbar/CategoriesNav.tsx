'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pill, Sparkles, Droplet, HeartPulse, Baby, Leaf, Shield, Stethoscope, ChevronDown } from 'lucide-react';

interface Subfamily {
  id: string;
  reference: string;
  name: string;
  slug: string;
  _count: { products: number };
}

interface Family {
  id: string;
  reference: string;
  name: string;
  slug: string;
  _count: { products: number; subfamilies: number };
  subfamilies: Subfamily[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number; families: number };
  families: Family[];
}

const iconMap: { [key: string]: any } = {
  'Vitamines & Compléments': Pill,
  'Capillaires': Sparkles,
  'Soins Visage': Droplet,
  'Soins Corps': HeartPulse,
  'Bébé & Maman': Baby,
  'Bio & Naturel': Leaf,
  'Hygiène Intime': Shield,
  'Matériel Médical': Stethoscope
};

const CategoriesNav = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?include=families');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleMouseEnter = (index: number) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredIndex(null);
    }, 150);
    setCloseTimeout(timeout);
  };

  if (isLoading) {
    return (
      <div
        className="hidden md:block border-t"
        style={{
          background: 'linear-gradient(to bottom, rgba(126, 211, 33, 0.03), rgba(255, 255, 255, 0.95))',
          borderTopColor: 'rgba(126, 211, 33, 0.2)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ color: '#9CA3AF', textAlign: 'center', fontSize: '0.875rem' }}>
            Chargement des catégories...
          </div>
        </div>
      </div>
    );
  }

  const hoveredCategory = hoveredIndex !== null ? categories[hoveredIndex] : null;

  return (
    <div
      className="hidden md:block border-t"
      style={{
        background: 'linear-gradient(to bottom, rgba(126, 211, 33, 0.03), rgba(255, 255, 255, 0.95))',
        borderTopColor: 'rgba(126, 211, 33, 0.2)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 0.5rem', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.5rem 0',
            overflowX: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#7ED321 transparent'
          }}
          className="scrollbar-hide"
        >
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.name] || Pill;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={category.id}
                style={{ flexShrink: 0 }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontSize: '0.8125rem',
                    fontWeight: '500',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    backgroundColor: isHovered ? 'rgba(126, 211, 33, 0.1)' : 'transparent',
                    color: isHovered ? '#7ED321' : '#4A4A4A',
                    textDecoration: 'none',
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  <IconComponent
                    style={{
                      width: '0.9rem',
                      height: '0.9rem',
                      transition: 'color 0.2s ease'
                    }}
                  />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                  {category.families && category.families.length > 0 && (
                    <ChevronDown
                      style={{
                        width: '0.75rem',
                        height: '0.75rem',
                        transition: 'transform 0.2s ease',
                        transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  )}
                  {isHovered && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '2px',
                        backgroundColor: '#7ED321',
                        borderRadius: '2px'
                      }}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Single Large Dropdown - Position Fixed Relative to Container */}
        {hoveredCategory && hoveredCategory.families && hoveredCategory.families.length > 0 && (
          <div
            className="dropdown-menu"
            onMouseEnter={() => {
              if (closeTimeout) {
                clearTimeout(closeTimeout);
                setCloseTimeout(null);
              }
            }}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              padding: '1.5rem',
              zIndex: 1000,
              border: '1px solid #E5E7EB',
              maxHeight: '480px',
              overflowY: 'auto',
              animation: 'fadeIn 0.2s ease-in-out',
              marginTop: '0.25rem'
            }}
          >
            {/* Category Title */}
            <div
              style={{
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '2px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {(() => {
                const HoveredIcon = iconMap[hoveredCategory.name] || Pill;
                return <HoveredIcon style={{ width: '1.25rem', height: '1.25rem', color: '#7ED321' }} />;
              })()}
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#1F2937',
                  margin: 0
                }}
              >
                {hoveredCategory.name}
              </h3>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#9CA3AF',
                  marginLeft: 'auto'
                }}
              >
                {hoveredCategory._count.families} familles • {hoveredCategory._count.products} produits
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {hoveredCategory.families.map((family) => (
                <div key={family.id}>
                  {/* Family Link */}
                  <Link
                    href={`/categories/${hoveredCategory.slug}/${family.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9375rem',
                      fontWeight: '600',
                      color: '#1F2937',
                      marginBottom: '0.75rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#7ED321')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#1F2937')}
                  >
                    <span>{family.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                      ({family._count.products})
                    </span>
                  </Link>

                  {/* Subfamilies */}
                  {family.subfamilies && family.subfamilies.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1rem' }}>
                      {family.subfamilies.map((subfamily) => (
                        <Link
                          key={subfamily.id}
                          href={`/categories/${hoveredCategory.slug}/${family.slug}/${subfamily.slug}`}
                          style={{
                            fontSize: '0.8125rem',
                            color: '#6B7280',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#7ED321';
                            e.currentTarget.style.paddingLeft = '0.25rem';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#6B7280';
                            e.currentTarget.style.paddingLeft = '0';
                          }}
                        >
                          <span>→ {subfamily.name}</span>
                          <span style={{ fontSize: '0.6875rem', color: '#9CA3AF' }}>
                            ({subfamily._count.products})
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* View All Link */}
            <Link
              href={`/categories/${hoveredCategory.slug}`}
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '1.5rem',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                color: 'white',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Voir tout {hoveredCategory.name} →
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-hide::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          background: rgba(126, 211, 33, 0.3);
          border-radius: 3px;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb:hover {
          background: rgba(126, 211, 33, 0.5);
        }

        /* Dropdown scrollbar */
        .dropdown-menu::-webkit-scrollbar {
          width: 8px;
        }
        .dropdown-menu::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 4px;
        }
        .dropdown-menu::-webkit-scrollbar-thumb {
          background: rgba(126, 211, 33, 0.4);
          border-radius: 4px;
        }
        .dropdown-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(126, 211, 33, 0.6);
        }

        /* Animation */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CategoriesNav;