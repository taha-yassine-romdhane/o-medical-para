'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, History, Gift, X, TrendingUp, TrendingDown, Calendar, Package } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  fidelityPoints: number;
  createdAt: string;
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

export default function FidelityPointsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [points, setPoints] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyPagination, setHistoryPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [search, pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      const response = await fetch(`/api/fidelity-points?${params}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/fidelity-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          points: parseInt(points),
          description,
          reference,
        }),
      });

      if (response.ok) {
        setShowAddModal(false);
        setSelectedUser(null);
        setPoints('');
        setDescription('');
        setReference('');
        fetchUsers();
        alert('Points ajoutés avec succès!');
      } else {
        const data = await response.json();
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding points:', error);
      alert('Erreur lors de l\'ajout des points');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'CLIENT':
        return 'Client';
      case 'ADMIN':
        return 'Admin';
      case 'EMPLOYEE':
        return 'Employé';
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'CLIENT':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      case 'ADMIN':
        return { bg: '#FEE2E2', text: '#991B1B' };
      case 'EMPLOYEE':
        return { bg: '#E0E7FF', text: '#3730A3' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const fetchUserHistory = async (userId: string) => {
    try {
      setLoadingHistory(true);
      const params = new URLSearchParams({
        page: historyPagination.page.toString(),
        limit: historyPagination.limit.toString(),
      });
      const response = await fetch(`/api/fidelity-points/${userId}?${params}`);
      const data = await response.json();

      if (response.ok) {
        setHistory(data.history);
        setHistoryPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleShowHistory = (user: User) => {
    setSelectedUser(user);
    setShowHistoryModal(true);
    setHistoryPagination({ ...historyPagination, page: 1 });
    fetchUserHistory(user.id);
  };

  useEffect(() => {
    if (showHistoryModal && selectedUser) {
      fetchUserHistory(selectedUser.id);
    }
  }, [historyPagination.page]);

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
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                borderRadius: '50%',
                padding: '0.75rem',
                boxShadow: '0 4px 12px rgba(126, 211, 33, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Gift style={{ color: 'white', width: '1.75rem', height: '1.75rem' }} />
              </div>
              Points de Fidélité
            </h1>
            <p style={{ color: '#6B7280', marginTop: '0.5rem', marginLeft: '3.75rem' }}>
              {pagination.total} clients au total
            </p>
          </div>
        </div>

        {/* Search */}
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
              placeholder="Rechercher par nom, email ou téléphone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
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
        </div>
      </div>

      {/* Users Table */}
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
                Client
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Email
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Téléphone
              </th>
              <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Rôle
              </th>
              <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Points Disponibles
              </th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                  Chargement...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                  Aucun client trouvé
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const roleColors = getRoleBadgeColor(user.role);
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '1rem' }}>
                      <p style={{ fontWeight: '600', color: '#1F2937', fontSize: '0.875rem' }}>
                        {user.firstName} {user.lastName}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.125rem' }}>
                        Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4A4A4A' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4A4A4A' }}>
                      {user.phone || '-'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          background: roleColors.bg,
                          color: roleColors.text,
                        }}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.15) 0%, rgba(126, 211, 33, 0.05) 100%)',
                        color: '#2D5F2A',
                        border: '2px solid #7ED321',
                      }}
                    >
                      {user.fidelityPoints.toLocaleString()} pts
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowAddModal(true);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                        color: 'white',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginRight: '0.5rem',
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Ajuster
                    </button>
                    <button
                      onClick={() => handleShowHistory(user)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: '#F3F4F6',
                        color: '#4A4A4A',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      <History className="h-4 w-4" />
                      Historique
                    </button>
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

      {/* Add/Deduct Points Modal */}
      {showAddModal && selectedUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>
              Ajuster les Points
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              {selectedUser.firstName} {selectedUser.lastName} - Points actuels: {selectedUser.fidelityPoints.toLocaleString()}
            </p>

            <form onSubmit={handleAddPoints}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Points (positif pour ajouter, négatif pour déduire) *
                </label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  required
                  placeholder="Ex: 5000 ou -2000"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Description *
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Ex: Achat en magasin - Facture #12345"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Référence (optionnel)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ex: FACTURE-12345"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={submitting}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#F3F4F6',
                    color: '#4A4A4A',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: submitting ? '#9CA3AF' : 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Traitement...' : 'Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
            overflowY: 'auto',
          }}
          onClick={() => setShowHistoryModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: 'white',
              zIndex: 10,
            }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                  Historique des Points
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0.25rem 0 0 0' }}>
                  {selectedUser.firstName} {selectedUser.lastName} - {selectedUser.fidelityPoints.toLocaleString()} points disponibles
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                style={{
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X className="h-5 w-5" style={{ color: '#6B7280' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              {loadingHistory ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                  Chargement...
                </div>
              ) : history.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center' }}>
                  <Gift style={{ width: '3rem', height: '3rem', color: '#D1D5DB', margin: '0 auto 1rem' }} />
                  <p style={{ color: '#6B7280', fontSize: '1rem', fontWeight: '500', margin: 0 }}>
                    Aucune transaction pour le moment
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
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
                              {new Date(item.createdAt).toLocaleDateString('fr-FR')} à{' '}
                              {new Date(item.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
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

              {/* Pagination */}
              {historyPagination.totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #E5E7EB'
                }}>
                  <button
                    onClick={() => setHistoryPagination({ ...historyPagination, page: historyPagination.page - 1 })}
                    disabled={historyPagination.page === 1}
                    style={{
                      padding: '0.5rem 1rem',
                      background: historyPagination.page === 1 ? '#F3F4F6' : 'white',
                      color: historyPagination.page === 1 ? '#9CA3AF' : '#4A4A4A',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      cursor: historyPagination.page === 1 ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                    }}
                  >
                    Précédent
                  </button>
                  <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: '500' }}>
                    Page {historyPagination.page} / {historyPagination.totalPages}
                  </span>
                  <button
                    onClick={() => setHistoryPagination({ ...historyPagination, page: historyPagination.page + 1 })}
                    disabled={historyPagination.page === historyPagination.totalPages}
                    style={{
                      padding: '0.5rem 1rem',
                      background: historyPagination.page === historyPagination.totalPages ? '#F3F4F6' : 'white',
                      color: historyPagination.page === historyPagination.totalPages ? '#9CA3AF' : '#4A4A4A',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      cursor: historyPagination.page === historyPagination.totalPages ? 'not-allowed' : 'pointer',
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
        </div>
      )}
    </div>
  );
}
