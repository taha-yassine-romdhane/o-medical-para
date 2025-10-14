'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Gift, TrendingUp, Info } from 'lucide-react';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  points: number;
  type: string;
  description: string;
  createdAt: string;
}

export default function FidelityPointsWidget() {
  const { data: session } = useSession();
  const [points, setPoints] = useState<number>(0);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchPoints();
    }
  }, [session]);

  const fetchPoints = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/fidelity-points/${session?.user?.id}?limit=3`);
      const data = await response.json();

      if (response.ok) {
        setPoints(data.user.fidelityPoints);
        setRecentHistory(data.history);
      }
    } catch (error) {
      console.error('Error fetching fidelity points:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'EARNED_PURCHASE':
        return 'Achat';
      case 'MANUAL_ADD':
        return 'Ajout';
      case 'MANUAL_DEDUCT':
        return 'Déduction';
      case 'REDEEMED':
        return 'Utilisé';
      case 'REFUND':
        return 'Remboursement';
      default:
        return type;
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
        borderRadius: '1rem',
        padding: '1.5rem',
        color: 'white',
        boxShadow: '0 10px 30px rgba(126, 211, 33, 0.3)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          padding: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Gift style={{ width: '1.5rem', height: '1.5rem' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
            Points de Fidélité
          </h2>
          <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>
            Gagnez des points à chaque achat
          </p>
        </div>
      </div>

      {/* Points Display */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        marginBottom: '1rem',
        backdropFilter: 'blur(10px)',
      }}>
        {loading ? (
          <p style={{ textAlign: 'center', fontSize: '0.875rem' }}>Chargement...</p>
        ) : (
          <>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              Points Disponibles
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>
              {points.toLocaleString()}
            </p>
            <p style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
              points
            </p>
          </>
        )}
      </div>

      {/* Info Box */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '0.5rem',
        padding: '0.75rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'start',
        gap: '0.5rem',
      }}>
        <Info style={{ width: '1rem', height: '1rem', marginTop: '0.125rem', flexShrink: 0 }} />
        <p style={{ fontSize: '0.8125rem', opacity: 0.9, margin: 0 }}>
          Gagnez 2% de chaque commande livrée en points. Par exemple, une commande de 200 TND = 4000 points!
        </p>
      </div>

      {/* Recent Activity */}
      {recentHistory.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', opacity: 0.9 }}>
            Activité Récente
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: '600', margin: 0 }}>
                    {getTypeLabel(item.type)}
                  </p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: '0.125rem 0 0 0' }}>
                    {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <TrendingUp style={{ width: '0.875rem', height: '0.875rem' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>
                    {item.points > 0 ? '+' : ''}{item.points.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View All Link */}
      <Link
        href="/account/fidelity-points"
        style={{
          display: 'block',
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          textAlign: 'center',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: '600',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        Voir l&apos;historique complet
      </Link>
    </div>
  );
}
