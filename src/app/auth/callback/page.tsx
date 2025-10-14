'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session?.user) {
      // Redirect based on user role
      if (session.user.role === 'ADMIN' || session.user.role === 'EMPLOYEE') {
        router.push('/dashboard/admin');
      } else {
        router.push('/');
      }
    } else if (status === 'unauthenticated') {
      // If not authenticated, redirect to login
      router.push('/auth/login');
    }
  }, [session, status, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #F3F4F6',
          borderTop: '3px solid #7ED321',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Redirection...</p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
