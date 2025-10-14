'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, Mail, Shield, Edit, Trash2, UserCog, Users as UsersIcon } from 'lucide-react';
import AddUserModal from '@/components/dashboard/AddUserModal';
import EditUserModal from '@/components/dashboard/EditUserModal';

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Check if user is ADMIN
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/dashboard/admin');
    }
  }, [session, status, router]);

  // Fetch admin users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          setAdminUsers(data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user.role === 'ADMIN') {
      fetchUsers();
    }
  }, [session]);

  const getRoleBadgeColor = (role: string) => {
    if (role === 'ADMIN') return { bg: '#D1FAE5', text: '#065F46' };
    if (role === 'EMPLOYEE') return { bg: '#DBEAFE', text: '#1E40AF' };
    return { bg: '#F3F4F6', text: '#6B7280' };
  };

  const getRoleLabel = (role: string) => {
    if (role === 'ADMIN') return 'Administrateur';
    if (role === 'EMPLOYEE') return 'Employé';
    return role;
  };

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#6B7280' }}>Chargement...</p>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div>
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditUserModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} user={selectedUser} />

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937' }}>
              Gestion des Utilisateurs
            </h1>
            <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
              {adminUsers.length} utilisateur{adminUsers.length !== 1 ? 's' : ''} administratif{adminUsers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
              color: 'white',
              borderRadius: '0.75rem',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(126, 211, 33, 0.3)',
            }}
          >
            <Plus className="h-5 w-5" />
            Nouvel Utilisateur
          </button>
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
                Utilisateur
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Contact
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Rôle
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Statut
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Dernière connexion
              </th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#6B7280' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              adminUsers.map((user) => {
                const roleColors = getRoleBadgeColor(user.role);
                const isCurrentUser = session.user.id === user.id;
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <p style={{ fontWeight: '600', color: '#1F2937', fontSize: '0.9375rem' }}>
                            {user.firstName} {user.lastName}
                          </p>
                          {isCurrentUser && (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '9999px',
                                background: '#7ED321',
                                color: 'white',
                                fontWeight: '600',
                              }}
                            >
                              Vous
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.125rem' }}>
                          Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Mail style={{ width: '0.875rem', height: '0.875rem', color: '#9CA3AF' }} />
                          <span style={{ fontSize: '0.875rem', color: '#4A4A4A' }}>{user.email}</span>
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{user.phone}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          background: roleColors.bg,
                          color: roleColors.text,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                        }}
                      >
                        <Shield style={{ width: '0.875rem', height: '0.875rem' }} />
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          background: user.isActive ? '#D1FAE5' : '#FEE2E2',
                          color: user.isActive ? '#065F46' : '#991B1B',
                        }}
                      >
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4A4A4A' }}>
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR')
                        : 'Jamais'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEdit(user)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: '#F3F4F6',
                            color: '#4A4A4A',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          Modifier
                        </button>
                        {!isCurrentUser && (
                          <button
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem 1rem',
                              background: '#FEE2E2',
                              color: '#991B1B',
                              border: 'none',
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Info Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <div
          style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(126, 211, 33, 0.1) 0%, rgba(107, 184, 30, 0.1) 100%)',
            border: '1px solid #7ED321',
            borderRadius: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <UserCog className="h-5 w-5" style={{ color: '#7ED321' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937' }}>
              Administrateurs
            </h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#4A4A4A', lineHeight: '1.6' }}>
            Les administrateurs ont accès à toutes les fonctionnalités incluant les statistiques et la gestion des utilisateurs.
          </p>
        </div>
        <div
          style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
            border: '1px solid #3B82F6',
            borderRadius: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <UsersIcon className="h-5 w-5" style={{ color: '#3B82F6' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937' }}>
              Employés
            </h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#4A4A4A', lineHeight: '1.6' }}>
            Les employés ont accès au tableau de bord mais ne peuvent pas voir les statistiques ni gérer les utilisateurs.
          </p>
        </div>
      </div>
    </div>
  );
}