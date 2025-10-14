'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

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

interface FilterSidebarProps {
  categories: Category[];
  families: Family[];
  subfamilies: Subfamily[];
  brands: Brand[];
  minPrice?: number;
  maxPrice?: number;
}

export default function FilterSidebar({
  categories,
  families,
  subfamilies,
  brands,
  minPrice = 0,
  maxPrice = 1000,
}: FilterSidebarProps) {
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

  const activeFiltersCount = [categorySlug, familySlug, subfamilySlug, brandSlug, onPromo ? 'promo' : null].filter(Boolean).length;

  // Filter families based on selected category
  const filteredFamilies = categorySlug
    ? families.filter((f) => f.categoryId === categories.find((c) => c.slug === categorySlug)?.id)
    : families;

  // Filter subfamilies based on selected family
  const filteredSubfamilies = familySlug
    ? subfamilies.filter((s) => s.familyId === families.find((f) => f.slug === familySlug)?.id)
    : subfamilies;

  return (
    <div style={{
      width: '280px',
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      border: '1px solid #E5E7EB',
      padding: '1.5rem',
      height: 'fit-content',
      position: 'sticky',
      top: '100px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #F3F4F6',
      }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937' }}>
          Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.375rem 0.75rem',
              backgroundColor: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#B91C1C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#DC2626';
            }}
          >
            <X style={{ width: '0.875rem', height: '0.875rem' }} />
            Effacer
          </button>
        )}
      </div>

      {/* Promotions Section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => toggleSection('promotions')}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '0.75rem',
          }}
        >
          <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#4A4A4A' }}>Promotions</h3>
          {expandedSections.promotions ? (
            <ChevronUp style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
          ) : (
            <ChevronDown style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
          )}
        </button>
        {expandedSections.promotions && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.375rem 0.5rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: onPromo ? '#FEF2F2' : 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = onPromo ? '#FEF2F2' : '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = onPromo ? '#FEF2F2' : 'transparent';
              }}
            >
              <input
                type="checkbox"
                checked={onPromo}
                onChange={() => updateFilters('promo', onPromo ? null : 'true')}
                style={{
                  width: '0.875rem',
                  height: '0.875rem',
                  accentColor: '#DC2626',
                  cursor: 'pointer',
                }}
              />
              <span style={{
                fontSize: '0.8125rem',
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
            padding: '0.5rem 0',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '0.75rem',
          }}
        >
          <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#4A4A4A' }}>Catégories</h3>
          {expandedSections.categories ? (
            <ChevronUp style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
          ) : (
            <ChevronDown style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
          )}
        </button>
        {expandedSections.categories && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '250px', overflowY: 'auto' }}>
            {categories.map((category) => (
              <label
                key={category.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.5rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: categorySlug === category.slug ? '#F0FDE4' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = categorySlug === category.slug ? '#F0FDE4' : '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = categorySlug === category.slug ? '#F0FDE4' : 'transparent';
                }}
              >
                <input
                  type="radio"
                  name="category"
                  checked={categorySlug === category.slug}
                  onChange={() => updateFilters('category', categorySlug === category.slug ? null : category.slug)}
                  style={{
                    width: '0.875rem',
                    height: '0.875rem',
                    accentColor: '#7ED321',
                    cursor: 'pointer',
                  }}
                />
                <span style={{
                  fontSize: '0.8125rem',
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
              padding: '0.5rem 0',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '0.75rem',
            }}
          >
            <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#4A4A4A' }}>Familles</h3>
            {expandedSections.families ? (
              <ChevronUp style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
            ) : (
              <ChevronDown style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
            )}
          </button>
          {expandedSections.families && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '200px', overflowY: 'auto' }}>
              {filteredFamilies.map((family) => (
                <label
                  key={family.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.375rem 0.5rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: familySlug === family.slug ? '#F0FDE4' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = familySlug === family.slug ? '#F0FDE4' : '#F9FAFB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = familySlug === family.slug ? '#F0FDE4' : 'transparent';
                  }}
                >
                  <input
                    type="radio"
                    name="family"
                    checked={familySlug === family.slug}
                    onChange={() => updateFilters('family', familySlug === family.slug ? null : family.slug)}
                    style={{
                      width: '0.875rem',
                      height: '0.875rem',
                      accentColor: '#7ED321',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{
                    fontSize: '0.8125rem',
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
              padding: '0.5rem 0',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '0.75rem',
            }}
          >
            <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#4A4A4A' }}>Sous-familles</h3>
            {expandedSections.subfamilies ? (
              <ChevronUp style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
            ) : (
              <ChevronDown style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
            )}
          </button>
          {expandedSections.subfamilies && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '200px', overflowY: 'auto' }}>
              {filteredSubfamilies.map((subfamily) => (
                <label
                  key={subfamily.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.375rem 0.5rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: subfamilySlug === subfamily.slug ? '#F0FDE4' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = subfamilySlug === subfamily.slug ? '#F0FDE4' : '#F9FAFB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = subfamilySlug === subfamily.slug ? '#F0FDE4' : 'transparent';
                  }}
                >
                  <input
                    type="radio"
                    name="subfamily"
                    checked={subfamilySlug === subfamily.slug}
                    onChange={() => updateFilters('subfamily', subfamilySlug === subfamily.slug ? null : subfamily.slug)}
                    style={{
                      width: '0.875rem',
                      height: '0.875rem',
                      accentColor: '#7ED321',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{
                    fontSize: '0.8125rem',
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
            padding: '0.5rem 0',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '0.75rem',
          }}
        >
          <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#4A4A4A' }}>Marques</h3>
          {expandedSections.brands ? (
            <ChevronUp style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
          ) : (
            <ChevronDown style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
          )}
        </button>
        {expandedSections.brands && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '200px', overflowY: 'auto' }}>
            {brands.map((brand) => (
              <label
                key={brand.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  padding: '0.375rem 0.5rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: brandSlug === brand.slug ? '#F0FDE4' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = brandSlug === brand.slug ? '#F0FDE4' : '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = brandSlug === brand.slug ? '#F0FDE4' : 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={brandSlug === brand.slug}
                    onChange={() => updateFilters('brand', brandSlug === brand.slug ? null : brand.slug)}
                    style={{
                      width: '0.875rem',
                      height: '0.875rem',
                      accentColor: '#7ED321',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{
                    fontSize: '0.8125rem',
                    color: brandSlug === brand.slug ? '#7ED321' : '#4A4A4A',
                    fontWeight: brandSlug === brand.slug ? '600' : '400',
                  }}>
                    {brand.name}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.6875rem',
                  color: '#9CA3AF',
                  backgroundColor: '#F3F4F6',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '9999px',
                }}>
                  {brand._count.products}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div style={{ marginBottom: '0.5rem' }}>
        <button
          onClick={() => toggleSection('price')}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '0.75rem',
          }}
        >
          <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#4A4A4A' }}>Prix (TND)</h3>
          {expandedSections.price ? (
            <ChevronUp style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
          ) : (
            <ChevronDown style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
          )}
        </button>
        {expandedSections.price && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                placeholder="Min"
                style={{
                  width: '100px',
                  padding: '0.375rem 0.5rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.25rem',
                  fontSize: '0.8125rem',
                }}
              />
              <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                placeholder="Max"
                style={{
                  width: '100px',
                  padding: '0.375rem 0.5rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.25rem',
                  fontSize: '0.8125rem',
                }}
              />
            </div>
            <button
              onClick={updatePriceFilter}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#7ED321',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.8125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#6AB81E';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#7ED321';
              }}
            >
              Appliquer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
