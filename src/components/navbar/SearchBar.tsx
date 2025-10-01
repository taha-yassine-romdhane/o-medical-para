'use client';

import { useState } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  isMobile?: boolean;
}

const SearchBar = ({
  className = "",
  placeholder = "Rechercher des produits, marques, catégories...",
  isMobile = false
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const popularSearches = [
    "Vitamines",
    "Crème visage",
    "Compléments alimentaires",
    "Paracétamol",
    "Shampoing"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    setIsFocused(false);
  };

  if (isMobile) {
    return (
      <div className={`w-full ${className}`}>
        <form onSubmit={handleSearch}>
          <div
            className="relative w-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: `2px solid ${isFocused ? '#7ED321' : 'rgba(255, 255, 255, 0.3)'}`,
              borderRadius: '12px',
              padding: '8px 12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <Search
              className="h-5 w-5 mr-3 flex-shrink-0"
              style={{ color: '#6B7280' }}
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
                color: '#4A4A4A',
                minWidth: 0
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
                  padding: '4px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '50%',
                  color: '#6B7280',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button
              type="submit"
              disabled={!searchQuery.trim()}
              size="sm"
              style={{
                marginLeft: '8px',
                padding: '8px 16px',
                background: searchQuery.trim()
                  ? 'linear-gradient(to right, #7ED321, #6BC318)'
                  : '#9CA3AF',
                border: 'none',
                flexShrink: 0
              }}
            >
              Rechercher
            </Button>
          </div>
        </form>
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

      {/* Search Suggestions */}
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
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <TrendingUp className="h-4 w-4 mr-2" style={{ color: '#7ED321' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#4A4A4A' }}>
                Recherches populaires
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {popularSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularSearch(term)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    fontSize: '14px',
                    color: '#6B7280',
                    background: 'none',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(126, 211, 33, 0.05)';
                    e.currentTarget.style.color = '#7ED321';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6B7280';
                  }}
                >
                  <Search className="h-3 w-3 mr-3" style={{ color: '#9CA3AF' }} />
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;