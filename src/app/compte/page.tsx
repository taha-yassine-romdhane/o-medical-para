'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, Edit, Package, Heart, CreditCard, Settings, Plus, X, Trash2, Award } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useEffect, useState } from 'react';

interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  governorate: string;
  postalCode: string;
  phone?: string;
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
  fidelityPoints: number;
  createdAt: string;
  addresses: Address[];
}

export default function ComptePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [hasGoogleOAuth, setHasGoogleOAuth] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);
  const [formData, setFormData] = useState({
    label: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    governorate: '',
    postalCode: '',
    phone: '',
    isDefault: false,
  });
  const [profileFormData, setProfileFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    region: '',
    dateOfBirth: '',
    gender: '',
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

    const fetchOAuthStatus = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/user/oauth-status');
          if (response.ok) {
            const data = await response.json();
            setHasGoogleOAuth(data.hasGoogleOAuth);
            setHasPassword(data.hasPassword);
          }
        } catch (error) {
          console.error('Error fetching OAuth status:', error);
        }
      }
    };

    fetchUserProfile();
    fetchOAuthStatus();
  }, [status]);

  const openEditProfileModal = () => {
    if (userProfile) {
      setProfileFormData({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone,
        region: userProfile.region,
        dateOfBirth: userProfile.dateOfBirth ? userProfile.dateOfBirth.split('T')[0] : '',
        gender: userProfile.gender || '',
      });
    }
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileFormData),
      });

      if (response.ok) {
        const profileResponse = await fetch('/api/user/profile');
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          setUserProfile(data.user);
        }
        setShowEditProfileModal(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChangePassword = async () => {
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        }),
      });

      if (response.ok) {
        setShowPasswordModal(false);
        setPasswordFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        alert('Mot de passe modifié avec succès');
      } else {
        const data = await response.json();
        alert(data.error || 'Erreur lors de la modification du mot de passe');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Erreur lors de la modification du mot de passe');
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      label: '',
      firstName: userProfile?.firstName || '',
      lastName: userProfile?.lastName || '',
      address: '',
      city: '',
      governorate: '',
      postalCode: '',
      phone: userProfile?.phone || '',
      isDefault: false,
    });
    setShowAddressModal(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      governorate: address.governorate,
      postalCode: address.postalCode,
      phone: address.phone || '',
      isDefault: address.isDefault,
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = async () => {
    try {
      const url = editingAddress
        ? `/api/user/addresses/${editingAddress.id}`
        : '/api/user/addresses';

      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Refresh profile data
        const profileResponse = await fetch('/api/user/profile');
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          setUserProfile(data.user);
        }
        setShowAddressModal(false);
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) return;

    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh profile data
        const profileResponse = await fetch('/api/user/profile');
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          setUserProfile(data.user);
        }
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

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
    <div className="min-h-screen bg-gray-50 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Mon Compte
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#7ED321] to-[#6AB81E] flex items-center justify-center text-white text-2xl sm:text-3xl font-bold flex-shrink-0">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : session.user.name}
                    </h2>
                    {hasGoogleOAuth && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full" title="Compte lié avec Google">
                        <FcGoogle className="h-4 w-4" />
                        <span className="text-xs font-semibold text-gray-700">Google</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Membre depuis {userProfile ? new Date(userProfile.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '...'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!hasGoogleOAuth && (
                  <button
                    onClick={openEditProfileModal}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                  </button>
                )}
                {hasPassword && (
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#7ED321] to-[#6AB81E] text-white rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
                  >
                    <span>Mot de passe</span>
                  </button>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-[#7ED321]" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">
                    Email
                  </span>
                </div>
                <p className="text-sm md:text-base text-gray-900 font-medium">
                  {session.user.email}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-[#7ED321]" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">
                    Téléphone
                  </span>
                </div>
                <p className={`text-sm md:text-base ${userProfile?.phone ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {userProfile?.phone || 'Non renseigné'}
                </p>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-[#7ED321]" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">
                    Points de Fidélité
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-gradient-to-r from-[#7ED321] to-[#6AB81E] text-white rounded-lg text-sm md:text-base font-bold">
                    {userProfile?.fidelityPoints || 0} points
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#7ED321]" />
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Adresses de livraison
                    </span>
                  </div>
                  <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#7ED321] to-[#6AB81E] text-white rounded-lg text-xs font-semibold hover:scale-105 transition-transform"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>
                {userProfile?.addresses && userProfile.addresses.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {userProfile.addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`relative p-3 sm:p-4 bg-gray-50 rounded-lg ${
                          address.isDefault
                            ? 'pt-8 sm:pt-10 border-2 border-[#7ED321]'
                            : 'border border-gray-200'
                        }`}
                      >
                        {address.isDefault && (
                          <span className="absolute top-2 right-2 text-[10px] font-bold text-[#7ED321] bg-[#7ED321]/10 px-2 py-0.5 rounded">
                            PAR DÉFAUT
                          </span>
                        )}
                        <div className={`flex justify-between items-start mb-2 ${address.isDefault ? 'mt-1' : ''}`}>
                          <p className="text-sm font-bold text-gray-900">
                            {address.label}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(address)}
                              className="text-[#7ED321] hover:text-[#6AB81E] transition-colors p-1"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-900 mb-1">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-sm text-gray-700 mb-1">
                          {address.address}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {address.postalCode} {address.city}, {address.governorate}
                        </p>
                        {address.phone && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Tél: {address.phone}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Aucune adresse enregistrée
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Address Modal */}
        {showAddressModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '1rem',
            }}
            onClick={() => setShowAddressModal(false)}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #E5E7EB',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                  {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
                </h2>
                <button
                  onClick={() => setShowAddressModal(false)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    transition: 'background-color 0.2s',
                    color: '#6B7280',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Label */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Libellé *
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="Maison, Bureau, etc."
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>

                  {/* First Name & Last Name */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Prénom *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Adresse complète *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Rue, numéro, etc."
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>

                  {/* City & Governorate */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Ville *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Gouvernorat *
                      </label>
                      <select
                        value={formData.governorate}
                        onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Tunis">Tunis</option>
                        <option value="Ariana">Ariana</option>
                        <option value="Ben Arous">Ben Arous</option>
                        <option value="Manouba">Manouba</option>
                        <option value="Nabeul">Nabeul</option>
                        <option value="Zaghouan">Zaghouan</option>
                        <option value="Bizerte">Bizerte</option>
                        <option value="Béja">Béja</option>
                        <option value="Jendouba">Jendouba</option>
                        <option value="Kef">Kef</option>
                        <option value="Siliana">Siliana</option>
                        <option value="Sousse">Sousse</option>
                        <option value="Monastir">Monastir</option>
                        <option value="Mahdia">Mahdia</option>
                        <option value="Sfax">Sfax</option>
                        <option value="Kairouan">Kairouan</option>
                        <option value="Kasserine">Kasserine</option>
                        <option value="Sidi Bouzid">Sidi Bouzid</option>
                        <option value="Gabès">Gabès</option>
                        <option value="Medenine">Medenine</option>
                        <option value="Tataouine">Tataouine</option>
                        <option value="Gafsa">Gafsa</option>
                        <option value="Tozeur">Tozeur</option>
                        <option value="Kébili">Kébili</option>
                      </select>
                    </div>
                  </div>

                  {/* Postal Code & Phone */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Code postal *
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      />
                    </div>
                  </div>

                  {/* Default checkbox */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                        Définir comme adresse par défaut
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '1.5rem',
                  borderTop: '1px solid #E5E7EB',
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setShowAddressModal(false)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    backgroundColor: '#F3F4F6',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveAddress}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white',
                    background: 'linear-gradient(to right, #7ED321, #6AB81E)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {editingAddress ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditProfileModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '1rem',
            }}
            onClick={() => setShowEditProfileModal(false)}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #E5E7EB',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                  Modifier le profil
                </h2>
                <button
                  onClick={() => setShowEditProfileModal(false)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    transition: 'background-color 0.2s',
                    color: '#6B7280',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div style={{ padding: '1.5rem' }}>
                {hasGoogleOAuth && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '0.5rem',
                    color: '#1E40AF',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <FcGoogle style={{ width: '1.25rem', height: '1.25rem' }} />
                    <span>Les informations de nom proviennent de votre compte Google et ne peuvent pas être modifiées ici.</span>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Prénom *
                      </label>
                      <input
                        type="text"
                        value={profileFormData.firstName}
                        onChange={(e) => setProfileFormData({ ...profileFormData, firstName: e.target.value })}
                        disabled={hasGoogleOAuth}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          backgroundColor: hasGoogleOAuth ? '#F9FAFB' : 'white',
                          cursor: hasGoogleOAuth ? 'not-allowed' : 'text',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={profileFormData.lastName}
                        onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })}
                        disabled={hasGoogleOAuth}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          backgroundColor: hasGoogleOAuth ? '#F9FAFB' : 'white',
                          cursor: hasGoogleOAuth ? 'not-allowed' : 'text',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={profileFormData.phone}
                      onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Région
                    </label>
                    <input
                      type="text"
                      value={profileFormData.region}
                      onChange={(e) => setProfileFormData({ ...profileFormData, region: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Date de naissance
                      </label>
                      <input
                        type="date"
                        value={profileFormData.dateOfBirth}
                        onChange={(e) => setProfileFormData({ ...profileFormData, dateOfBirth: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Genre
                      </label>
                      <select
                        value={profileFormData.gender}
                        onChange={(e) => setProfileFormData({ ...profileFormData, gender: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '1.5rem',
                  borderTop: '1px solid #E5E7EB',
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setShowEditProfileModal(false)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    backgroundColor: '#F3F4F6',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveProfile}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white',
                    background: 'linear-gradient(to right, #7ED321, #6AB81E)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '1rem',
            }}
            onClick={() => setShowPasswordModal(false)}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                maxWidth: '400px',
                width: '100%',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #E5E7EB',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                  Changer le mot de passe
                </h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    transition: 'background-color 0.2s',
                    color: '#6B7280',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Mot de passe actuel *
                    </label>
                    <input
                      type="password"
                      value={passwordFormData.currentPassword}
                      onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Nouveau mot de passe *
                    </label>
                    <input
                      type="password"
                      value={passwordFormData.newPassword}
                      onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Confirmer le mot de passe *
                    </label>
                    <input
                      type="password"
                      value={passwordFormData.confirmPassword}
                      onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '1.5rem',
                  borderTop: '1px solid #E5E7EB',
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    backgroundColor: '#F3F4F6',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleChangePassword}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white',
                    background: 'linear-gradient(to right, #7ED321, #6AB81E)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Changer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
