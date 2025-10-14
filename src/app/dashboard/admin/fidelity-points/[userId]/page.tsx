'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Package } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fidelityPoints: number;
}

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

export default function UserFidelityHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  useEffect(() => {
    fetchHistory();
  }, [userId, pagination.page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      const response = await fetch(`/api/fidelity-points/${userId}?${params}`);
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setHistory(data.history);
        setPagination(data.pagination);
      } else {
        alert(`Erreur: ${data.error}`);
        router.back();
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      alert('Erreur lors de la récupération de l\'historique');
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
        return 'Déduction manuelle';
      case 'REDEEMED':
        return 'Utilisation';
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

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#F3F4F6',
          color: '#4A4A4A',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: '500',
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </button>

      {/* Header */}
      {user && (
        <div style={{
          background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white',
        }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {user.firstName} {user.lastName}
          </h1>
          <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
            {user.email}
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
          }}>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              Points de Fidélité Disponibles
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700' }}>
              {user.fidelityPoints.toLocaleString()} pts
            </p>
          </div>
        </div>
      )}

      {/* History Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937' }}>
            Historique des Transactions
          </h2>
          <p style={{ color: '#6B7280', marginTop: '0.25rem', fontSize: '0.875rem' }}>
            {pagination.total} transaction{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Date
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Type
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Description
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Référence
              </th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                  Chargement...
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                  Aucune transaction trouvée
                </td>
              </tr>
            ) : (
              history.map((item) => {
                const typeColors = getTypeColor(item.type);
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar style={{ width: '1rem', height: '1rem', color: '#9CA3AF' }} />
                        <div>
                          <p style={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: '500' }}>
                            {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                            {new Date(item.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          background: typeColors.bg,
                          color: typeColors.text,
                        }}
                      >
                        {getTypeLabel(item.type)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4A4A4A' }}>
                      {item.description}
                      {item.order && (
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                          Total commande: {item.order.total.toFixed(2)} TND
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {item.reference ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Package style={{ width: '1rem', height: '1rem', color: '#9CA3AF' }} />
                          <span style={{ fontSize: '0.875rem', color: '#4A4A4A', fontFamily: 'monospace' }}>
                            {item.reference}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {item.points > 0 ? (
                          <TrendingUp style={{ width: '1.25rem', height: '1.25rem', color: '#10B981' }} />
                        ) : (
                          <TrendingDown style={{ width: '1.25rem', height: '1.25rem', color: '#EF4444' }} />
                        )}
                        <span style={{
                          fontSize: '0.9375rem',
                          fontWeight: '700',
                          color: item.points > 0 ? '#10B981' : '#EF4444',
                        }}>
                          {item.points > 0 ? '+' : ''}{item.points.toLocaleString()} pts
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

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
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '500',
              }}
            >
              Précédent
            </button>
            <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
              Page {pagination.page} sur {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              style={{
                padding: '0.5rem 1rem',
                background: pagination.page === pagination.totalPages ? '#F3F4F6' : 'white',
                color: pagination.page === pagination.totalPages ? '#9CA3AF' : '#4A4A4A',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer',
                fontWeight: '500',
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
