'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Award,
  PackageOpen,
  AlertTriangle,
  ClipboardList,
  Zap,
  Layers,
  XCircle
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface Product {
  id: string;
  reference: string;
  name: string;
  stockQuantity: number;
}

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalCategories: number;
  totalFamilies: number;
  totalSubfamilies: number;
  totalBrands: number;
  totalPacks: number;
  outOfStockProducts: number;
  pendingOrders: number;
  recentOrders: Order[];
  lowStockProducts: Product[];
  userName: string;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard/stats');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
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
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Chargement...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const {
    totalProducts,
    totalOrders,
    totalUsers,
    totalCategories,
    totalFamilies,
    totalSubfamilies,
    totalBrands,
    totalPacks,
    outOfStockProducts,
    pendingOrders,
    recentOrders,
    lowStockProducts,
    userName
  } = data;

  const stats = [
    {
      title: 'Produits',
      value: totalProducts,
      icon: Package,
      color: '#7ED321',
      link: '/dashboard/admin/products',
    },
    {
      title: 'Commandes',
      value: totalOrders,
      icon: ShoppingCart,
      color: '#3B82F6',
      badge: pendingOrders > 0 ? `${pendingOrders} en attente` : null,
      link: '/dashboard/admin/orders',
    },
    {
      title: 'Clients',
      value: totalUsers,
      icon: Users,
      color: '#F59E0B',
      link: '/dashboard/admin/users',
    },
    {
      title: 'Catégories',
      value: totalCategories,
      icon: FolderTree,
      color: '#8B5CF6',
      link: '/dashboard/admin/categories',
    },
    {
      title: 'Familles',
      value: totalFamilies,
      icon: Layers,
      color: '#10B981',
      link: '/dashboard/admin/categories',
    },
    {
      title: 'Sous-familles',
      value: totalSubfamilies,
      icon: Layers,
      color: '#06B6D4',
      link: '/dashboard/admin/categories',
    },
    {
      title: 'Marques',
      value: totalBrands,
      icon: Award,
      color: '#EC4899',
      link: '/dashboard/admin/brands',
    },
    {
      title: 'Packs',
      value: totalPacks,
      icon: PackageOpen,
      color: '#14B8A6',
      link: '/dashboard/admin/packs',
    },
    {
      title: 'Stock Bas',
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: '#F59E0B',
      link: '/dashboard/admin/products',
    },
    {
      title: 'Rupture Stock',
      value: outOfStockProducts,
      icon: XCircle,
      color: '#EF4444',
      link: '/dashboard/admin/products',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '0.5rem',
          }}
        >
          Bienvenue, {userName}
        </h1>
        <p style={{ color: '#6B7280' }}>
          Voici un aperçu de votre boutique en ligne
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {stats.map((stat, index) => {
          const Component = stat.link ? 'a' : 'div';
          return (
            <Component
              key={index}
              href={stat.link}
              style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '2px solid transparent',
                textDecoration: 'none',
                cursor: stat.link ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={(e: any) => {
                if (stat.link) {
                  e.currentTarget.style.borderColor = stat.color;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 16px ${stat.color}20`;
                }
              }}
              onMouseLeave={(e: any) => {
                if (stat.link) {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                }
              }}
            >
              {stat.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: stat.color,
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  {stat.badge}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    background: `${stat.color}15`,
                    padding: '0.875rem',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '4rem',
                    minHeight: '4rem',
                  }}
                >
                  <stat.icon style={{ width: '2rem', height: '2rem', color: stat.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: '500' }}>
                    {stat.title}
                  </p>
                  <p
                    style={{
                      fontSize: '1.875rem',
                      fontWeight: '700',
                      color: '#1F2937',
                      marginTop: '0.25rem',
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            </Component>
          );
        })}
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Recent Orders */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E5E7EB',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <ClipboardList style={{ width: '1.5rem', height: '1.5rem', color: '#7ED321' }} />
            Commandes récentes
          </h2>
          {recentOrders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    padding: '1rem',
                    background: '#F9FAFB',
                    borderRadius: '0.5rem',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div>
                      <p style={{ fontWeight: '600', color: '#1F2937', fontSize: '0.875rem' }}>
                        {order.user.firstName} {order.user.lastName}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {order.orderNumber}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: order.status === 'PENDING' ? '#FEF3C7' : '#D1FAE5',
                        color: order.status === 'PENDING' ? '#92400E' : '#065F46',
                      }}
                    >
                      {order.status === 'PENDING' ? 'En attente' : order.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6B7280' }}>
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span style={{ fontWeight: '700', color: '#7ED321' }}>
                      {order.total.toFixed(2)} TND
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '2rem' }}>
              Aucune commande récente
            </p>
          )}
        </div>

        {/* Low Stock Products */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: '1px solid #E5E7EB',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertTriangle style={{ width: '1.5rem', height: '1.5rem', color: '#EF4444' }} />
            Stock faible
          </h2>
          {lowStockProducts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    padding: '1rem',
                    background: '#FEF2F2',
                    borderRadius: '0.5rem',
                    border: '1px solid #FEE2E2',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', color: '#1F2937', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        Réf: {product.reference}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#DC2626' }}>
                        {product.stockQuantity}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        en stock
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '2rem' }}>
              Tous les produits ont un stock suffisant ✓
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E5E7EB',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Zap style={{ width: '1.5rem', height: '1.5rem', color: '#7ED321' }} />
          Actions rapides
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <a
            href="/dashboard/admin/products"
            style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #7ED321, #6AB81E)',
              color: 'white',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(126, 211, 33, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(126, 211, 33, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(126, 211, 33, 0.3)';
            }}
          >
            + Nouveau Produit
          </a>
          <a
            href="/dashboard/admin/categories"
            style={{
              padding: '1rem 1.5rem',
              background: 'white',
              color: '#7ED321',
              border: '2px solid #7ED321',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#7ED321';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#7ED321';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            + Nouvelle Catégorie
          </a>
          <a
            href="/dashboard/admin/brands"
            style={{
              padding: '1rem 1.5rem',
              background: 'white',
              color: '#EC4899',
              border: '2px solid #EC4899',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#EC4899';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#EC4899';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            + Nouvelle Marque
          </a>
          <a
            href="/dashboard/admin/packs"
            style={{
              padding: '1rem 1.5rem',
              background: 'white',
              color: '#14B8A6',
              border: '2px solid #14B8A6',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#14B8A6';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#14B8A6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            + Nouveau Pack
          </a>
        </div>
      </div>
    </div>
  );
}