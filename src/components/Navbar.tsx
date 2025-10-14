'use client';

import { useState } from 'react';
import TopBar from './navbar/TopBar';
import MainNavigation from './navbar/MainNavigation';
import CategoriesNav from './navbar/CategoriesNav';
import MobileMenu from './navbar/MobileMenu';
import SearchBar from './navbar/SearchBar';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 shadow-lg border-b"
      style={{
        backgroundColor: 'white',
        borderBottomColor: 'rgba(74, 74, 74, 0.1)'
      }}
    >
      <TopBar />
      {/* Mobile Search Bar - Between TopBar and MainNavigation */}
      <div className="md:hidden bg-white border-b border-gray-100 px-3 py-2">
        <SearchBar isMobile={true} />
      </div>
      <MainNavigation
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <CategoriesNav />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Navbar;