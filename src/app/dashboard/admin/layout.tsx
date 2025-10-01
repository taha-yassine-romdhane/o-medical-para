'use client';

import AdminSidebar from '@/components/dashboard/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F3F4F6' }}>
      <AdminSidebar />

      {/* Main Content */}
      <main
        style={{
          marginLeft: '280px',
          flex: 1,
          padding: '2rem',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}