'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

const ConditionalFooter = () => {
  const pathname = usePathname();

  // Don't show footer on admin dashboard routes
  if (pathname.startsWith('/dashboard/admin')) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;
