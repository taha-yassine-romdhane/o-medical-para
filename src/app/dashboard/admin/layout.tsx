'use client';

import AdminSidebar from '@/components/dashboard/AdminSidebar';
import AdminNavbar from '@/components/dashboard/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F3F4F6' }}>
      <AdminSidebar />

      {/* Main Content Area */}
      <div style={{ marginLeft: '280px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <AdminNavbar />

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            padding: '2rem',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}