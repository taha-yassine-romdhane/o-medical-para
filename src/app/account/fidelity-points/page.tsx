'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Gift, TrendingUp, TrendingDown, Calendar, Package, Info } from 'lucide-react';

interface HistoryItem {
  id: string;
  points: number;
  type: string;
  description: string;
  reference: string | null;
  createdAt: string;
  order?: {
    orderNumber: string;
    total: number;
  };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function UserFidelityPointsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [points, setPoints] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.id) {
      fetchHistory();
    }
  }, [session, status, router, pagination.page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      const response = await fetch(`/api/fidelity-points/${session?.user?.id}?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPoints(data.user.fidelityPoints);
        setHistory(data.history);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'EARNED_PURCHASE':
        return 'Achat en ligne';
      case 'MANUAL_ADD':
        return 'Ajout manuel';
      case 'MANUAL_DEDUCT':
        return 'Déduction';
      case 'REDEEMED':
        return 'Points utilisés';
      case 'EXPIRED':
        return 'Expiration';
      case 'REFUND':
        return 'Remboursement';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EARNED_PURCHASE':
      case 'MANUAL_ADD':
        return { bg: '#D1FAE5', text: '#065F46' };
      case 'MANUAL_DEDUCT':
      case 'EXPIRED':
        return { bg: '#FEE2E2', text: '#991B1B' };
      case 'REDEEMED':
        return { bg: '#E0E7FF', text: '#3730A3' };
      case 'REFUND':
        return { bg: '#FEF3C7', text: '#92400E' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9CA3AF'
      }}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 'clamp(1rem, 3vw, 2rem)',
    }}>
      {/* Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
          borderRadius: '1rem',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          marginBottom: '2rem',
          color: 'white',
          boxShadow: '0 10px 30px rgba(126, 211, 33, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Gift style={{ width: '2rem', height: '2rem' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '700', margin: 0 }}>
              Mes Points de Fidélité
            </h1>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0.25rem 0 0 0' }}>
              Gagnez des points à chaque commande livrée
            </p>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '0.75rem',
          padding: 'clamp(1.25rem, 2vw, 2rem)',
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
            Points Disponibles
          </p>
          <p style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '700', margin: 0 }}>
            {points.toLocaleString()}
          </p>
          <p style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
            points
          </p>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'start',
          gap: '0.75rem',
        }}>
          <Info style={{ width: '1.25rem', height: '1.25rem', marginTop: '0.125rem', flexShrink: 0 }} />
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
              Comment ça marche ?
            </p>
            <p style={{ margin: 0 }}>
              Vous gagnez <strong>2% de chaque commande livrée</strong> en points (multiplié par 1000).
              Par exemple : une commande de 200 TND vous rapporte 4000 points !
            </p>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
            Historique des Transactions
          </h2>
          <p style={{ color: '#6B7280', marginTop: '0.25rem', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            {pagination.total} transaction{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Mobile-friendly history list */}
        <div style={{ padding: '1rem' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
              Chargement...
            </div>
          ) : history.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <Gift style={{ width: '3rem', height: '3rem', color: '#D1D5DB', margin: '0 auto 1rem' }} />
              <p style={{ color: '#6B7280', fontSize: '1rem', fontWeight: '500', margin: 0 }}>
                Aucune transaction pour le moment
              </p>
              <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Passez une commande pour commencer à gagner des points !
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.map((item) => {
                const typeColors = getTypeColor(item.type);
                return (
                  <div
                    key={item.id}
                    style={{
                      background: '#F9FAFB',
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    {/* Type Badge and Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <span
                        style={{
                          padding: '0.375rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          background: typeColors.bg,
                          color: typeColors.text,
                        }}
                      >
                        {getTypeLabel(item.type)}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#6B7280' }}>
                        <Calendar style={{ width: '0.875rem', height: '0.875rem' }} />
                        <span style={{ fontSize: '0.8125rem' }}>
                          {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '0.9375rem', color: '#1F2937', margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                      {item.description}
                    </p>

                    {/* Order Info */}
                    {item.order && (
                      <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0 0 0.75rem 0' }}>
                        Commande #{item.order.orderNumber} • {item.order.total.toFixed(2)} TND
                      </p>
                    )}

                    {/* Reference */}
                    {item.reference && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Package style={{ width: '0.875rem', height: '0.875rem', color: '#9CA3AF' }} />
                        <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontFamily: 'monospace' }}>
                          {item.reference}
                        </span>
                      </div>
                    )}

                    {/* Points */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #E5E7EB' }}>
                      {item.points > 0 ? (
                        <TrendingUp style={{ width: '1.25rem', height: '1.25rem', color: '#10B981' }} />
                      ) : (
                        <TrendingDown style={{ width: '1.25rem', height: '1.25rem', color: '#EF4444' }} />
                      )}
                      <span style={{
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        color: item.points > 0 ? '#10B981' : '#EF4444',
                      }}>
                        {item.points > 0 ? '+' : ''}{item.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1.5rem',
            borderTop: '1px solid #E5E7EB'
          }}>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              style={{
                padding: '0.5rem 1rem',
                background: pagination.page === 1 ? '#F3F4F6' : 'white',
                color: pagination.page === 1 ? '#9CA3AF' : '#4A4A4A',
                border: '2px solid #E5E7EB',
                borderRadius: '0.5rem',
                cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
              }}
            >
              Précédent
            </button>
            <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: '500' }}>
              Page {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              style={{
                padding: '0.5rem 1rem',
                background: pagination.page === pagination.totalPages ? '#F3F4F6' : 'white',
                color: pagination.page === pagination.totalPages ? '#9CA3AF' : '#4A4A4A',
                border: '2px solid #E5E7EB',
                borderRadius: '0.5rem',
                cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
              }}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
