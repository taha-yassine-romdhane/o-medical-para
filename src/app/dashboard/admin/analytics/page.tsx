import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users as UsersIcon, Package } from 'lucide-react';

export default async function AnalyticsPage() {
  const session = await auth();

  // Only ADMIN can access analytics
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard/admin');
  }

  // Fetch analytics data
  const [totalRevenue, totalOrders, totalUsers, totalProducts] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: 'COMPLETED' },
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CLIENT' } }),
    prisma.product.count(),
  ]);

  // Get recent orders for trend analysis
  const recentOrders = await prisma.order.findMany({
    where: { paymentStatus: 'COMPLETED' },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  const stats = [
    {
      title: 'Revenu Total',
      value: `${(totalRevenue._sum.total || 0).toFixed(2)} TND`,
      icon: <DollarSign className="h-6 w-6" />,
      color: '#10B981',
      trend: '+12.5%',
      isPositive: true,
    },
    {
      title: 'Commandes',
      value: totalOrders,
      icon: <ShoppingBag className="h-6 w-6" />,
      color: '#3B82F6',
      trend: '+8.3%',
      isPositive: true,
    },
    {
      title: 'Clients',
      value: totalUsers,
      icon: <UsersIcon className="h-6 w-6" />,
      color: '#F59E0B',
      trend: '+15.2%',
      isPositive: true,
    },
    {
      title: 'Produits',
      value: totalProducts,
      icon: <Package className="h-6 w-6" />,
      color: '#7ED321',
      trend: '+4.1%',
      isPositive: true,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937' }}>
          Statistiques & Analytics
        </h1>
        <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
          Vue d'ensemble des performances de votre boutique
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E5E7EB',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {stat.isPositive ? (
                  <TrendingUp style={{ width: '1rem', height: '1rem', color: '#10B981' }} />
                ) : (
                  <TrendingDown style={{ width: '1rem', height: '1rem', color: '#EF4444' }} />
                )}
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: stat.isPositive ? '#10B981' : '#EF4444',
                  }}
                >
                  {stat.trend}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
              {stat.title}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Activity */}
        <div
          style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>
            Activité Récente
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: '#F9FAFB',
                  borderRadius: '0.5rem',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                    Commande #{order.orderNumber}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.125rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#7ED321' }}>
                  {order.total.toFixed(2)} TND
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div
          style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>
            Produits Populaires
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', textAlign: 'center', padding: '2rem' }}>
            Statistiques détaillées à venir
          </p>
        </div>
      </div>

      {/* Admin Only Notice */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.1) 0%, rgba(107, 184, 30, 0.1) 100%)',
          border: '1px solid #7ED321',
          borderRadius: '0.75rem',
        }}
      >
        <p style={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: '500' }}>
          🔒 Cette page est réservée aux administrateurs uniquement
        </p>
      </div>
    </div>
  );
}