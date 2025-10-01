import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Search, Filter, Mail, Phone, MapPin } from 'lucide-react';

export default async function UsersPage() {
  const session = await auth();

  // Fetch users (clients only)
  const users = await prisma.user.findMany({
    where: {
      role: 'CLIENT',
    },
    include: {
      _count: {
        select: { orders: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937' }}>
              Gestion des Clients
            </h1>
            <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>
              {users.length} clients enregistrés
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
              placeholder="Rechercher un client..."
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

      {/* Users Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {users.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '3rem',
              textAlign: 'center',
              background: 'white',
              borderRadius: '1rem',
              border: '2px dashed #E5E7EB',
            }}
          >
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#6B7280' }}>
              Aucun client trouvé
            </p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #E5E7EB',
                transition: 'all 0.2s',
              }}
            >
              {/* User Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937' }}>
                    {user.firstName} {user.lastName}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                    Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: user.isActive ? '#D1FAE5' : '#F3F4F6',
                    color: user.isActive ? '#065F46' : '#6B7280',
                  }}
                >
                  {user.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>

              {/* User Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail style={{ width: '1rem', height: '1rem', color: '#9CA3AF' }} />
                  <span style={{ fontSize: '0.875rem', color: '#4A4A4A' }}>{user.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone style={{ width: '1rem', height: '1rem', color: '#9CA3AF' }} />
                  <span style={{ fontSize: '0.875rem', color: '#4A4A4A' }}>{user.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin style={{ width: '1rem', height: '1rem', color: '#9CA3AF' }} />
                  <span style={{ fontSize: '0.875rem', color: '#4A4A4A' }}>{user.region}</span>
                </div>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #F3F4F6',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Commandes</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', marginTop: '0.25rem' }}>
                    {user._count.orders}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Dernière connexion</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4A4A4A', marginTop: '0.25rem' }}>
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR') : 'Jamais'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}