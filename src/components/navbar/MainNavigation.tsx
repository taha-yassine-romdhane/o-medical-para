'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, User, Heart, Menu, X, Search, LogIn, ChevronDown, Package, LogOut, LayoutDashboard } from 'lucide-react';
import SearchBar from './SearchBar';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import Tooltip from '@/components/Tooltip';
import CartDropdown from '@/components/cart/CartDropdown';
import WishlistDropdown from '@/components/wishlist/WishlistDropdown';

interface MainNavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const MainNavigation = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MainNavigationProps) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

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
          className="flex items-center h-16 sm:h-20 relative"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Mobile Menu Button - Left (Mobile only) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl transition-all duration-200 z-10"
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

          {/* Logo - Centered on Mobile, Left on Desktop */}
          <Link
            href="/"
            className="shrink-0 transition-transform duration-200 hover:scale-105 md:ml-0"
            style={{
              flexShrink: 0,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
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

          {/* Desktop Logo (hidden on mobile) */}
          <Link
            href="/"
            className="hidden md:block shrink-0 transition-transform duration-200 hover:scale-105 relative"
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
              className="h-12 w-auto hover:scale-110 transition-all duration-200"
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div
            className="hidden md:block order-3 md:order-2"
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
            className="flex items-center gap-1 sm:gap-2 order-3"
            style={{ flexShrink: 0, marginLeft: 'auto' }}
          >
            {/* Account / Login */}
            {session ? (
              <div ref={accountMenuRef} style={{ position: 'relative' }}>
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
                      {/* Dashboard Link - Only for ADMIN and EMPLOYEE */}
                      {(session.user.role === 'ADMIN' || session.user.role === 'EMPLOYEE') && (
                        <Link
                          href="/dashboard/admin"
                          onClick={() => setShowAccountMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            color: 'white',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #6AB81E 0%, #7ED321 100%)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Tableau de bord
                        </Link>
                      )}

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
                className="flex items-center px-2 sm:px-3 py-2 rounded-xl transition-all duration-200 group"
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
            <Tooltip text="Favoris" position="bottom">
              <button
                onClick={() => setShowWishlistDropdown(true)}
                className="flex items-center px-2 sm:px-3 py-2 rounded-xl transition-all duration-200 relative group"
                style={{ color: '#4A4A4A', background: 'none', border: 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#DC2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#4A4A4A';
                }}
              >
                <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {getWishlistCount() > 0 && (
                  <span
                    className="absolute -top-2 -right-2 text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg text-white border-2 border-white"
                    style={{
                      background: 'linear-gradient(to right, #DC2626, #B91C1C)',
                      fontSize: '11px'
                    }}
                  >
                    {getWishlistCount()}
                  </span>
                )}
              </button>
            </Tooltip>

            {/* Wishlist Dropdown */}
            <WishlistDropdown isOpen={showWishlistDropdown} onClose={() => setShowWishlistDropdown(false)} />

            {/* Cart */}
            <Tooltip text="Panier" position="bottom">
              <button
                onClick={() => setShowCartDropdown(true)}
                className="flex items-center px-2 sm:px-3 py-2 rounded-xl transition-all duration-200 relative group"
                style={{ color: '#4A4A4A', background: 'none', border: 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#7ED321';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#4A4A4A';
                }}
              >
                <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {getCartCount() > 0 && (
                  <span
                    className="absolute -top-2 -right-2 text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg text-white border-2 border-white"
                    style={{
                      background: 'linear-gradient(to right, #7ED321, #6BC318)',
                      fontSize: '11px'
                    }}
                  >
                    {getCartCount()}
                  </span>
                )}
              </button>
            </Tooltip>

            {/* Cart Dropdown */}
            <CartDropdown isOpen={showCartDropdown} onClose={() => setShowCartDropdown(false)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;