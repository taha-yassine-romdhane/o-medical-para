'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Family {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

interface Subfamily {
  id: string;
  name: string;
  slug: string;
  familyId: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  families: Family[];
  subfamilies: Subfamily[];
  brands: Brand[];
  minPrice?: number;
  maxPrice?: number;
}

export default function MobileFilterModal({
  isOpen,
  onClose,
  categories,
  families,
  subfamilies,
  brands,
  minPrice = 0,
  maxPrice = 1000,
}: MobileFilterModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [expandedSections, setExpandedSections] = useState({
    promotions: false,
    categories: true,
    families: false,
    subfamilies: false,
    brands: false,
    price: false,
  });

  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : minPrice,
    max: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : maxPrice,
  });

  const categorySlug = searchParams.get('category');
  const familySlug = searchParams.get('family');
  const subfamilySlug = searchParams.get('subfamily');
  const brandSlug = searchParams.get('brand');
  const onPromo = searchParams.get('promo') === 'true';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);

      // Reset dependent filters
      if (key === 'category') {
        params.delete('family');
        params.delete('subfamily');
      } else if (key === 'family') {
        params.delete('subfamily');
      }
    } else {
      params.delete(key);
    }

    router.push(`/produits?${params.toString()}`);
  };

  const updatePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (priceRange.min > minPrice) {
      params.set('minPrice', priceRange.min.toString());
    } else {
      params.delete('minPrice');
    }

    if (priceRange.max < maxPrice) {
      params.set('maxPrice', priceRange.max.toString());
    } else {
      params.delete('maxPrice');
    }

    router.push(`/produits?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/produits');
    setPriceRange({ min: minPrice, max: maxPrice });
  };

  const applyFiltersAndClose = () => {
    updatePriceFilter();
    onClose();
  };

  const activeFiltersCount = [categorySlug, familySlug, subfamilySlug, brandSlug, onPromo ? 'promo' : null].filter(Boolean).length;

  // Filter families based on selected category
  const filteredFamilies = categorySlug
    ? families.filter((f) => f.categoryId === categories.find((c) => c.slug === categorySlug)?.id)
    : families;

  // Filter subfamilies based on selected family
  const filteredSubfamilies = familySlug
    ? subfamilies.filter((s) => s.familyId === families.find((f) => f.slug === familySlug)?.id)
    : subfamilies;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.3s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
          zIndex: 9999,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '2px solid #F3F4F6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937' }}>
            Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#F3F4F6',
              border: 'none',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E5E7EB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem', color: '#4A4A4A' }} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
        }}>
          {/* Promotions Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => toggleSection('promotions')}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginBottom: '0.75rem',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#4A4A4A' }}>Promotions</h3>
              {expandedSections.promotions ? (
                <ChevronUp style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
              ) : (
                <ChevronDown style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
              )}
            </button>
            {expandedSections.promotions && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.5rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: onPromo ? '#FEF2F2' : 'transparent',
                    border: onPromo ? '2px solid #DC2626' : '2px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!onPromo) {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!onPromo) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={onPromo}
                    onChange={() => updateFilters('promo', onPromo ? null : 'true')}
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      accentColor: '#DC2626',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{
                    fontSize: '0.9375rem',
                    color: onPromo ? '#DC2626' : '#4A4A4A',
                    fontWeight: onPromo ? '600' : '400',
                  }}>
                    Produits en promotion
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => toggleSection('categories')}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginBottom: '0.75rem',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#4A4A4A' }}>Catégories</h3>
              {expandedSections.categories ? (
                <ChevronUp style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
              ) : (
                <ChevronDown style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
              )}
            </button>
            {expandedSections.categories && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.5rem' }}>
                {categories.map((category) => (
                  <label
                    key={category.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: categorySlug === category.slug ? '#F0FDE4' : 'transparent',
                      border: categorySlug === category.slug ? '2px solid #7ED321' : '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (categorySlug !== category.slug) {
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (categorySlug !== category.slug) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={categorySlug === category.slug}
                      onChange={() => updateFilters('category', categorySlug === category.slug ? null : category.slug)}
                      style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        accentColor: '#7ED321',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{
                      fontSize: '0.9375rem',
                      color: categorySlug === category.slug ? '#7ED321' : '#4A4A4A',
                      fontWeight: categorySlug === category.slug ? '600' : '400',
                    }}>
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Families Section */}
          {filteredFamilies.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                onClick={() => toggleSection('families')}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#F9FAFB',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  marginBottom: '0.75rem',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#4A4A4A' }}>Familles</h3>
                {expandedSections.families ? (
                  <ChevronUp style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
                ) : (
                  <ChevronDown style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
                )}
              </button>
              {expandedSections.families && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.5rem' }}>
                  {filteredFamilies.map((family) => (
                    <label
                      key={family.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: familySlug === family.slug ? '#F0FDE4' : 'transparent',
                        border: familySlug === family.slug ? '2px solid #7ED321' : '2px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (familySlug !== family.slug) {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (familySlug !== family.slug) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="family"
                        checked={familySlug === family.slug}
                        onChange={() => updateFilters('family', familySlug === family.slug ? null : family.slug)}
                        style={{
                          width: '1.25rem',
                          height: '1.25rem',
                          accentColor: '#7ED321',
                          cursor: 'pointer',
                        }}
                      />
                      <span style={{
                        fontSize: '0.9375rem',
                        color: familySlug === family.slug ? '#7ED321' : '#4A4A4A',
                        fontWeight: familySlug === family.slug ? '600' : '400',
                      }}>
                        {family.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Subfamilies Section */}
          {filteredSubfamilies.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                onClick={() => toggleSection('subfamilies')}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#F9FAFB',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  marginBottom: '0.75rem',
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#4A4A4A' }}>Sous-familles</h3>
                {expandedSections.subfamilies ? (
                  <ChevronUp style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
                ) : (
                  <ChevronDown style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
                )}
              </button>
              {expandedSections.subfamilies && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.5rem' }}>
                  {filteredSubfamilies.map((subfamily) => (
                    <label
                      key={subfamily.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: subfamilySlug === subfamily.slug ? '#F0FDE4' : 'transparent',
                        border: subfamilySlug === subfamily.slug ? '2px solid #7ED321' : '2px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (subfamilySlug !== subfamily.slug) {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (subfamilySlug !== subfamily.slug) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="subfamily"
                        checked={subfamilySlug === subfamily.slug}
                        onChange={() => updateFilters('subfamily', subfamilySlug === subfamily.slug ? null : subfamily.slug)}
                        style={{
                          width: '1.25rem',
                          height: '1.25rem',
                          accentColor: '#7ED321',
                          cursor: 'pointer',
                        }}
                      />
                      <span style={{
                        fontSize: '0.9375rem',
                        color: subfamilySlug === subfamily.slug ? '#7ED321' : '#4A4A4A',
                        fontWeight: subfamilySlug === subfamily.slug ? '600' : '400',
                      }}>
                        {subfamily.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Brands Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => toggleSection('brands')}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginBottom: '0.75rem',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#4A4A4A' }}>Marques</h3>
              {expandedSections.brands ? (
                <ChevronUp style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
              ) : (
                <ChevronDown style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
              )}
            </button>
            {expandedSections.brands && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                {brands.map((brand) => (
                  <label
                    key={brand.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: brandSlug === brand.slug ? '#F0FDE4' : 'transparent',
                      border: brandSlug === brand.slug ? '2px solid #7ED321' : '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (brandSlug !== brand.slug) {
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (brandSlug !== brand.slug) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="checkbox"
                        checked={brandSlug === brand.slug}
                        onChange={() => updateFilters('brand', brandSlug === brand.slug ? null : brand.slug)}
                        style={{
                          width: '1.25rem',
                          height: '1.25rem',
                          accentColor: '#7ED321',
                          cursor: 'pointer',
                        }}
                      />
                      <span style={{
                        fontSize: '0.9375rem',
                        color: brandSlug === brand.slug ? '#7ED321' : '#4A4A4A',
                        fontWeight: brandSlug === brand.slug ? '600' : '400',
                      }}>
                        {brand.name}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#9CA3AF',
                      backgroundColor: '#F3F4F6',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      fontWeight: '600',
                    }}>
                      {brand._count.products}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Section */}
          <div>
            <button
              onClick={() => toggleSection('price')}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#F9FAFB',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginBottom: '0.75rem',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#4A4A4A' }}>Prix (TND)</h3>
              {expandedSections.price ? (
                <ChevronUp style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
              ) : (
                <ChevronDown style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280' }} />
              )}
            </button>
            {expandedSections.price && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    placeholder="Min"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.9375rem',
                    }}
                  />
                  <span style={{ color: '#6B7280', fontWeight: '600' }}>-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    placeholder="Max"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.9375rem',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Sticky Buttons */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '2px solid #F3F4F6',
          display: 'flex',
          gap: '0.75rem',
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'white',
        }}>
          <button
            onClick={clearAllFilters}
            style={{
              flex: 1,
              padding: '0.875rem',
              backgroundColor: 'white',
              color: '#DC2626',
              border: '2px solid #DC2626',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE2E2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Effacer tout
          </button>
          <button
            onClick={applyFiltersAndClose}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 211, 33, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Appliquer les filtres
          </button>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}
