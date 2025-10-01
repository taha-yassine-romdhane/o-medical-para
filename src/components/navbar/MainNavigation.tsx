'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, User, Heart, Menu, X, Search, LogIn, ChevronDown, Package, LogOut } from 'lucide-react';
import SearchBar from './SearchBar';

interface MainNavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const MainNavigation = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MainNavigationProps) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div
      className="border-b"
      style={{
        backgroundColor: 'white',
        borderBottomColor: 'rgba(74, 74, 74, 0.1)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div
          className="flex items-center justify-between h-16 sm:h-20"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 transition-transform duration-200 hover:scale-105"
            style={{ flexShrink: 0 }}
          >
            <Image
              src="/logo/logo-web.png"
              alt="Medical Store Parapharmacie"
              width={240}
              height={120}
              quality={100}
              priority
              unoptimized
              className="h-8 sm:h-12 w-auto hover:scale-110 transition-all duration-200"
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div
            className="hidden md:block"
            style={{
              flex: 1,
              maxWidth: '700px',
              minWidth: '400px',
              marginLeft: '24px',
              marginRight: '24px'
            }}
          >
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div
            className="flex items-center gap-1 sm:gap-2"
            style={{ flexShrink: 0, marginLeft: 'auto' }}
          >
            {/* Search Button - Mobile */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden flex items-center px-2 py-2 rounded-xl transition-all duration-200"
              style={{ color: '#4A4A4A' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#7ED321';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4A4A4A';
              }}
            >
              <Search className="h-5 w-5" />
            </button>
            {/* Account / Login - Hidden on mobile */}
            {session ? (
              <div ref={accountMenuRef} style={{ position: 'relative' }} className="hidden sm:block">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center px-3 py-2 rounded-xl transition-all duration-200 group"
                  style={{ color: '#4A4A4A' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#7ED321';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#4A4A4A';
                  }}
                >
                  <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden lg:block text-sm font-medium ml-2">Compte</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>

                {/* Dropdown Menu */}
                {showAccountMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '0.5rem',
                      minWidth: '200px',
                      background: 'white',
                      borderRadius: '0.75rem',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                      border: '1px solid #E5E7EB',
                      zIndex: 50,
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E5E7EB' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                        {session.user.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.125rem' }}>
                        {session.user.email}
                      </p>
                    </div>

                    <div style={{ padding: '0.5rem' }}>
                      <Link
                        href="/compte"
                        onClick={() => setShowAccountMenu(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#4A4A4A',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                          e.currentTarget.style.color = '#7ED321';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#4A4A4A';
                        }}
                      >
                        <User className="h-4 w-4" />
                        Mon Profil
                      </Link>

                      <Link
                        href="/compte/commandes"
                        onClick={() => setShowAccountMenu(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#4A4A4A',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                          e.currentTarget.style.color = '#7ED321';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#4A4A4A';
                        }}
                      >
                        <Package className="h-4 w-4" />
                        Mes Commandes
                      </Link>

                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#DC2626',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FEE2E2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center px-3 py-2 rounded-xl transition-all duration-200 group"
                style={{ color: '#4A4A4A' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#7ED321';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#4A4A4A';
                }}
              >
                <LogIn className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="hidden lg:block text-sm font-medium ml-2">Connexion</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/favoris"
              className="flex items-center px-2 sm:px-3 py-2 rounded-xl transition-all duration-200 relative group"
              style={{ color: '#4A4A4A' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#7ED321';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4A4A4A';
              }}
            >
              <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span
                className="absolute -top-2 -right-2 text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg text-white border-2 border-white"
                style={{
                  background: 'linear-gradient(to right, #7ED321, #6BC318)',
                  fontSize: '11px'
                }}
              >
                3
              </span>
            </Link>

            {/* Cart */}
            <Link
              href="/panier"
              className="flex items-center px-2 sm:px-3 py-2 rounded-xl transition-all duration-200 relative group"
              style={{ color: '#4A4A4A' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#7ED321';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4A4A4A';
              }}
            >
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span
                className="absolute -top-2 -right-2 text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg text-white border-2 border-white"
                style={{
                  background: 'linear-gradient(to right, #7ED321, #6BC318)',
                  fontSize: '11px'
                }}
              >
                2
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 ml-1 rounded-xl transition-all duration-200"
              style={{ color: '#4A4A4A' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#7ED321';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4A4A4A';
              }}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        {showMobileSearch && (
          <div className="md:hidden pb-4 px-2">
            <SearchBar isMobile={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNavigation;