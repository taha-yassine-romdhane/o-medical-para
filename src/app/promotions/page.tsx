'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PromotionsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to products page with promo filter
    router.push('/produits?promo=true');
  }, [router]);

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F9FAFB'
    }}>
      <div style={{ textAlign: 'center', color: '#6B7280' }}>
        <div style={{ fontSize: '1.125rem', fontWeight: '500' }}>Redirection vers les promotions...</div>
      </div>
    </div>
  );
}
