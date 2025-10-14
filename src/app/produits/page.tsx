'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Filter, X, SlidersHorizontal, Package, Pill, Droplet, Heart as HeartIcon, Sparkles, SprayCan } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import FilterSidebar from '@/components/products/FilterSidebar';
import MobileFilterModal from '@/components/products/MobileFilterModal';

interface Product {
  id: string;
  reference: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  promoPrice: number | null;
  promoPercentage: number | null;
  isOnPromo: boolean;
  stockQuantity: number;
  inStock: boolean;
  brand: { id: string; name: string } | null;
  category: { id: string; name: string; slug: string } | null;
  family: { id: string; name: string; slug: string } | null;
  subfamily: { id: string; name: string; slug: string } | null;
  images?: { url: string; isPrimary: boolean }[];
}

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

export default function ProduitsPage() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [subfamilies, setSubfamilies] = useState<Subfamily[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter states from URL params
  const categorySlug = searchParams.get('category');
  const familySlug = searchParams.get('family');
  const subfamilySlug = searchParams.get('subfamily');
  const brandSlug = searchParams.get('brand');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const searchQuery = searchParams.get('search');
  const promoFilter = searchParams.get('promo');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch ALL products (without pagination limit)
        const productsRes = await fetch('/api/products?include=images&limit=10000');
        const productsData = await productsRes.json();

        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();

        // Fetch families
        const familiesRes = await fetch('/api/families');
        const familiesData = await familiesRes.json();

        // Fetch subfamilies
        const subfamiliesRes = await fetch('/api/subfamilies');
        const subfamiliesData = await subfamiliesRes.json();

        // Fetch brands
        const brandsRes = await fetch('/api/brands');
        const brandsData = await brandsRes.json();

        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
        setFamilies(familiesData.families || []);
        setSubfamilies(subfamiliesData.subfamilies || []);
        setBrands(brandsData.brands || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever products or filter params change
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.reference.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.brand?.name.toLowerCase().includes(query) ||
        p.category?.name.toLowerCase().includes(query) ||
        p.family?.name.toLowerCase().includes(query) ||
        p.subfamily?.name.toLowerCase().includes(query)
      );
    }

    if (categorySlug) {
      filtered = filtered.filter(p => p.category?.slug === categorySlug);
    }

    if (familySlug) {
      filtered = filtered.filter(p => p.family?.slug === familySlug);
    }

    if (subfamilySlug) {
      filtered = filtered.filter(p => p.subfamily?.slug === subfamilySlug);
    }

    if (brandSlug) {
      filtered = filtered.filter(p => p.brand?.slug === brandSlug);
    }

    if (minPrice) {
      const min = Number(minPrice);
      filtered = filtered.filter(p => {
        const price = p.isOnPromo && p.promoPrice ? p.promoPrice : p.price;
        return price >= min;
      });
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      filtered = filtered.filter(p => {
        const price = p.isOnPromo && p.promoPrice ? p.promoPrice : p.price;
        return price <= max;
      });
    }

    if (promoFilter === 'true') {
      filtered = filtered.filter(p => p.isOnPromo);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [products, searchQuery, categorySlug, familySlug, subfamilySlug, brandSlug, minPrice, maxPrice, promoFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const getActiveFilters = () => {
    const filters: string[] = [];
    if (searchQuery) {
      filters.push(`Recherche: "${searchQuery}"`);
    }
    if (categorySlug) {
      const cat = categories.find(c => c.slug === categorySlug);
      if (cat) filters.push(cat.name);
    }
    if (familySlug) {
      const fam = families.find(f => f.slug === familySlug);
      if (fam) filters.push(fam.name);
    }
    if (subfamilySlug) {
      const sub = subfamilies.find(s => s.slug === subfamilySlug);
      if (sub) filters.push(sub.name);
    }
    return filters;
  };

  const activeFilters = getActiveFilters();

  if (isLoading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#6B7280' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: '500' }}>Chargement des produits...</div>
        </div>
      </div>
    );
  }

  // Calculate min and max prices from products
  const priceRange = products.reduce(
    (acc, p) => {
      const price = p.isOnPromo && p.promoPrice ? p.promoPrice : p.price;
      return {
        min: Math.min(acc.min, price),
        max: Math.max(acc.max, price),
      };
    },
    { min: Infinity, max: 0 }
  );

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header with Mobile Filter Button */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>
              {searchQuery ? `Résultats pour "${searchQuery}"` : 'Nos Produits'}
            </h1>
            <p style={{ color: '#6B7280', fontSize: '1rem' }}>
              {searchQuery
                ? `${filteredProducts.length} produit${filteredProducts.length !== 1 ? 's' : ''} trouvé${filteredProducts.length !== 1 ? 's' : ''}`
                : 'Découvrez notre sélection de produits parapharmaceutiques'
              }
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.9375rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            className="md:hidden flex items-center gap-2"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 211, 33, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <SlidersHorizontal style={{ width: '1.125rem', height: '1.125rem' }} />
            Filtres
          </button>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div style={{
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A4A4A' }}>
              Filtres actifs:
            </span>
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#7ED321',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                {filter}
              </span>
            ))}
            <Link
              href="/produits"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.375rem 0.75rem',
                backgroundColor: '#DC2626',
                color: 'white',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.2s'
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
            </Link>
          </div>
        )}

        {/* Main Content - Sidebar + Products */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block">
            <FilterSidebar
              categories={categories}
              families={families}
              subfamilies={subfamilies}
              brands={brands}
              minPrice={priceRange.min === Infinity ? 0 : priceRange.min}
              maxPrice={priceRange.max === 0 ? 1000 : priceRange.max}
            />
          </div>

          {/* Products Section */}
          <div style={{ flex: 1 }}>
            {/* Products Count */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                <strong>{filteredProducts.length}</strong> produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
                {filteredProducts.length > itemsPerPage && (
                  <> • Page {currentPage} sur {totalPages}</>
                )}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                border: '1px solid #E5E7EB'
              }}>
                <p style={{ fontSize: '1.125rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                  Aucun produit trouvé
                </p>
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
                  Essayez de modifier vos filtres ou{' '}
                  <Link href="/produits" style={{ color: '#7ED321', textDecoration: 'underline' }}>
                    voir tous les produits
                  </Link>
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
            {currentProducts.map((product) => {
              const primaryImage = product.images?.find(img => img.isPrimary)?.url;
              const displayPrice = product.isOnPromo && product.promoPrice ? product.promoPrice : product.price;

              // Get icon based on category
              const getPlaceholderIcon = () => {
                const categoryName = product.category?.name?.toLowerCase() || '';

                if (categoryName.includes('bébé') || categoryName.includes('bebe') || categoryName.includes('maman')) {
                  return <HeartIcon className="h-16 w-16" style={{ color: '#9CA3AF', strokeWidth: 1.5 }} />;
                } else if (categoryName.includes('soin') || categoryName.includes('crème') || categoryName.includes('creme') || categoryName.includes('hydrat')) {
                  return <Droplet className="h-16 w-16" style={{ color: '#9CA3AF', strokeWidth: 1.5 }} />;
                } else if (categoryName.includes('complément') || categoryName.includes('complement') || categoryName.includes('vitamine')) {
                  return <Pill className="h-16 w-16" style={{ color: '#9CA3AF', strokeWidth: 1.5 }} />;
                } else if (categoryName.includes('maquillage') || categoryName.includes('beauté') || categoryName.includes('beaute')) {
                  return <Sparkles className="h-16 w-16" style={{ color: '#9CA3AF', strokeWidth: 1.5 }} />;
                } else if (categoryName.includes('parfum') || categoryName.includes('eau')) {
                  return <SprayCan className="h-16 w-16" style={{ color: '#9CA3AF', strokeWidth: 1.5 }} />;
                } else {
                  return <Package className="h-16 w-16" style={{ color: '#9CA3AF', strokeWidth: 1.5 }} />;
                }
              };

              return (
                <Link
                  key={product.id}
                  href={`/produits/${product.slug}`}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    border: '1px solid #E5E7EB',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#D1D5DB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  {/* Product Image */}
                  <div style={{ position: 'relative', paddingTop: '75%', backgroundColor: '#F9FAFB', overflow: 'hidden' }}>
                    {product.isOnPromo && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          left: '0.5rem',
                          backgroundColor: '#DC2626',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          zIndex: 10
                        }}
                      >
                        -{product.promoPercentage}%
                      </div>
                    )}
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#F3F4F6'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          {getPlaceholderIcon()}
                        </div>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const inWishlist = isInWishlist(product.id);
                        if (inWishlist) {
                          removeFromWishlist(product.id);
                        } else {
                          const primaryImage = product.images?.find(img => img.isPrimary);
                          addToWishlist({
                            id: `wishlist-${product.id}`,
                            productId: product.id,
                            name: product.name,
                            slug: product.slug,
                            price: product.price,
                            promoPrice: product.promoPrice,
                            image: primaryImage?.url || product.images?.[0]?.url || null,
                            brand: product.brand?.name || null,
                            inStock: product.inStock,
                          });
                        }
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '50%',
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#DC2626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E5E7EB';
                      }}
                    >
                      <Heart
                        style={{
                          width: '1rem',
                          height: '1rem',
                          color: '#DC2626',
                          fill: isInWishlist(product.id) ? '#DC2626' : 'none',
                          transition: 'all 0.2s'
                        }}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div style={{ padding: '0.75rem' }}>
                    {/* Brand */}
                    {product.brand && (
                      <div style={{
                        fontSize: '0.6875rem',
                        color: '#6B7280',
                        fontWeight: '500',
                        marginBottom: '0.25rem'
                      }}>
                        {product.brand.name}
                      </div>
                    )}

                    {/* Product Name */}
                    <h3 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#1F2937',
                      marginBottom: '0.5rem',
                      lineHeight: '1.3',
                      minHeight: '2.275rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {product.name}
                    </h3>

                    {/* Price & Stock */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      {/* Price */}
                      <div>
                        {product.isOnPromo && product.promoPrice ? (
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                            <span style={{
                              fontSize: '1rem',
                              fontWeight: '700',
                              color: '#DC2626'
                            }}>
                              {product.promoPrice.toFixed(2)} TND
                            </span>
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#9CA3AF',
                              textDecoration: 'line-through'
                            }}>
                              {product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span style={{
                            fontSize: '1rem',
                            fontWeight: '700',
                            color: '#1F2937'
                          }}>
                            {product.price.toFixed(2)} TND
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div style={{
                        fontSize: '0.6875rem',
                        color: product.inStock ? '#10B981' : '#EF4444',
                        fontWeight: '500'
                      }}>
                        {product.inStock ? '✓ En stock' : 'Rupture'}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const primaryImage = product.images?.find(img => img.isPrimary);
                        addToCart({
                          id: `cart-${product.id}`,
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          promoPrice: product.promoPrice,
                          image: primaryImage?.url || product.images?.[0]?.url || null,
                          brand: product.brand?.name || null,
                          inStock: product.inStock,
                          stockQuantity: product.stockQuantity,
                        }, 1);
                      }}
                      disabled={!product.inStock}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem',
                        backgroundColor: product.inStock ? '#7ED321' : '#E5E7EB',
                        color: product.inStock ? 'white' : '#9CA3AF',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        cursor: product.inStock ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (product.inStock) {
                          e.currentTarget.style.backgroundColor = '#6AB81E';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (product.inStock) {
                          e.currentTarget.style.backgroundColor = '#7ED321';
                        }
                      }}
                    >
                      <ShoppingCart style={{ width: '0.875rem', height: '0.875rem' }} />
                      {product.inStock ? 'Ajouter' : 'Indisponible'}
                    </button>
                  </div>
                </Link>
              );
            })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                marginTop: '3rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.75rem 1rem',
                    background: currentPage === 1 ? '#F3F4F6' : 'white',
                    color: currentPage === 1 ? '#9CA3AF' : '#4A4A4A',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.borderColor = '#7ED321';
                      e.currentTarget.style.color = '#7ED321';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.color = '#4A4A4A';
                    }
                  }}
                >
                  Précédent
                </button>

                {/* Page Numbers */}
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(pageNum => {
                      return (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        Math.abs(pageNum - currentPage) <= 1
                      );
                    })
                    .map((pageNum, index, array) => {
                      const showEllipsisBefore = index > 0 && pageNum - array[index - 1] > 1;

                      return (
                        <div key={pageNum} style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                          {showEllipsisBefore && (
                            <span style={{ padding: '0 0.5rem', color: '#9CA3AF' }}>...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(pageNum)}
                            style={{
                              padding: '0.75rem 1rem',
                              background: currentPage === pageNum
                                ? 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)'
                                : 'white',
                              color: currentPage === pageNum ? 'white' : '#4A4A4A',
                              border: currentPage === pageNum ? 'none' : '1px solid #E5E7EB',
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              minWidth: '2.5rem',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              if (currentPage !== pageNum) {
                                e.currentTarget.style.borderColor = '#7ED321';
                                e.currentTarget.style.color = '#7ED321';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (currentPage !== pageNum) {
                                e.currentTarget.style.borderColor = '#E5E7EB';
                                e.currentTarget.style.color = '#4A4A4A';
                              }
                            }}
                          >
                            {pageNum}
                          </button>
                        </div>
                      );
                    })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '0.75rem 1rem',
                    background: currentPage === totalPages ? '#F3F4F6' : 'white',
                    color: currentPage === totalPages ? '#9CA3AF' : '#4A4A4A',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.borderColor = '#7ED321';
                      e.currentTarget.style.color = '#7ED321';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.color = '#4A4A4A';
                    }
                  }}
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Modal */}
        <MobileFilterModal
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          categories={categories}
          families={families}
          subfamilies={subfamilies}
          brands={brands}
          minPrice={priceRange.min === Infinity ? 0 : priceRange.min}
          maxPrice={priceRange.max === 0 ? 1000 : priceRange.max}
        />
      </div>
    </div>
  );
}
