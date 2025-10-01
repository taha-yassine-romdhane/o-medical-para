'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, Edit, Package, Heart, CreditCard, Settings, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Address {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  dateOfBirth: string | null;
  gender: string | null;
  createdAt: string;
  addresses: Address[];
}

export default function ComptePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data.user);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchUserProfile();
  }, [status]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #F3F4F6',
            borderTop: '3px solid #7ED321',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Chargement...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '2rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>
            Mon Compte
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Profile Card */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            padding: '2rem',
            gridColumn: 'span 2'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: '700'
                }}>
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.25rem' }}>
                    {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : session.user.name}
                  </h2>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                    Membre depuis {userProfile ? new Date(userProfile.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '...'}
                  </p>
                </div>
              </div>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  background: '#F3F4F6',
                  color: '#4A4A4A',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E5E7EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F3F4F6';
                }}
              >
                <Edit className="h-4 w-4" />
                Modifier
              </button>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Mail className="h-4 w-4" style={{ color: '#7ED321' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Email
                  </span>
                </div>
                <p style={{ fontSize: '0.9375rem', color: '#1F2937', fontWeight: '500' }}>
                  {session.user.email}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Phone className="h-4 w-4" style={{ color: '#7ED321' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Téléphone
                  </span>
                </div>
                <p style={{ fontSize: '0.9375rem', color: userProfile?.phone ? '#1F2937' : '#6B7280', fontWeight: userProfile?.phone ? '500' : 'normal' }}>
                  {userProfile?.phone || 'Non renseigné'}
                </p>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin className="h-4 w-4" style={{ color: '#7ED321' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                      Adresses de livraison
                    </span>
                  </div>
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.5rem 0.875rem',
                      background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Ajouter une adresse
                  </button>
                </div>
                {userProfile?.addresses && userProfile.addresses.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {userProfile.addresses.map((address) => (
                      <div
                        key={address.id}
                        style={{
                          padding: '0.875rem',
                          background: '#F9FAFB',
                          borderRadius: '0.5rem',
                          border: address.isDefault ? '2px solid #7ED321' : '1px solid #E5E7EB',
                          position: 'relative'
                        }}
                      >
                        {address.isDefault && (
                          <span style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            fontSize: '0.625rem',
                            fontWeight: '700',
                            color: '#7ED321',
                            background: 'rgba(126, 211, 33, 0.1)',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '0.25rem'
                          }}>
                            PAR DÉFAUT
                          </span>
                        )}
                        <p style={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: '500', marginBottom: '0.25rem' }}>
                          {address.street}
                        </p>
                        <p style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                          {address.postalCode} {address.city}, {address.country}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.9375rem', color: '#6B7280' }}>
                    Aucune adresse enregistrée
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
              Accès rapide
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a
                href="/compte/commandes"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#4A4A4A',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F9FAFB';
                  e.currentTarget.style.color = '#7ED321';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#4A4A4A';
                }}
              >
                <Package className="h-5 w-5" />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Mes Commandes</span>
              </a>

              <a
                href="/favoris"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#4A4A4A',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F9FAFB';
                  e.currentTarget.style.color = '#7ED321';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#4A4A4A';
                }}
              >
                <Heart className="h-5 w-5" />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Mes Favoris</span>
              </a>

              <a
                href="/compte/paiements"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#4A4A4A',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F9FAFB';
                  e.currentTarget.style.color = '#7ED321';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#4A4A4A';
                }}
              >
                <CreditCard className="h-5 w-5" />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Moyens de Paiement</span>
              </a>

              <a
                href="/compte/parametres"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#4A4A4A',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F9FAFB';
                  e.currentTarget.style.color = '#7ED321';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#4A4A4A';
                }}
              >
                <Settings className="h-5 w-5" />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Paramètres</span>
              </a>
            </div>
          </div>

          {/* Stats Card */}
          <div style={{
            background: 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
            borderRadius: '1rem',
            padding: '1.5rem',
            color: 'white'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem' }}>
              Statistiques
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                  Commandes totales
                </p>
                <p style={{ fontSize: '2rem', fontWeight: '700' }}>0</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                  Points de fidélité
                </p>
                <p style={{ fontSize: '2rem', fontWeight: '700' }}>0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
