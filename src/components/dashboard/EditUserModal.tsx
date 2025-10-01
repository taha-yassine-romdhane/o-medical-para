'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Shield, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    region: string;
    role: string;
    isActive: boolean;
  } | null;
}

export default function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    region: '',
    role: 'EMPLOYEE' as 'ADMIN' | 'EMPLOYEE',
    isActive: true,
    changePassword: false,
    newPassword: '',
    confirmPassword: '',
  });

  const tunisianRegions = [
    'Ariana',
    'Béja',
    'Ben Arous',
    'Bizerte',
    'Gabès',
    'Gafsa',
    'Jendouba',
    'Kairouan',
    'Kasserine',
    'Kébili',
    'Le Kef',
    'Mahdia',
    'La Manouba',
    'Médenine',
    'Monastir',
    'Nabeul',
    'Sfax',
    'Sidi Bouzid',
    'Siliana',
    'Sousse',
    'Tataouine',
    'Tozeur',
    'Tunis',
    'Zaghouan',
  ];

  // Populate form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        region: user.region,
        role: user.role as 'ADMIN' | 'EMPLOYEE',
        isActive: user.isActive,
        changePassword: false,
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.changePassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      if (formData.newPassword.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          region: formData.region,
          role: formData.role,
          isActive: formData.isActive,
          ...(formData.changePassword && { password: formData.newPassword }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue');
        return;
      }

      // Success - close modal and refresh
      onClose();
      router.refresh();
      window.location.reload();
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1F2937' }}>
            Modifier l'Utilisateur
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            <X className="h-6 w-6" style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '0.5rem',
                color: '#991B1B',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Name Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
                  Prénom
                </label>
                <div style={{ position: 'relative' }}>
                  <User
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
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 3rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.75rem',
                      fontSize: '0.9375rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#7ED321';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
                  Nom
                </label>
                <div style={{ position: 'relative' }}>
                  <User
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
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 3rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.75rem',
                      fontSize: '0.9375rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#7ED321';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
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
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 3rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#7ED321';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                />
              </div>
            </div>

            {/* Phone and Region Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
                  Téléphone
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone
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
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 3rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.75rem',
                      fontSize: '0.9375rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#7ED321';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  />
                </div>
              </div>

              {/* Region */}
              <div>
                <label
                  htmlFor="region"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
                  Gouvernorat
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '1.25rem',
                      height: '1.25rem',
                      color: '#9CA3AF',
                      pointerEvents: 'none',
                      zIndex: 1,
                    }}
                  />
                  <select
                    id="region"
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 3rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.75rem',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      appearance: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#7ED321';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  >
                    {tunisianRegions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Role and Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
                  Rôle
                </label>
                <div style={{ position: 'relative' }}>
                  <Shield
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '1.25rem',
                      height: '1.25rem',
                      color: '#9CA3AF',
                      pointerEvents: 'none',
                      zIndex: 1,
                    }}
                  />
                  <select
                    id="role"
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'EMPLOYEE' })
                    }
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 3rem',
                      border: '2px solid #E5E7EB',
                      borderRadius: '0.75rem',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      appearance: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#7ED321';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  >
                    <option value="EMPLOYEE">Employé</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="isActive"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
                  Statut
                </label>
                <select
                  id="isActive"
                  value={formData.isActive ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.value === 'true' })
                  }
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    appearance: 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#7ED321';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>
            </div>

            {/* Change Password Checkbox */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.changePassword}
                  onChange={(e) =>
                    setFormData({ ...formData, changePassword: e.target.checked })
                  }
                  style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                  Changer le mot de passe
                </span>
              </label>
            </div>

            {/* Password Fields - Only show if changePassword is checked */}
            {formData.changePassword && (
              <>
                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Nouveau mot de passe
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
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
                      id="newPassword"
                      type="password"
                      required={formData.changePassword}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem 0.875rem 3rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.75rem',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#7ED321';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#E5E7EB';
                      }}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Confirmer le mot de passe
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
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
                      id="confirmPassword"
                      type="password"
                      required={formData.changePassword}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem 0.875rem 3rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.75rem',
                        fontSize: '0.9375rem',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#7ED321';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#E5E7EB';
                      }}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: '#F3F4F6',
                color: '#4A4A4A',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: isLoading
                  ? '#9CA3AF'
                  : 'linear-gradient(135deg, #7ED321 0%, #6AB81E 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}