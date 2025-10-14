'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { User, Pill, Sparkles, Droplet, HeartPulse, Baby, Leaf, Shield, Stethoscope, ChevronRight, ChevronDown } from 'lucide-react';

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

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
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

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

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

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="md:hidden border-t backdrop-blur-md"
      style={{
        background: 'white',
        borderTopColor: 'rgba(126, 211, 33, 0.3)',
        maxHeight: '70vh',
        overflowY: 'auto'
      }}
    >
      {/* Mobile Account Link - Only for logged in users */}
      {session && (
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
              color: '#4A4A4A',
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
      )}

      {/* Categories Title */}
      <div style={{ padding: '1rem 1.5rem 0.5rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Catégories
        </h3>
      </div>

      {/* Mobile Categories */}
      <nav style={{ padding: '0 1rem 1.5rem' }}>
        {isLoading ? (
          <div style={{ color: '#6B7280', textAlign: 'center', padding: '1rem' }}>
            Chargement...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {categories.map((category) => {
              const IconComponent = iconMap[category.name] || Pill;
              const isExpanded = expandedCategory === category.id;
              const hasSubcategories = category.families && category.families.length > 0;

              return (
                <div key={category.id}>
                  {/* Category Item */}
                  <div
                    onClick={() => {
                      if (hasSubcategories) {
                        setExpandedCategory(isExpanded ? null : category.id);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      borderRadius: '0.625rem',
                      transition: 'all 0.2s ease',
                      color: '#4A4A4A',
                      backgroundColor: isExpanded ? 'rgba(126, 211, 33, 0.15)' : 'transparent',
                      cursor: hasSubcategories ? 'pointer' : 'default'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <IconComponent style={{ width: '1.125rem', height: '1.125rem' }} />
                      <Link
                        href={`/produits?category=${category.slug}`}
                        onClick={onClose}
                        style={{
                          color: 'inherit',
                          textDecoration: 'none'
                        }}
                      >
                        {category.name}
                      </Link>
                    </div>
                    {hasSubcategories && (
                      <ChevronDown
                        style={{
                          width: '1rem',
                          height: '1rem',
                          opacity: 0.7,
                          transition: 'transform 0.2s ease',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                      />
                    )}
                  </div>

                  {/* Expanded Families/Subfamilies */}
                  {isExpanded && hasSubcategories && (
                    <div
                      style={{
                        marginLeft: '2rem',
                        marginTop: '0.25rem',
                        marginBottom: '0.5rem',
                        paddingLeft: '1rem',
                        borderLeft: '2px solid rgba(126, 211, 33, 0.3)'
                      }}
                    >
                      {category.families.map((family) => (
                        <div key={family.id} style={{ marginBottom: '0.75rem' }}>
                          <Link
                            href={`/produits?category=${category.slug}&family=${family.slug}`}
                            onClick={onClose}
                            style={{
                              display: 'block',
                              padding: '0.5rem',
                              fontSize: '0.8125rem',
                              fontWeight: '500',
                              color: '#4A4A4A',
                              textDecoration: 'none',
                              borderRadius: '0.375rem',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.1)';
                              e.currentTarget.style.color = '#7ED321';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#4A4A4A';
                            }}
                          >
                            {family.name} ({family._count.products})
                          </Link>

                          {/* Subfamilies */}
                          {family.subfamilies && family.subfamilies.length > 0 && (
                            <div style={{ marginLeft: '0.75rem', marginTop: '0.25rem' }}>
                              {family.subfamilies.map((subfamily) => (
                                <Link
                                  key={subfamily.id}
                                  href={`/produits?category=${category.slug}&family=${family.slug}&subfamily=${subfamily.slug}`}
                                  onClick={onClose}
                                  style={{
                                    display: 'block',
                                    padding: '0.375rem 0.5rem',
                                    fontSize: '0.75rem',
                                    color: '#6B7280',
                                    textDecoration: 'none',
                                    borderRadius: '0.25rem',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.08)';
                                    e.currentTarget.style.color = '#7ED321';
                                    e.currentTarget.style.paddingLeft = '0.625rem';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#6B7280';
                                    e.currentTarget.style.paddingLeft = '0.5rem';
                                  }}
                                >
                                  → {subfamily.name} ({subfamily._count.products})
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;