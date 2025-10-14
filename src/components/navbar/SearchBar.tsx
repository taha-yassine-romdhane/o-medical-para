'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Clock, History, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchHistory } from '@/hooks/useSearchHistory';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  isMobile?: boolean;
}

interface SearchSuggestion {
  id: string;
  name: string;
  type: 'product' | 'brand' | 'category';
  slug: string;
}

const SearchBar = ({
  className = "",
  placeholder = "Rechercher des produits, marques, catégories...",
  isMobile = false
}: SearchBarProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();

  // Fetch suggestions based on search query
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoadingSuggestions(true);
      const response = await fetch(`/api/products?include=images&limit=10000`);
      const data = await response.json();

      if (data.products) {
        const searchLower = query.toLowerCase();
        const results: SearchSuggestion[] = [];

        // Search products
        const matchingProducts = data.products
          .filter((p: any) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.reference.toLowerCase().includes(searchLower)
          )
          .slice(0, 5)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            type: 'product' as const,
            slug: p.slug,
          }));

        results.push(...matchingProducts);

        // Get unique brands
        const brands = new Map();
        data.products.forEach((p: any) => {
          if (p.brand && p.brand.name.toLowerCase().includes(searchLower)) {
            brands.set(p.brand.id, {
              id: p.brand.id,
              name: p.brand.name,
              type: 'brand' as const,
              slug: p.brand.slug,
            });
          }
        });
        results.push(...Array.from(brands.values()).slice(0, 3));

        // Get unique categories
        const categories = new Map();
        data.products.forEach((p: any) => {
          if (p.category && p.category.name.toLowerCase().includes(searchLower)) {
            categories.set(p.category.id, {
              id: p.category.id,
              name: p.category.name,
              type: 'category' as const,
              slug: p.category.slug,
            });
          }
        });
        results.push(...Array.from(categories.values()).slice(0, 2));

        setSuggestions(results.slice(0, 8));
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearch(searchQuery.trim());
      router.push(`/produits?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsFocused(false);
    }
  };

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    addSearch(query);
    router.push(`/produits?search=${encodeURIComponent(query)}`);
    setIsFocused(false);
  };

  const handleRemoveHistory = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    removeSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setIsFocused(false);
    if (suggestion.type === 'product') {
      router.push(`/produits/${suggestion.slug}`);
    } else if (suggestion.type === 'brand') {
      router.push(`/produits?brand=${suggestion.slug}`);
    } else if (suggestion.type === 'category') {
      router.push(`/produits?category=${suggestion.slug}`);
    }
  };

  if (isMobile) {
    return (
      <div className={`relative w-full ${className}`}>
        <form onSubmit={handleSearch}>
          <div
            className="relative w-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'white',
              border: `2px solid ${isFocused || searchQuery ? '#2D5016' : '#9FE834'}`,
              borderRadius: '12px',
              padding: '10px 12px',
              boxShadow: isFocused ? '0 2px 8px rgba(126, 211, 33, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease'
            }}
          >
            <Search
              className="h-5 w-5 mr-2 flex-shrink-0"
              style={{
                color: isFocused || searchQuery ? '#2D5016' : '#6B7280',
                transition: 'color 0.2s ease'
              }}
            />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: '#1F2937',
                minWidth: 0,
                fontWeight: '500'
              }}
              aria-label="Recherche"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Effacer la recherche"
                style={{
                  marginLeft: '8px',
                  padding: '6px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  color: '#6B7280',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FEE2E2';
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) (icon as any).style.color = '#DC2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) (icon as any).style.color = '#6B7280';
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              style={{
                marginLeft: '8px',
                padding: '8px 16px',
                background: searchQuery.trim()
                  ? 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)'
                  : '#9CA3AF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: searchQuery.trim() ? 'pointer' : 'not-allowed',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                boxShadow: searchQuery.trim() ? '0 2px 4px rgba(126, 211, 33, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (searchQuery.trim()) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(126, 211, 33, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (searchQuery.trim()) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(126, 211, 33, 0.3)';
                }
              }}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Mobile Search Suggestions and History */}
        {isFocused && (
          <div
            className="absolute left-0 right-0 z-50"
            style={{
              top: '100%',
              marginTop: '8px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(74, 74, 74, 0.1)',
              overflow: 'hidden',
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            <div style={{ padding: '12px' }}>
              {isLoadingSuggestions ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
                  Recherche...
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <Search className="h-4 w-4 mr-2" style={{ color: '#7ED321' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#4A4A4A' }}>
                      Suggestions
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          fontSize: '13px',
                          color: '#4A4A4A',
                          background: 'none',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                        onTouchStart={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.05)';
                        }}
                        onTouchEnd={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {suggestion.name}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          color: '#9CA3AF',
                          backgroundColor: '#F3F4F6',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          marginLeft: '8px',
                          flexShrink: 0
                        }}>
                          {suggestion.type === 'product' ? 'Produit' : suggestion.type === 'brand' ? 'Marque' : 'Catégorie'}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : searchQuery.length >= 2 ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
                  Aucun résultat trouvé
                </div>
              ) : history.length > 0 ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Clock className="h-4 w-4 mr-2" style={{ color: '#7ED321' }} />
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#4A4A4A' }}>
                        Recherches récentes
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearHistory();
                      }}
                      style={{
                        fontSize: '11px',
                        color: '#6B7280',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      Effacer
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {history.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          fontSize: '13px',
                          color: '#4A4A4A',
                          background: 'none',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                        onTouchStart={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.05)';
                        }}
                        onTouchEnd={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div
                          onClick={() => handleHistoryClick(item.query)}
                          style={{ display: 'flex', alignItems: 'center', flex: 1, overflow: 'hidden', cursor: 'pointer' }}
                        >
                          <History className="h-3.5 w-3.5 mr-2 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.query}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleRemoveHistory(e, item.query)}
                          style={{
                            marginLeft: '8px',
                            padding: '4px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            color: '#9CA3AF',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.15s ease',
                            flexShrink: 0
                          }}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#9CA3AF', fontSize: '0.875rem' }}>
                  Tapez pour rechercher
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSearch}>
        <div
          className="relative w-full"
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            border: `2px solid ${isFocused ? '#7ED321' : 'rgba(74, 74, 74, 0.1)'}`,
            borderRadius: '16px',
            boxShadow: isFocused
              ? '0 4px 12px rgba(126, 211, 33, 0.15)'
              : '0 2px 8px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            height: '48px'
          }}
        >
          {/* Search Icon */}
          <div style={{ padding: '0 16px', flexShrink: 0 }}>
            <Search
              className="h-5 w-5"
              style={{
                color: isFocused ? '#7ED321' : '#6B7280',
                transition: 'color 0.3s ease'
              }}
            />
          </div>

          {/* Input Field */}
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#4A4A4A',
              padding: '12px 8px',
              minWidth: 0
            }}
            aria-label="Recherche"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Effacer la recherche"
              style={{
                padding: '8px',
                margin: '0 4px',
                background: 'none',
                border: 'none',
                borderRadius: '50%',
                color: '#6B7280',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Search Button */}
          <Button
            type="submit"
            disabled={!searchQuery.trim()}
            size="sm"
            style={{
              margin: '4px',
              padding: '10px 20px',
              background: searchQuery.trim()
                ? 'linear-gradient(to right, #7ED321, #6BC318)'
                : '#9CA3AF',
              border: 'none',
              flexShrink: 0,
              boxShadow: searchQuery.trim() ? '0 2px 4px rgba(126, 211, 33, 0.2)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (searchQuery.trim()) {
                e.currentTarget.style.background = 'linear-gradient(to right, #6BC318, #7ED321)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (searchQuery.trim()) {
                e.currentTarget.style.background = 'linear-gradient(to right, #7ED321, #6BC318)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            Rechercher
          </Button>
        </div>
      </form>

      {/* Search Suggestions and History */}
      {isFocused && (
        <div
          className="absolute left-0 right-0 z-50"
          style={{
            top: '100%',
            marginTop: '8px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(74, 74, 74, 0.1)',
            overflow: 'hidden',
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          <div style={{ padding: '16px' }}>
            {isLoadingSuggestions ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#6B7280' }}>
                Recherche...
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <Search className="h-4 w-4 mr-2" style={{ color: '#7ED321' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#4A4A4A' }}>
                    Suggestions
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        fontSize: '14px',
                        color: '#4A4A4A',
                        background: 'none',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.05)';
                        e.currentTarget.style.color = '#7ED321';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#4A4A4A';
                      }}
                    >
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {suggestion.name}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: '#9CA3AF',
                        backgroundColor: '#F3F4F6',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        marginLeft: '8px',
                        flexShrink: 0
                      }}>
                        {suggestion.type === 'product' ? 'Produit' : suggestion.type === 'brand' ? 'Marque' : 'Catégorie'}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : searchQuery.length >= 2 ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#6B7280' }}>
                Aucun résultat trouvé
              </div>
            ) : history.length > 0 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Clock className="h-4 w-4 mr-2" style={{ color: '#7ED321' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#4A4A4A' }}>
                      Recherches récentes
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearHistory();
                    }}
                    style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.color = '#EF4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#6B7280';
                    }}
                  >
                    Tout effacer
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {history.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        fontSize: '14px',
                        color: '#4A4A4A',
                        background: 'none',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.05)';
                        e.currentTarget.style.color = '#7ED321';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#4A4A4A';
                      }}
                    >
                      <div
                        onClick={() => handleHistoryClick(item.query)}
                        style={{ display: 'flex', alignItems: 'center', flex: 1, overflow: 'hidden', cursor: 'pointer' }}
                      >
                        <History className="h-3.5 w-3.5 mr-2 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.query}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleRemoveHistory(e, item.query)}
                        style={{
                          marginLeft: '8px',
                          padding: '4px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          color: '#9CA3AF',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.15s ease',
                          flexShrink: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                          e.currentTarget.style.color = '#EF4444';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#9CA3AF';
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#9CA3AF', fontSize: '0.875rem' }}>
                Tapez pour rechercher des produits
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;