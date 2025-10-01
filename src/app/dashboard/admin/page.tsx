import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const session = await auth();

  // Get statistics
  const [totalProducts, totalOrders, totalUsers, totalRevenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CLIENT' } }),
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: 'COMPLETED',
      },
    }),
  ]);

  const stats = [
    {
      title: 'Produits',
      value: totalProducts,
      icon: '📦',
      color: '#7ED321',
    },
    {
      title: 'Commandes',
      value: totalOrders,
      icon: '🛒',
      color: '#3B82F6',
    },
    {
      title: 'Clients',
      value: totalUsers,
      icon: '👥',
      color: '#F59E0B',
    },
    {
      title: 'Revenus',
      value: `${(totalRevenue._sum.total || 0).toFixed(2)} TND`,
      icon: '💰',
      color: '#10B981',
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
          Bienvenue, {session?.user.name}
        </h1>
        <p style={{ color: '#6B7280' }}>
          Voici un aperçu de votre boutique en ligne
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
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E5E7EB',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  fontSize: '2.5rem',
                  background: `${stat.color}15`,
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                }}
              >
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  {stat.title}
                </p>
                <p
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: '#1F2937',
                    marginTop: '0.25rem',
                  }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '1rem',
          }}
        >
          Actions rapides
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href="/dashboard/admin/products/new"
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #7ED321, #6AB81E)',
              color: 'white',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.2s',
            }}
          >
            + Nouveau Produit
          </a>
          <a
            href="/dashboard/admin/categories/new"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#F3F4F6',
              color: '#1F2937',
              border: '2px solid #7ED321',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.2s',
            }}
          >
            + Nouvelle Catégorie
          </a>
        </div>
      </div>
    </div>
  );
}