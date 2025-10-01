'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

const ConditionalNavbar = () => {
  const pathname = usePathname();

  // Don't show navbar on admin dashboard routes
  if (pathname.startsWith('/dashboard/admin')) {
    return null;
  }

  return <Navbar />;
};

export default ConditionalNavbar;
