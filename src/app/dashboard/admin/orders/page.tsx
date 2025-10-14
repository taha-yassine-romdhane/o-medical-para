'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, X, Package, MapPin, User, Phone, Mail, Calendar, CreditCard } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  address?: {
    address: string;
    city: string;
    governorate: string;
    postalCode: string;
    phone?: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    total: number;
    product: {
      name: string;
      reference: string;
      images: Array<{ url: string; isPrimary: boolean }>;
    };
  }>;
  _count: {
    items: number;
  };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter, paymentFilter, pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter && { status: statusFilter }),
        ...(paymentFilter && { paymentStatus: paymentFilter }),
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
        alert(data.message || 'Statut mis à jour avec succès!');
      } else {
        const data = await response.json();
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: string) => {
    try {
      setUpdatingStatus(true);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });

      if (response.ok) {
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          const data = await response.json();
          setSelectedOrder(data.order);
        }
        alert('Statut de paiement mis à jour avec succès!');
      } else {
        const data = await response.json();
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Erreur lors de la mise à jour du statut de paiement');
    } finally {
      setUpdatingStatus(false);
    }
  };

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
      case 'REFUNDED':
        return { bg: '#FED7AA', text: '#9A3412' };
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
      case 'REFUNDED':
        return 'Remboursée';
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
      case 'CANCELLED':
        return { bg: '#F3F4F6', text: '#6B7280' };
      case 'REFUNDED':
        return { bg: '#FED7AA', text: '#9A3412' };
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
      case 'CANCELLED':
        return 'Annulé';
      case 'REFUNDED':
        return 'Remboursé';
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
              {pagination.total} commandes au total
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
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
              placeholder="Rechercher par N° commande, client..."
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.5rem',
              background: showFilters ? '#7ED321' : 'white',
              color: showFilters ? 'white' : '#4A4A4A',
              border: `2px solid ${showFilters ? '#7ED321' : '#E5E7EB'}`,
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9375rem',
            }}
          >
            <Filter className="h-5 w-5" />
            Filtrer
            {(statusFilter || paymentFilter) && (
              <span style={{
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '9999px',
                padding: '0.125rem 0.5rem',
                fontSize: '0.75rem',
              }}>
                {[statusFilter, paymentFilter].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{
            background: 'white',
            border: '2px solid #E5E7EB',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginTop: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Statut Commande
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              >
                <option value="">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmée</option>
                <option value="PROCESSING">En traitement</option>
                <option value="SHIPPED">Expédiée</option>
                <option value="DELIVERED">Livrée</option>
                <option value="CANCELLED">Annulée</option>
                <option value="REFUNDED">Remboursée</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Statut Paiement
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              >
                <option value="">Tous les paiements</option>
                <option value="PENDING">En attente</option>
                <option value="COMPLETED">Payé</option>
                <option value="FAILED">Échoué</option>
                <option value="CANCELLED">Annulé</option>
                <option value="REFUNDED">Remboursé</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => {
                  setStatusFilter('');
                  setPaymentFilter('');
                  setPagination({ ...pagination, page: 1 });
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#F3F4F6',
                  color: '#4A4A4A',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  width: '100%',
                }}
              >
                Réinitialiser
              </button>
            </div>
          </div>
        )}
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
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                  Chargement...
                </td>
              </tr>
            ) : orders.length === 0 ? (
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
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        Détails
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

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
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
          onClick={() => setShowOrderModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              maxWidth: '900px',
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
                  Commande #{selectedOrder.orderNumber}
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0.25rem 0 0 0' }}>
                  Passée le {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')} à{' '}
                  {new Date(selectedOrder.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
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
              {/* Status Updates */}
              <div style={{
                background: '#F9FAFB',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
                  Gestion du Statut
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      Statut Commande
                    </label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                      disabled={updatingStatus}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        background: 'white',
                      }}
                    >
                      <option value="PENDING">En attente</option>
                      <option value="CONFIRMED">Confirmée</option>
                      <option value="PROCESSING">En traitement</option>
                      <option value="SHIPPED">Expédiée</option>
                      <option value="DELIVERED">Livrée</option>
                      <option value="CANCELLED">Annulée</option>
                      <option value="REFUNDED">Remboursée</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      Statut Paiement
                    </label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handlePaymentStatusChange(selectedOrder.id, e.target.value)}
                      disabled={updatingStatus}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.5rem',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        background: 'white',
                      }}
                    >
                      <option value="PENDING">En attente</option>
                      <option value="COMPLETED">Payé</option>
                      <option value="FAILED">Échoué</option>
                      <option value="CANCELLED">Annulé</option>
                      <option value="REFUNDED">Remboursé</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer & Address Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{
                  background: '#F9FAFB',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <User style={{ width: '1.25rem', height: '1.25rem', color: '#7ED321' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                      Informations Client
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937', margin: 0 }}>
                        {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                        {selectedOrder.user.email}
                      </p>
                    </div>
                    {selectedOrder.user.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
                        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                          {selectedOrder.user.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedOrder.address && (
                  <div style={{
                    background: '#F9FAFB',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <MapPin style={{ width: '1.25rem', height: '1.25rem', color: '#7ED321' }} />
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                        Adresse de Livraison
                      </h3>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#4A4A4A', lineHeight: '1.6' }}>
                      <p style={{ margin: '0 0 0.5rem 0' }}>{selectedOrder.address.address}</p>
                      <p style={{ margin: 0 }}>
                        {selectedOrder.address.postalCode} {selectedOrder.address.city}
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0' }}>{selectedOrder.address.governorate}</p>
                      {selectedOrder.address.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                          <Phone style={{ width: '1rem', height: '1rem', color: '#6B7280' }} />
                          <p style={{ margin: 0 }}>{selectedOrder.address.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div style={{
                background: '#F9FAFB',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Package style={{ width: '1.25rem', height: '1.25rem', color: '#7ED321' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                    Articles Commandés
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedOrder.items.map((item) => {
                    const primaryImage = item.product.images?.find(img => img.isPrimary) || item.product.images?.[0];
                    return (
                      <div
                        key={item.id}
                        style={{
                          background: 'white',
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'center',
                        }}
                      >
                        {primaryImage && (
                          <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '0.5rem',
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: '#F3F4F6',
                          }}>
                            <img
                              src={primaryImage.url}
                              alt={item.product.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#1F2937', margin: '0 0 0.25rem 0' }}>
                            {item.product.name}
                          </p>
                          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>
                            Réf: {item.product.reference}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#4A4A4A', marginTop: '0.5rem' }}>
                            Quantité: {item.quantity} × {item.unitPrice.toFixed(2)} TND
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '1rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>
                            {item.total.toFixed(2)} TND
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.1) 0%, rgba(126, 211, 33, 0.05) 100%)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: '2px solid #7ED321',
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
                  Récapitulatif
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', color: '#4A4A4A' }}>
                    <span>Sous-total:</span>
                    <span>{selectedOrder.subtotal.toFixed(2)} TND</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', color: '#4A4A4A' }}>
                    <span>Frais de livraison:</span>
                    <span>{selectedOrder.shippingCost.toFixed(2)} TND</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#1F2937',
                    paddingTop: '0.75rem',
                    borderTop: '2px solid #7ED321',
                  }}>
                    <span>Total:</span>
                    <span>{selectedOrder.total.toFixed(2)} TND</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
