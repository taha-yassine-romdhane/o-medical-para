'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Tags,
  LogOut,
  User,
  Shield
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems: NavItem[] = [
    { href: '/dashboard/admin', label: 'Tableau de bord', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/dashboard/admin/products', label: 'Produits', icon: <Package className="h-5 w-5" /> },
    { href: '/dashboard/admin/categories', label: 'Catégories', icon: <FolderTree className="h-5 w-5" /> },
    { href: '/dashboard/admin/orders', label: 'Commandes', icon: <ShoppingCart className="h-5 w-5" /> },
    { href: '/dashboard/admin/users', label: 'Clients', icon: <Users className="h-5 w-5" /> },
    { href: '/dashboard/admin/promotions', label: 'Promotions', icon: <Tags className="h-5 w-5" /> },
    // Only show Analytics and User Management to ADMIN
    ...(session?.user?.role === 'ADMIN' ? [
      { href: '/dashboard/admin/analytics', label: 'Statistiques', icon: <BarChart3 className="h-5 w-5" /> },
      { href: '/dashboard/admin/user-management', label: 'Gestion Utilisateurs', icon: <Shield className="h-5 w-5" /> }
    ] : []),
    { href: '/dashboard/admin/settings', label: 'Paramètres', icon: <Settings className="h-5 w-5" /> },
  ];

  const getRoleBadgeColor = () => {
    if (session?.user?.role === 'ADMIN') return { bg: '#7ED321', text: '#1F4D1A' };
    if (session?.user?.role === 'EMPLOYEE') return { bg: '#3B82F6', text: '#1E3A8A' };
    return { bg: '#9CA3AF', text: '#1F2937' };
  };

  const getRoleLabel = () => {
    if (session?.user?.role === 'ADMIN') return 'Administrateur';
    if (session?.user?.role === 'EMPLOYEE') return 'Employé';
    return 'Utilisateur';
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <aside
      style={{
        width: '280px',
        background: 'linear-gradient(180deg, #1F4D1A 0%, #2D5F2A 100%)',
        color: 'white',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        boxShadow: '4px 0 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo Section */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Link href="/" style={{ display: 'block' }}>
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            display: 'inline-block'
          }}>
            <Image
              src="/logo/logo-web.png"
              alt="Medical Store"
              width={160}
              height={80}
              style={{ height: 'auto', width: '160px' }}
            />
          </div>
        </Link>
        <p style={{
          fontSize: '0.75rem',
          color: '#7ED321',
          marginTop: '0.75rem',
          fontWeight: '600',
          letterSpacing: '0.05em'
        }}>
          ADMINISTRATION
        </p>
      </div>

      {/* User Info Section */}
      {session?.user && (
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              background: 'rgba(126, 211, 33, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7ED321',
            }}>
              <User className="h-5 w-5" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: 'white',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {session.user.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  background: getRoleBadgeColor().bg,
                  color: getRoleBadgeColor().text,
                }}>
                  {getRoleLabel()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem'
      }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: '0.75rem',
                color: isActive ? '#1F4D1A' : 'white',
                background: isActive ? '#7ED321' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
                fontSize: '0.9375rem',
                fontWeight: isActive ? '600' : '500',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(126, 211, 33, 0.15)';
                  e.currentTarget.style.paddingLeft = '1.25rem';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.paddingLeft = '1rem';
                }
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1rem',
            borderRadius: '0.75rem',
            color: 'white',
            background: 'rgba(220, 38, 38, 0.2)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9375rem',
            fontWeight: '500',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#DC2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)';
          }}
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}