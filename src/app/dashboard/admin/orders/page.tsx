import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Search, Filter, Eye } from 'lucide-react';

export default async function OrdersPage() {
  const session = await auth();

  // Fetch orders
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      _count: {
        select: { items: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'CONFIRMED':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      case 'PROCESSING':
        return { bg: '#E0E7FF', text: '#3730A3' };
      case 'SHIPPED':
        return { bg: '#DDD6FE', text: '#5B21B6' };
      case 'DELIVERED':
        return { bg: '#D1FAE5', text: '#065F46' };
      case 'CANCELLED':
        return { bg: '#FEE2E2', text: '#991B1B' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Confirmée';
      case 'PROCESSING':
        return 'En traitement';
      case 'SHIPPED':
        return 'Expédiée';
      case 'DELIVERED':
        return 'Livrée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#D1FAE5', text: '#065F46' };
      case 'PENDING':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'FAILED':
        return { bg: '#FEE2E2', text: '#991B1B' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Payé';
      case 'PENDING':
        return 'En attente';
      case 'FAILED':
        return 'Échoué';
      default:
        return status;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937' }}>
              Gestion des Commandes
            </h1>
            <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
              {orders.length} commandes au total
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1.25rem',
                height: '1.25rem',
                color: '#9CA3AF',
              }}
            />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 3rem',
                border: '2px solid #E5E7EB',
                borderRadius: '0.75rem',
                fontSize: '0.9375rem',
                outline: 'none',
                background: 'white',
              }}
            />
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.5rem',
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: '500',
              color: '#4A4A4A',
            }}
          >
            <Filter className="h-5 w-5" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                N° Commande
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Client
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Articles
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Total
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Statut
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Paiement
              </th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                  Aucune commande trouvée
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const statusColors = getStatusColor(order.status);
                const paymentColors = getPaymentStatusColor(order.paymentStatus);
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '1rem' }}>
                      <p style={{ fontWeight: '600', color: '#1F2937', fontSize: '0.9375rem' }}>
                        #{order.orderNumber}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.125rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <p style={{ fontWeight: '600', color: '#1F2937', fontSize: '0.875rem' }}>
                        {order.user.firstName} {order.user.lastName}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.125rem' }}>
                        {order.user.email}
                      </p>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4A4A4A' }}>
                      {order._count.items} article{order._count.items !== 1 ? 's' : ''}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>
                      {order.total.toFixed(2)} TND
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          background: statusColors.bg,
                          color: statusColors.text,
                        }}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          background: paymentColors.bg,
                          color: paymentColors.text,
                        }}
                      >
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <Link
                        href={`/dashboard/admin/orders/${order.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: '#F3F4F6',
                          color: '#4A4A4A',
                          borderRadius: '0.5rem',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        Voir
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}