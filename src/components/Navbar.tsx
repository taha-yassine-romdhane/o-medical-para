'use client';

import { useState } from 'react';
import TopBar from './navbar/TopBar';
import MainNavigation from './navbar/MainNavigation';
import CategoriesNav from './navbar/CategoriesNav';
import MobileMenu from './navbar/MobileMenu';

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